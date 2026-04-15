"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import ProcessStepper from "./ProcessStepper";
import RoseProgress, { RosePhase } from "./RoseProgress";

type UploadState = "idle" | "uploading" | "validating" | "importing" | "done" | "error";

export default function UploadSection() {
  const [dragging, setDragging]         = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [schemaType, setSchemaType]     = useState("XML:oBDS_3.0.4_RKI");
  const [uploadState, setUploadState]   = useState<UploadState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMB, setUploadedMB]     = useState(0);
  const [totalMB, setTotalMB]           = useState(0);
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);
  const xhrRef      = useRef<XMLHttpRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    setUploadState("uploading");
    setUploadProgress(0);
    setErrorMsg(null);
    setTotalMB(selectedFile.size / 1_048_576);

    const formData = new FormData();
    formData.append("type", schemaType);
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

    // Server-Antwort -> Phase 3 (Import) und dann Phase 4 (done) gestaffelt
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Erst Validierungs-Animation zeigen (falls noch nicht), dann Import, dann fertig
        setUploadState("importing");
        setTimeout(() => setUploadState("done"), 1500);
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
    setUploadProgress(0);
    setErrorMsg(null);
  };

  // Stepper-Schritt
  const currentStep =
    uploadState === "idle"       ? 1 :
    uploadState === "uploading"  ? 2 :
    uploadState === "validating" ? 2 :
    uploadState === "importing"  ? 3 :
    uploadState === "done"       ? 4 : 1;

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
            Das System validiert sie automatisch gegen das gewaehlte Schema.
          </p>
          <div className="rounded-lg p-6 space-y-5"
            style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>

            {/* Schema-Auswahl */}
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "#000000" }}>
                Schema-Version
              </label>
              <select value={schemaType} onChange={(e) => setSchemaType(e.target.value)}
                className="block w-full rounded border py-2 px-3 text-sm"
                style={{ borderColor: "#D8D8D8", color: "#000000", backgroundColor: "#FFFFFF" }}>
                <option value="XML:oBDS_3.0.4_RKI">oBDS 3.0.4 RKI (aktuell)</option>
                <option value="XML:oBDS_3.0.0.8a_RKI">oBDS 3.0.0.8a RKI (historisch)</option>
              </select>
            </div>

            {/* Drop-Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
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
                : <p className="text-xs mt-1" style={{ color: "#505050" }}>Unterstuetzt: .xml (bis 200 MB)</p>
              }
              <input ref={fileInputRef} id="file" name="file" type="file" accept=".xml" onChange={handleFileChange} className="hidden" />
            </div>

            {/* Button */}
            <button onClick={handleSubmit} disabled={!selectedFile}
              className="w-full py-3 rounded text-white text-sm font-semibold disabled:opacity-40"
              style={{ backgroundColor: "#003063" }}
              onMouseOver={(e) => { if (selectedFile) (e.currentTarget.style.backgroundColor = "#002853"); }}
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

      {/* Erfolg */}
      {uploadState === "done" && (
        <div className="max-w-sm mx-auto text-center">
          <RoseProgress phase="done" uploadProgress={100} />
          <h2 className="text-2xl font-bold mt-6 mb-2" style={{ color: "#003063" }}>Import erfolgreich!</h2>
          <p className="text-sm mb-6" style={{ color: "#505050" }}>
            Die Datei wurde validiert und in die Datenbank importiert.
          </p>
          <button onClick={handleReset}
            className="px-6 py-2 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: "#003063" }}>
            Weitere Datei importieren
          </button>
        </div>
      )}

      {/* Fehler */}
      {uploadState === "error" && (
        <div className="max-w-sm mx-auto text-center">
          <div className="text-5xl mb-4">&#9888;&#65039;</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#E10019" }}>Upload fehlgeschlagen</h2>
          <p className="text-sm mb-6" style={{ color: "#505050" }}>{errorMsg ?? "Unbekannter Fehler."}</p>
          <button onClick={handleReset}
            className="px-6 py-2 rounded text-white text-sm font-semibold"
            style={{ backgroundColor: "#003063" }}>
            Erneut versuchen
          </button>
        </div>
      )}
    </section>
  );
}
