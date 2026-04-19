"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import ProcessStepper from "./ProcessStepper";
import RoseProgress, { RosePhase } from "./RoseProgress";

type UploadState = "idle" | "uploading" | "validating" | "importing" | "done" | "error";

type ImportSummary = {
  patient_count: number | null;
  median_age: number | null;
  min_age: number | null;
  max_age: number | null;
  tumor_count: number | null;
  min_diagnosis_year: number | null;
  max_diagnosis_year: number | null;
};

type SchemaDetection =
  | null
  | { status: "known";       version: string; type: string; label: string }
  | { status: "unsupported"; version: string }
  | { status: "missing" };

const SCHEMA_MAP: Record<string, { label: string; type: string }> = {
  "3.0.4_RKI":    { label: "oBDS 3.0.4 RKI",    type: "XML:oBDS_3.0.4_RKI" },
  "3.0.0.8a_RKI": { label: "oBDS 3.0.0.8a RKI", type: "XML:oBDS_3.0.0.8a_RKI" },
};

const SUPPORTED_LABELS = Object.values(SCHEMA_MAP).map(s => s.label);

async function detectSchemaFromFile(file: File): Promise<SchemaDetection> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const match = text.match(/Schema_Version=['"]([^'"]+)['"]/);
      if (!match) { resolve({ status: "missing" }); return; }
      const version = match[1];
      const entry = SCHEMA_MAP[version];
      if (entry) resolve({ status: "known", version, type: entry.type, label: entry.label });
      else       resolve({ status: "unsupported", version });
    };
    reader.readAsText(file.slice(0, 4096));
  });
}

export default function UploadSection() {
  const [dragging, setDragging]               = useState(false);
  const [selectedFile, setSelectedFile]       = useState<File | null>(null);
  const [schemaDetection, setSchemaDetection] = useState<SchemaDetection>(null);
  const [uploadState, setUploadState]         = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMB, setUploadedMB]     = useState(0);
  const [totalMB, setTotalMB]           = useState(0);
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);
  const [errorStep, setErrorStep]           = useState<number>(2); // Schritt auf dem Fehler passiert ist
  const [additionalInfo, setAdditionalInfo] = useState<{
    hint?: string;
    technical_message?: string;
    category?: string;
    error_type?: string;
  } | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const xhrRef      = useRef<XMLHttpRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const applyFile = (file: File) => {
    setSelectedFile(file);
    setSchemaDetection(null);
    detectSchemaFromFile(file).then(setSchemaDetection);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile || schemaDetection?.status !== "known") return;

    setUploadState("uploading");
    setUploadProgress(0);
    setErrorMsg(null);
    setTotalMB(selectedFile.size / 1_048_576);

    const formData = new FormData();
    formData.append("type", schemaDetection.type);
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    // Phase 1: Stiel waechst mit Upload-Fortschritt
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress((e.loaded / e.total) * 100);
        setUploadedMB(e.loaded / 1_048_576);
      }
    };

    // Upload fertig -> Phase 2: Bluetenblaetter oeffnen sich (Validierung)
    xhr.upload.onload = () => {
      setUploadProgress(100);
      setUploadState("validating");
    };

    // Server-Antwort -> Import startet async, Polling ueberwacht den Status.
    // "validating" bleibt aktiv bis Polling success/failure meldet -- kein voreiliges "importing".
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const { uid } = JSON.parse(xhr.responseText);
        pollImportStatus(uid);
      } else {
        setUploadState("error");
        setErrorMsg("Server hat den Upload abgelehnt (Status " + xhr.status + ").");
      }
    };

    xhr.onerror = () => {
      setUploadState("error");
      setErrorMsg("Netzwerkfehler beim Upload. Bitte erneut versuchen.");
    };

    xhr.open("POST", "/api/report");
    xhr.send(formData);
  };

  const handleReset = () => {
    xhrRef.current?.abort();
    setUploadState("idle");
    setSelectedFile(null);
    setSchemaDetection(null);
    setUploadProgress(0);
    setErrorMsg(null);
    setAdditionalInfo(null);
    setErrorStep(2);
    setImportSummary(null);
  };

  // Pollt GET /api/report/{uid} alle 2s bis status success oder failure.
  // Noetig weil POST /api/report nur die uid zurueckgibt -- der Import laeuft async.
  const pollImportStatus = (uid: string) => {
    const maxAttempts = 60; // 60 x 2s = 120s Timeout
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        setUploadState("error");
        setErrorMsg("Zeitueberschreitung: Der Import hat zu lange gedauert.");
        return;
      }
      try {
        const res = await fetch("/api/report/" + uid);
        if (!res.ok) return; // Verbindungsfehler: naechster Versuch
        const data = await res.json();
        if (data.status === "success") {
          clearInterval(interval);
          // Fetch KPI summary — best-effort, non-blocking
          fetch("/api/report/" + uid + "/summary")
            .then(r => r.ok ? r.json() : null)
            .then(summary => { if (summary) setImportSummary(summary); })
            .catch(() => {});
          setUploadState("done");
        } else if (data.status === "failure") {
          clearInterval(interval);
          const info = data.additional_info ?? null;
          setAdditionalInfo(info);
          setErrorMsg(info?.hint ?? "Import fehlgeschlagen.");
          setUploadState("error");
        }
        // status "created" oder "pending": weiter warten
      } catch (_) { /* Netzwerkfehler: naechster Versuch */ }
    }, 2000);
  };

  // Stepper-Schritt
  // Im Fehlerfall: errorStep zeigt den Schritt wo der Fehler auftrat (kein Zurueckspringen)
  const currentStep =
    uploadState === "idle"       ? 1 :
    uploadState === "uploading"  ? 2 :
    uploadState === "validating" ? 2 :
    uploadState === "importing"  ? 3 :
    uploadState === "done"       ? 5 :  // 5 > 4 → alle Schritte als ✓
    uploadState === "error"      ? errorStep : 1;

  // Rose-Phase
  const rosePhase: RosePhase =
    uploadState === "validating" ? "validating" :
    uploadState === "importing"  ? "importing"  :
    uploadState === "done"       ? "done"       : "uploading";

  const showRose = uploadState !== "idle" && uploadState !== "error";

  return (
    <section className="py-12 px-4">
      {/* Stepper */}
      <div className="mb-10">
        <ProcessStepper currentStep={currentStep} />
      </div>

      {/* Upload-Formular */}
      {uploadState === "idle" && (
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2" style={{ color: "#003063" }}>
            XML-Datei importieren
          </h1>
          <p className="text-center text-sm mb-8" style={{ color: "#505050" }}>
            Laden Sie Ihre oBDS_RKI-konforme XML-Meldedatei hoch.
            Das Schema wird automatisch aus der Datei erkannt und validiert.
          </p>
          <div className="rounded-lg p-6 space-y-5"
            style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>

            {/* Drop-Zone */}
            <label htmlFor="file"
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors"
              style={{ borderColor: dragging ? "#003063" : "#D8D8D8", backgroundColor: dragging ? "#F0F4FF" : "#F2F5F7" }}>
              <span className="text-3xl mb-2">&#128196;</span>
              <p className="text-sm font-medium text-center" style={{ color: "#000000" }}>
                {selectedFile ? selectedFile.name : "XML-Datei hier ablegen oder klicken"}
              </p>
              {selectedFile
                ? <p className="text-xs mt-1" style={{ color: "#505050" }}>{(selectedFile.size / 1_048_576).toFixed(2)} MB</p>
                : <p className="text-xs mt-1" style={{ color: "#505050" }}>Unterstuetzt: .xml bis 200 MB &middot; {SUPPORTED_LABELS.join(" · ")}</p>
              }
              <input ref={fileInputRef} id="file" name="file" type="file" accept=".xml" onChange={handleFileChange} className="sr-only" />
            </label>

            {/* Schema-Erkennungs-Badge */}
            {selectedFile && schemaDetection === null && (
              <p className="text-xs text-center" style={{ color: "#505050" }}>Schema wird erkannt…</p>
            )}
            {schemaDetection?.status === "known" && (
              <div className="flex items-center gap-2 rounded px-3 py-2 text-sm"
                style={{ backgroundColor: "#F0FFF4", border: "1px solid #22C55E" }}>
                <span style={{ color: "#16A34A" }}>&#10003;</span>
                <span style={{ color: "#166534" }}>
                  Schema erkannt: <strong>{schemaDetection.label}</strong>
                </span>
              </div>
            )}
            {schemaDetection?.status === "unsupported" && (
              <div className="rounded px-3 py-2 text-sm"
                style={{ backgroundColor: "#FFF0F0", border: "1px solid #E10019" }}>
                <p className="font-semibold" style={{ color: "#E10019" }}>
                  Unbekanntes Schema: {schemaDetection.version}
                </p>
                <p className="mt-0.5" style={{ color: "#505050" }}>
                  Unterstuetzt werden: {SUPPORTED_LABELS.join(", ")}
                </p>
              </div>
            )}
            {schemaDetection?.status === "missing" && (
              <div className="rounded px-3 py-2 text-sm"
                style={{ backgroundColor: "#FFF8E1", border: "1px solid #F0B429" }}>
                <p className="font-semibold" style={{ color: "#7A4100" }}>Schema-Version nicht gefunden</p>
                <p className="mt-0.5" style={{ color: "#505050" }}>
                  Die Datei enthaelt kein <code>Schema_Version</code>-Attribut. Bitte pruefen Sie, ob es sich um eine gueltige oBDS_RKI-XML-Datei handelt.
                </p>
              </div>
            )}

            {/* Button */}
            <button onClick={handleSubmit}
              disabled={schemaDetection?.status !== "known"}
              className="w-full py-3 rounded text-white text-sm font-semibold disabled:opacity-40"
              style={{ backgroundColor: "#003063" }}
              onMouseOver={(e) => { if (schemaDetection?.status === "known") (e.currentTarget.style.backgroundColor = "#002853"); }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#003063"; }}>
              Datei hochladen
            </button>
          </div>
        </div>
      )}

      {/* Rose — 3 Etappen */}
      {showRose && uploadState !== "done" && (
        <div className="max-w-sm mx-auto text-center">
          <RoseProgress
            phase={rosePhase}
            uploadProgress={uploadProgress}
            uploadedMB={uploadedMB}
            totalMB={totalMB}
          />
        </div>
      )}

      {/* Importbericht */}
      {uploadState === "done" && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <RoseProgress phase="done" uploadProgress={100} />
            <h2 className="text-2xl font-bold mt-6 mb-1" style={{ color: "#003063" }}>Importbericht</h2>
            <p className="text-sm" style={{ color: "#505050" }}>
              Die Datei wurde erfolgreich validiert und importiert.
            </p>
          </div>

          {/* Kennzahlen-Cards */}
          {importSummary && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Patienten */}
              <div className="rounded-lg p-5 text-center"
                style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>
                <div style={{ fontSize: "2em", lineHeight: 1 }}>&#x1F465;</div>
                <div className="text-3xl font-bold mt-2" style={{ color: "#003063" }}>
                  {importSummary.patient_count?.toLocaleString('de-DE') ?? '—'}
                </div>
                <div className="text-sm mt-1 font-semibold" style={{ color: "#505050" }}>Patienten</div>
              </div>

              {/* Diagnosejahre */}
              <div className="rounded-lg p-5 text-center"
                style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>
                <div style={{ fontSize: "2em", lineHeight: 1 }}>&#x1F4C5;</div>
                <div className="text-3xl font-bold mt-2" style={{ color: "#003063" }}>
                  {importSummary.min_diagnosis_year != null && importSummary.max_diagnosis_year != null
                    ? importSummary.min_diagnosis_year === importSummary.max_diagnosis_year
                      ? importSummary.min_diagnosis_year
                      : `${importSummary.min_diagnosis_year}–${importSummary.max_diagnosis_year}`
                    : '—'}
                </div>
                <div className="text-sm mt-1 font-semibold" style={{ color: "#505050" }}>Diagnosejahre</div>
              </div>

              {/* Medianes Alter */}
              <div className="rounded-lg p-5 text-center"
                style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>
                <div style={{ fontSize: "2em", lineHeight: 1 }}>&#x1F4CA;</div>
                <div className="text-3xl font-bold mt-2" style={{ color: "#003063" }}>
                  {importSummary.median_age != null ? `${importSummary.median_age} J.` : '—'}
                </div>
                {importSummary.min_age != null && importSummary.max_age != null && (
                  <div className="text-xs mt-0.5" style={{ color: "#505050" }}>
                    {importSummary.min_age}–{importSummary.max_age} Jahre
                  </div>
                )}
                <div className="text-sm mt-1 font-semibold" style={{ color: "#505050" }}>Medianes Alter</div>
              </div>

              {/* Tumormeldungen */}
              <div className="rounded-lg p-5 text-center"
                style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>
                <div style={{ fontSize: "2em", lineHeight: 1 }}>&#x1F489;</div>
                <div className="text-3xl font-bold mt-2" style={{ color: "#003063" }}>
                  {importSummary.tumor_count?.toLocaleString('de-DE') ?? '—'}
                </div>
                <div className="text-sm mt-1 font-semibold" style={{ color: "#505050" }}>Fälle</div>
              </div>
            </div>
          )}

          {/* R-Umgebung Button */}
          <p className="text-sm text-center mb-3" style={{ color: "#505050" }}>
            Die importierten Daten stehen jetzt in der R-Umgebung bereit.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_CODE_SERVER_URL ?? "http://localhost:8081"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded text-white text-sm font-bold mb-3"
            style={{ backgroundColor: "#003063" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#002853"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#003063"; }}
          >
            <span style={{ fontSize: "1.2em" }}>&#x1F4CA;</span>
            Daten in R-Umgebung analysieren
          </a>
          <button onClick={handleReset}
            className="w-full px-6 py-2 rounded text-sm font-semibold border"
            style={{ color: "#003063", borderColor: "#003063", backgroundColor: "transparent" }}>
            Weitere Datei importieren
          </button>
        </div>
      )}

      {/* Fehler */}
      {uploadState === "error" && (
        <div className="max-w-lg mx-auto">
          {/* Roter Fehler-Banner */}
          <div className="rounded-lg p-5 mb-6"
            style={{ backgroundColor: "#FFF0F0", border: "2px solid #E10019" }}>
            <div className="flex items-start gap-3">
              <span style={{ fontSize: "1.5em", lineHeight: 1 }}>&#9888;&#65039;</span>
              <div className="text-left">
                <h2 className="text-base font-bold mb-1" style={{ color: "#E10019" }}>
                  {additionalInfo?.error_type === "xsd_validation" ? "Validierung fehlgeschlagen" : "Import fehlgeschlagen"}
                </h2>
                <p className="text-sm" style={{ color: "#505050" }}>
                  {errorMsg ?? "Unbekannter Fehler."}
                </p>
              </div>
            </div>
          </div>
          {/* Kontextspezifischer Hinweis fuer Mediziner (F9) */}
          {additionalInfo?.hint ? (
            <div className="rounded-lg p-4 mb-6"
              style={{ backgroundColor: "#FFF8E1", border: "1px solid #F0B429" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#7A4100" }}>Was koennen Sie tun?</p>
              <p className="text-sm" style={{ color: "#505050" }}>{additionalInfo.hint}</p>
            </div>
          ) : (
            <div className="rounded-lg p-4 mb-6"
              style={{ backgroundColor: "#F2F5F7", border: "1px solid #D8D8D8" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "#003063" }}>Was kann ich tun?</p>
              <ul className="text-sm space-y-1" style={{ color: "#505050" }}>
                <li>&#x2022; Stellen Sie sicher, dass die Datei eine gueltige oBDS_RKI-XML ist</li>
                <li>&#x2022; Pruefen Sie, ob das Schema_Version-Attribut korrekt gesetzt ist</li>
                <li>&#x2022; Wenden Sie sich an Ihren IT-Ansprechpartner wenn der Fehler bleibt</li>
              </ul>
            </div>
          )}
          {/* Einklappbare technische Details fuer IT/Admin */}
          {additionalInfo?.technical_message && (
            <details className="mb-6 text-xs" style={{ color: "#505050" }}>
              <summary className="cursor-pointer font-semibold">Technische Details anzeigen</summary>
              <pre className="mt-2 p-3 rounded overflow-x-auto whitespace-pre-wrap"
                style={{ backgroundColor: "#F2F5F7", border: "1px solid #D8D8D8" }}>
                {selectedFile ? `Datei: ${selectedFile.name}

` : ""}{additionalInfo.technical_message}
              </pre>
            </details>
          )}
          <button onClick={handleReset}
            className="w-full py-3 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: "#003063" }}>
            Erneut versuchen
          </button>
        </div>
      )}
    </section>
  );
}
