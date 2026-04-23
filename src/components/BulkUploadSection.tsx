"use client";

import { useState, useRef, useCallback, useEffect, DragEvent, ChangeEvent } from "react";
import Link from "next/link";
import FlowerProgress, { FlowerPhase, FlowerVariant, variantFromString } from "./FlowerProgress";
import { useCodeServerUrl } from "@/lib/codeServerUrl";

// ---- Types ----------------------------------------------------------------

type ImportWarning = {
  patient_id: string;
  tumor_id:   string;
  feld:       string;
  wert:       string;
  kategorie:  string;
  hinweis:    string;
};

type FilePhase = "pending" | "uploading" | "validating" | "importing" | "done" | "error" | "schema-error";

type SchemaDetection =
  | null
  | { status: "known";       version: string; type: string; label: string }
  | { status: "unsupported"; version: string }
  | { status: "missing" };

type ImportSummary = {
  patient_count: number | null;
  median_age: number | null;
  min_age: number | null;
  max_age: number | null;
  tumor_count: number | null;
  min_diagnosis_year: number | null;
  max_diagnosis_year: number | null;
};

type FileItem = {
  localId: string;
  file: File;
  schema: SchemaDetection;
  serverUid?: string;
  uploadProgress: number;
  phase: FilePhase;
  phaseEnteredAt: number;
  variant: FlowerVariant;
  summary?: ImportSummary;
  errorMsg?: string;
  errorCategory?: string;
  errorPath?: string;
  warnings?: ImportWarning[];
};

type QueueEntry = { localId: string; file: File; schemaType: string };

// ---- ID generation (crypto.randomUUID unavailable on non-HTTPS) -----------

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ---- Schema detection (mirrors UploadSection) -----------------------------

const SCHEMA_MAP: Record<string, { label: string; type: string }> = {
  "3.0.4_RKI":    { label: "oBDS 3.0.4 RKI",    type: "XML:oBDS_3.0.4_RKI" },
  "3.0.0.8a_RKI": { label: "oBDS 3.0.0.8a RKI", type: "XML:oBDS_3.0.0.8a_RKI" },
};

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

// ---- CSV export -----------------------------------------------------------

function downloadWarningsCsv(warnings: ImportWarning[], filenameHint: string) {
  const header = ["Patient-ID", "Tumor-ID", "Feld", "Wert", "Kategorie", "Hinweis"];
  const rows = warnings.map(w => [w.patient_id, w.tumor_id, w.feld, w.wert, w.kategorie, w.hinweis]);
  const csv = [header, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `qualitaetsbericht-${filenameHint.replace(/\.xml$/i, "")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- Rose garden sizing ---------------------------------------------------

function calcRoseSize(count: number): number {
  if (count <= 0) return 1.0;
  return Math.min(1.0, Math.max(0.2, (800 / count) / 140));
}

// ---- Phase → FlowerProgress phase mapping ----------------------------------

function toFlowerPhase(p: FilePhase): FlowerPhase {
  if (p === "validating") return "validating";
  if (p === "importing")  return "importing";
  if (p === "done")       return "done";
  return "uploading";
}

// ---- Blumen-Fortschritt: Upload deterministisch, Validierung/Import zeitbasiert ----

function computeFlowerProgress(phase: FilePhase, uploadProgress: number, elapsed: number): number {
  switch (phase) {
    case "pending":      return 0;
    case "uploading":    return uploadProgress * 0.25;            // 0–25 mit Upload-Fortschritt
    case "validating": {
      const t = Math.min(1, elapsed / 10000);                     // 25→58 über ~10s
      return 25 + t * 33;
    }
    case "importing": {
      const t = Math.min(1, elapsed / 240000);                    // 58→88 über ~4min
      return 58 + t * 30;
    }
    case "done":         return 100;
    case "error":        return 20;
    case "schema-error": return 0;
    default:             return 0;
  }
}

// ---- Component ------------------------------------------------------------

export default function BulkUploadSection() {
  const [dragging, setDragging]     = useState(false);
  const [fileItems, setFileItems]   = useState<FileItem[]>([]);
  const [uiPhase, setUiPhase]       = useState<"selection" | "uploading" | "done">("selection");
  const [overLimit, setOverLimit]   = useState(false);
  const codeServerUrl               = useCodeServerUrl();

  const fileItemsRef   = useRef<FileItem[]>([]);
  const activeCountRef = useRef(0);
  const uploadQueueRef = useRef<QueueEntry[]>([]);
  const fileInputRef   = useRef<HTMLInputElement | null>(null);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => { fileItemsRef.current = fileItems; }, [fileItems]);

  // Animationstakt: 150ms-Ticks während des Uploads damit Blumen zeitbasiert wachsen
  useEffect(() => {
    if (uiPhase !== "uploading") return;
    const id = setInterval(() => setAnimTick(t => t + 1), 150);
    return () => clearInterval(id);
  }, [uiPhase]);

  // ---- State helpers -------------------------------------------------------

  const updateFileItem = useCallback((localId: string, updates: Partial<FileItem>) => {
    setFileItems(prev => prev.map(item =>
      item.localId === localId ? {
        ...item,
        ...updates,
        ...(updates.phase !== undefined && updates.phase !== item.phase ? { phaseEnteredAt: Date.now() } : {}),
      } : item
    ));
  }, []);

  // ---- Polling per file ----------------------------------------------------

  const pollStatus = useCallback((localId: string, uid: string): Promise<void> => {
    return new Promise((resolve) => {
      let attempts = 0;
      const MAX = 150; // 150 x 2s = 300s Timeout
      const interval = setInterval(async () => {
        attempts++;
        if (attempts > MAX) {
          clearInterval(interval);
          updateFileItem(localId, { phase: "error", errorMsg: "Timeout: Import hat zu lange gedauert." });
          resolve();
          return;
        }
        try {
          const res = await fetch(`/api/report/${uid}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.status === "success" || data.status === "success_with_warnings") {
            clearInterval(interval);
            updateFileItem(localId, { phase: "importing" });
            const fileWarnings: ImportWarning[] =
              data.status === "success_with_warnings" ? (data.additional_info?.warnings ?? []) : [];
            fetch(`/api/report/${uid}/summary`)
              .then(r => r.ok ? r.json() : null)
              .then(summary => updateFileItem(localId, {
                phase: "done",
                summary: summary ?? undefined,
                warnings: fileWarnings.length > 0 ? fileWarnings : undefined,
              }))
              .catch(() => updateFileItem(localId, {
                phase: "done",
                warnings: fileWarnings.length > 0 ? fileWarnings : undefined,
              }));
            resolve();
          } else if (data.status === "failure") {
            clearInterval(interval);
            const info = data.additional_info ?? null;
            updateFileItem(localId, {
              phase: "error",
              errorMsg: info?.hint ?? "Import fehlgeschlagen.",
              errorCategory: info?.category ?? undefined,
              errorPath: info?.path ?? undefined,
            });
            resolve();
          }
        } catch (_) { /* Netzwerkfehler: naechster Versuch */ }
      }, 2000);
    });
  }, [updateFileItem]);

  // ---- XHR upload per file -------------------------------------------------

  const uploadFileXHR = useCallback((localId: string, file: File, schemaType: string): Promise<void> => {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append("type", schemaType);
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          updateFileItem(localId, {
            uploadProgress: (e.loaded / e.total) * 100,
            phase: "uploading",
          });
        }
      };

      xhr.upload.onload = () => {
        updateFileItem(localId, { uploadProgress: 100, phase: "validating" });
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const { uid } = JSON.parse(xhr.responseText);
            updateFileItem(localId, { serverUid: uid, phase: "validating" });
            pollStatus(localId, uid).finally(resolve);
          } catch (_) {
            updateFileItem(localId, { phase: "error", errorMsg: "Ungueltige Server-Antwort." });
            resolve();
          }
        } else {
          updateFileItem(localId, { phase: "error", errorMsg: `Serverfehler (${xhr.status}).` });
          resolve();
        }
      };

      xhr.onerror = () => {
        updateFileItem(localId, { phase: "error", errorMsg: "Netzwerkfehler beim Upload." });
        resolve();
      };

      xhr.open("POST", "/api/report");
      xhr.send(formData);
    });
  }, [updateFileItem, pollStatus]);

  // ---- Concurrent queue (N=3) ----------------------------------------------

  const processQueue = useCallback(() => {
    while (activeCountRef.current < 3 && uploadQueueRef.current.length > 0) {
      const entry = uploadQueueRef.current.shift()!;
      activeCountRef.current++;
      uploadFileXHR(entry.localId, entry.file, entry.schemaType).finally(() => {
        activeCountRef.current--;
        processQueue();
      });
    }
  }, [uploadFileXHR]);

  // ---- Detect "all done" to switch UI phase --------------------------------

  useEffect(() => {
    if (uiPhase !== "uploading") return;
    if (fileItems.length === 0) return;
    const processing = fileItems.some(f =>
      f.phase === "pending" || f.phase === "uploading" || f.phase === "validating" || f.phase === "importing"
    );
    if (!processing) {
      setUiPhase("done");
    }
  }, [fileItems, uiPhase]);

  // ---- File selection ------------------------------------------------------

  const addFiles = useCallback(async (raw: FileList | File[]) => {
    const files = Array.from(raw);
    const current = fileItemsRef.current;

    if (current.length + files.length > 30) {
      setOverLimit(true);
      return;
    }
    setOverLimit(false);

    const newItems: FileItem[] = files.map(file => ({
      localId: generateId(),
      file,
      schema: null,
      uploadProgress: 0,
      phase: "pending" as FilePhase,
      phaseEnteredAt: Date.now(),
      variant: variantFromString(file.name + String(file.size)),
    }));

    setFileItems(prev => [...prev, ...newItems]);

    // Schema-Erkennung für alle neuen Dateien
    for (const item of newItems) {
      const schema = await detectSchemaFromFile(item.file);
      setFileItems(prev => prev.map(f => f.localId === item.localId ? { ...f, schema } : f));
    }
  }, []);

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const removeFile = (localId: string) => {
    setFileItems(prev => prev.filter(f => f.localId !== localId));
    setOverLimit(false);
  };

  // ---- Start bulk upload ---------------------------------------------------

  const handleStartUpload = useCallback(() => {
    const items = fileItemsRef.current;
    const validItems = items.filter(f => f.schema?.status === "known");
    const invalidItems = items.filter(f => f.schema?.status !== "known");

    // Mark schema-errors immediately
    invalidItems.forEach(f => {
      setFileItems(prev => prev.map(i => i.localId === f.localId ? { ...i, phase: "schema-error" } : i));
    });

    if (validItems.length === 0) {
      // All schema errors — just switch to uploading so log shows
      setUiPhase("uploading");
      setTimeout(() => setUiPhase("done"), 100);
      return;
    }

    // Enqueue valid items as pending → they'll be uploaded concurrently
    uploadQueueRef.current = validItems.map(f => ({
      localId: f.localId,
      file: f.file,
      schemaType: (f.schema as { status: "known"; type: string }).type,
    }));

    setUiPhase("uploading");
    processQueue();
  }, [processQueue]);

  // ---- Reset ---------------------------------------------------------------

  const handleReset = () => {
    setFileItems([]);
    setUiPhase("selection");
    setOverLimit(false);
    activeCountRef.current = 0;
    uploadQueueRef.current = [];
  };

  // ---- CSV download --------------------------------------------------------

  const handleCsvDownload = () => {
    const header = ["Dateiname", "Status", "Fehler", "Patienten", "Fälle", "Diagnosejahre", "Med. Alter"];
    const rows = fileItems.map(f => {
      const s = f.summary;
      const diagnosejahre = s?.min_diagnosis_year != null && s?.max_diagnosis_year != null
        ? s.min_diagnosis_year === s.max_diagnosis_year
          ? String(s.min_diagnosis_year)
          : `${s.min_diagnosis_year}-${s.max_diagnosis_year}`
        : "";
      return [
        f.file.name,
        f.phase === "done" ? "Erfolg" : "Fehler",
        f.errorMsg ?? "",
        s?.patient_count != null ? String(s.patient_count) : "",
        s?.tumor_count != null ? String(s.tumor_count) : "",
        diagnosejahre,
        s?.median_age != null ? String(s.median_age) : "",
      ];
    });
    const csv = [header, ...rows].map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `massenimport-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAllWarningsCsvDownload = () => {
    const allWarnings = fileItems.flatMap(f =>
      (f.warnings ?? []).map(w => ({ dateiname: f.file.name, ...w }))
    );
    if (allWarnings.length === 0) return;
    const header = ["Dateiname", "Patient-ID", "Tumor-ID", "Feld", "Wert", "Kategorie", "Hinweis"];
    const rows = allWarnings.map(w => [w.dateiname, w.patient_id, w.tumor_id, w.feld, w.wert, w.kategorie, w.hinweis]);
    const csv = [header, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(";"))
      .join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qualitaetsbericht-gesamt-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---- Derived state -------------------------------------------------------

  const hasValidFiles = fileItems.some(f => f.schema?.status === "known");
  const roseSize = calcRoseSize(fileItems.length);
  const doneCount = fileItems.filter(f => f.phase === "done").length;
  const errorCount = fileItems.filter(f => f.phase === "error" || f.phase === "schema-error").length;
  const totalCount = fileItems.length;

  // ---- Schema badge helper -------------------------------------------------

  function SchemaBadge({ schema }: { schema: SchemaDetection }) {
    if (schema === null) {
      return <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#F2F5F7", color: "#505050" }}>Wird erkannt…</span>;
    }
    if (schema.status === "known") {
      return <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: "#F0FFF4", color: "#166534", border: "1px solid #22C55E" }}>{schema.label}</span>;
    }
    if (schema.status === "unsupported") {
      return <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: "#FFF0F0", color: "#E10019", border: "1px solid #E10019" }}>Unbekannt: {schema.version}</span>;
    }
    return <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ backgroundColor: "#FFF8E1", color: "#7A4100", border: "1px solid #F0B429" }}>Kein Schema</span>;
  }

  // ---- Rose item wrapper ---------------------------------------------------

  function RoseItem({ item }: { item: FileItem }) {
    const showOverlay = item.phase === "done" || item.phase === "error" || item.phase === "schema-error";
    const overlayIcon = item.phase === "done" ? "✓" : "✗";
    const overlayColor = item.phase === "done" ? "#16A34A" : "#E10019";
    // animTick wird hier referenziert damit der Eltern-Rerender auch RoseItem neu rendert
    const elapsed = Date.now() - item.phaseEnteredAt + (animTick * 0);

    const roseEl = (
      <FlowerProgress
        variant={item.variant}
        progress={computeFlowerProgress(item.phase, item.uploadProgress, elapsed)}
        phase={toFlowerPhase(item.phase)}
        size={roseSize}
        showLabel={false}
      />
    );

    let wrapper: React.ReactNode;

    if (item.phase === "pending") {
      wrapper = <div style={{ opacity: 0.25, filter: "grayscale(1)" }}>{roseEl}</div>;
    } else if (item.phase === "schema-error") {
      wrapper = (
        <div style={{ position: "relative", opacity: 0.5, filter: "grayscale(1)" }}>
          {roseEl}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: `${Math.max(12, roseSize * 28)}px`, color: "#F0B429", fontWeight: "bold" }}>!</span>
          </div>
        </div>
      );
    } else if (showOverlay && roseSize < 0.5) {
      wrapper = (
        <div style={{ position: "relative" }}>
          {roseEl}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: `${Math.max(10, roseSize * 24)}px`, color: overlayColor, fontWeight: "bold" }}>{overlayIcon}</span>
          </div>
        </div>
      );
    } else {
      wrapper = roseEl;
    }

    return (
      <div
        title={item.file.name}
        style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", cursor: "default" }}
      >
        {wrapper}
      </div>
    );
  }

  // ---- Render: Selection phase ---------------------------------------------

  if (uiPhase === "selection") {
    return (
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "#003063" }}>
            Massenimport
          </h1>
          <p className="text-center text-sm mb-6" style={{ color: "#505050" }}>
            Bis zu 30 oBDS-XML-Dateien auf einmal importieren. Schema wird automatisch erkannt.
          </p>

          {/* Dropzone */}
          <label
            htmlFor="bulk-file-input"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors mb-4"
            style={{ borderColor: dragging ? "#003063" : "#D8D8D8", backgroundColor: dragging ? "#F0F4FF" : "#F2F5F7" }}
          >
            <span className="text-3xl mb-2">&#128196;</span>
            <p className="text-sm font-medium" style={{ color: "#000000" }}>XML-Dateien hier ablegen oder klicken</p>
            <p className="text-xs mt-1" style={{ color: "#505050" }}>Mehrfachauswahl möglich · max. 30 Dateien · .xml</p>
            <input
              ref={fileInputRef}
              id="bulk-file-input"
              type="file"
              accept=".xml"
              multiple
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>

          {/* Over-limit warning */}
          {overLimit && (
            <div className="rounded px-3 py-2 mb-4 text-sm" style={{ backgroundColor: "#FFF8E1", border: "1px solid #F0B429" }}>
              <span style={{ color: "#7A4100" }}>&#9888; Maximal 30 Dateien gleichzeitig. Bitte weniger Dateien auswählen.</span>
            </div>
          )}

          {/* File list */}
          {fileItems.length > 0 && (
            <div className="rounded-lg mb-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #D8D8D8", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b" style={{ color: "#505050", borderColor: "#D8D8D8" }}>
                {fileItems.length} Datei{fileItems.length !== 1 ? "en" : ""} ausgewählt
              </div>
              <ul className="divide-y" style={{ maxHeight: "320px", overflowY: "auto" }}>
                {fileItems.map(item => (
                  <li key={item.localId} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: "#003063" }}>{item.file.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#505050" }}>
                        {(item.file.size / 1_048_576).toFixed(2)} MB
                      </div>
                    </div>
                    <SchemaBadge schema={item.schema} />
                    <button
                      onClick={() => removeFile(item.localId)}
                      className="text-sm px-2 py-0.5 rounded hover:bg-gray-100 shrink-0"
                      style={{ color: "#505050" }}
                      title="Entfernen"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleStartUpload}
            disabled={fileItems.length === 0 || !hasValidFiles}
            className="w-full py-3 rounded text-white text-sm font-semibold disabled:opacity-40"
            style={{ backgroundColor: "#003063" }}
            onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = "#002853"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#003063"; }}
          >
            {fileItems.length === 0 ? "Dateien auswählen" : `${fileItems.filter(f => f.schema?.status === "known").length} Datei${fileItems.filter(f => f.schema?.status === "known").length !== 1 ? "en" : ""} hochladen`}
          </button>

          {fileItems.some(f => f.schema?.status !== "known" && f.schema !== null) && (
            <p className="text-xs text-center mt-2" style={{ color: "#505050" }}>
              Dateien ohne erkanntes Schema werden übersprungen.
            </p>
          )}
        </div>
      </section>
    );
  }

  // ---- Render: Uploading phase (Rose garden) -------------------------------

  if (uiPhase === "uploading") {
    const progressText = doneCount > 0
      ? `${doneCount} von ${totalCount} abgeschlossen`
      : "Import läuft…";

    return (
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-1" style={{ color: "#003063" }}>
            Massenimport läuft
          </h2>
          <p className="text-center text-sm mb-8" style={{ color: "#505050" }}>{progressText}</p>

          {/* Rose garden */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {fileItems.map(item => (
              <RoseItem key={item.localId} item={item} />
            ))}
          </div>

          {/* Mini legend */}
          {doneCount > 0 && (
            <p className="text-center text-sm mt-4" style={{ color: "#16A34A" }}>
              {doneCount} von {totalCount} abgeschlossen
            </p>
          )}
        </div>
      </section>
    );
  }

  // ---- Aggregate summary from successful files --------------------------------

  const successItems = fileItems.filter(f => f.phase === "done" && f.summary != null);
  const aggSummary = successItems.length > 0 ? (() => {
    const patient_count      = successItems.reduce((s, f) => s + (f.summary!.patient_count ?? 0), 0);
    const tumor_count        = successItems.reduce((s, f) => s + (f.summary!.tumor_count ?? 0), 0);
    const minYears           = successItems.map(f => f.summary!.min_diagnosis_year).filter((v): v is number => v != null);
    const maxYears           = successItems.map(f => f.summary!.max_diagnosis_year).filter((v): v is number => v != null);
    const medians            = successItems.map(f => f.summary!.median_age).filter((v): v is number => v != null);
    const minAges            = successItems.map(f => f.summary!.min_age).filter((v): v is number => v != null);
    const maxAges            = successItems.map(f => f.summary!.max_age).filter((v): v is number => v != null);
    return {
      patient_count,
      tumor_count,
      min_diagnosis_year: minYears.length > 0 ? Math.min(...minYears) : null,
      max_diagnosis_year: maxYears.length > 0 ? Math.max(...maxYears) : null,
      median_age:         medians.length > 0 ? Math.round(medians.reduce((a, b) => a + b, 0) / medians.length) : null,
      min_age:            minAges.length > 0 ? Math.min(...minAges) : null,
      max_age:            maxAges.length > 0 ? Math.max(...maxAges) : null,
    };
  })() : null;

  // ---- Render: Done phase (Log table) --------------------------------------

  return (
    <section className="py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Summary header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold" style={{ color: "#003063" }}>Import abgeschlossen</h2>
          <p className="text-sm mt-1" style={{ color: "#505050" }}>
            <strong style={{ color: "#16A34A" }}>{doneCount}</strong> von <strong>{totalCount}</strong> Dateien erfolgreich importiert
            {errorCount > 0 && <>, <strong style={{ color: "#E10019" }}>{errorCount}</strong> fehlgeschlagen</>}
          </p>
        </div>

        {/* Mini rose garden */}
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          {fileItems.map(item => (
            <RoseItem key={item.localId} item={item} />
          ))}
        </div>

        {/* Aggregierte KPI-Karten */}
        {aggSummary && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg p-5 text-center" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>
              <div style={{ fontSize: "2em", lineHeight: 1 }}>&#x1F465;</div>
              <div className="text-3xl font-bold mt-2" style={{ color: "#003063" }}>
                {aggSummary.patient_count.toLocaleString("de-DE")}
              </div>
              <div className="text-sm mt-1 font-semibold" style={{ color: "#505050" }}>Patienten</div>
            </div>
            <div className="rounded-lg p-5 text-center" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>
              <div style={{ fontSize: "2em", lineHeight: 1 }}>&#x1F4C5;</div>
              <div className="text-3xl font-bold mt-2" style={{ color: "#003063" }}>
                {aggSummary.min_diagnosis_year != null && aggSummary.max_diagnosis_year != null
                  ? aggSummary.min_diagnosis_year === aggSummary.max_diagnosis_year
                    ? aggSummary.min_diagnosis_year
                    : `${aggSummary.min_diagnosis_year}–${aggSummary.max_diagnosis_year}`
                  : "—"}
              </div>
              <div className="text-sm mt-1 font-semibold" style={{ color: "#505050" }}>Diagnosejahre</div>
            </div>
            <div className="rounded-lg p-5 text-center" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>
              <div style={{ fontSize: "2em", lineHeight: 1 }}>&#x1F4CA;</div>
              <div className="text-3xl font-bold mt-2" style={{ color: "#003063" }}>
                {aggSummary.median_age != null ? `${aggSummary.median_age} J.` : "—"}
              </div>
              {aggSummary.min_age != null && aggSummary.max_age != null && (
                <div className="text-xs mt-0.5" style={{ color: "#505050" }}>
                  {aggSummary.min_age}–{aggSummary.max_age} Jahre
                </div>
              )}
              <div className="text-sm mt-1 font-semibold" style={{ color: "#505050" }}>Medianes Alter</div>
            </div>
            <div className="rounded-lg p-5 text-center" style={{ backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #D8D8D8" }}>
              <div style={{ fontSize: "2em", lineHeight: 1 }}>&#x1F489;</div>
              <div className="text-3xl font-bold mt-2" style={{ color: "#003063" }}>
                {aggSummary.tumor_count.toLocaleString("de-DE")}
              </div>
              <div className="text-sm mt-1 font-semibold" style={{ color: "#505050" }}>Fälle</div>
            </div>
          </div>
        )}

        {/* Per-Datei Ergebnisse — gleicher Stil wie Einzelimport */}
        <div className="space-y-2 mb-6">
          {fileItems.map(item => {
            const s = item.summary;
            const diagnosejahre = s?.min_diagnosis_year != null && s?.max_diagnosis_year != null
              ? s.min_diagnosis_year === s.max_diagnosis_year
                ? String(s.min_diagnosis_year)
                : `${s.min_diagnosis_year}–${s.max_diagnosis_year}`
              : null;
            const kpiText = s
              ? [
                  s.patient_count != null ? `${s.patient_count.toLocaleString("de-DE")} Pat.` : null,
                  s.tumor_count != null ? `${s.tumor_count.toLocaleString("de-DE")} Fälle` : null,
                  diagnosejahre,
                ].filter(Boolean).join(" · ")
              : null;

            if (item.phase === "done" && item.warnings?.length) {
              return (
                <div key={item.localId} className="rounded-lg px-4 py-3 flex items-center justify-between gap-3"
                  style={{ backgroundColor: "#FFF8E1", border: "1px solid #F0B429" }}>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: "#7A4100" }} title={item.file.name}>
                      {item.file.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#7A4100" }}>
                      &#9888; {item.warnings.length} Datenqualitätsprobleme — Datei wurde trotzdem vollständig importiert
                      {kpiText && <span className="ml-2 opacity-70">· {kpiText}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => downloadWarningsCsv(item.warnings!, item.file.name)}
                    className="text-xs px-3 py-1.5 rounded border font-medium shrink-0"
                    style={{ borderColor: "#F0B429", color: "#7A4100", backgroundColor: "#FFFDF0" }}
                  >
                    &#x2B07; Qualitätsbericht CSV
                  </button>
                </div>
              );
            }

            if (item.phase === "done") {
              return (
                <div key={item.localId} className="rounded-lg px-4 py-2.5 flex items-center justify-between gap-3"
                  style={{ backgroundColor: "#F0FFF4", border: "1px solid #22C55E" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span style={{ color: "#16A34A", fontWeight: 700 }}>&#10003;</span>
                    <span className="text-sm font-medium truncate" style={{ color: "#166534" }} title={item.file.name}>
                      {item.file.name}
                    </span>
                  </div>
                  {kpiText && (
                    <span className="text-xs shrink-0" style={{ color: "#166534" }}>{kpiText}</span>
                  )}
                </div>
              );
            }

            return (
              <div key={item.localId} className="rounded-lg px-4 py-3"
                style={{ backgroundColor: "#FFF0F0", border: "1px solid #E10019" }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#E10019", fontWeight: 700 }}>&#10007;</span>
                  <span className="text-sm font-medium truncate" style={{ color: "#E10019" }} title={item.file.name}>
                    {item.file.name}
                  </span>
                </div>
                {item.errorMsg && (
                  <div className="text-xs mt-1 ml-5" style={{ color: "#505050" }}>{item.errorMsg}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* R-Umgebung — gleicher Stil wie Einzelimport */}
        <p className="text-sm text-center mb-3" style={{ color: "#505050" }}>
          Die importierten Daten stehen jetzt in der R-Umgebung bereit.
        </p>
        <Link
          href={codeServerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded text-white text-sm font-bold mb-3 no-underline"
          style={{ backgroundColor: "#003063" }}
          onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#002853"; }}
          onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#003063"; }}
        >
          <span style={{ fontSize: "1.2em" }}>&#x1F4CA;</span>
          Daten in R-Umgebung analysieren
        </Link>

        {/* Sekundäre Aktionen */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleCsvDownload}
            className="flex-1 py-2.5 rounded text-sm font-semibold border"
            style={{ color: "#003063", borderColor: "#003063", backgroundColor: "transparent", minWidth: "140px" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#F0F4FF"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            &#x2B07; Importbericht CSV
          </button>
          {fileItems.some(f => f.warnings && f.warnings.length > 0) && (
            <button
              onClick={handleAllWarningsCsvDownload}
              className="flex-1 py-2.5 rounded text-sm font-semibold border"
              style={{ color: "#7A4100", borderColor: "#F0B429", backgroundColor: "#FFF8E1", minWidth: "140px" }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#FFF3CC"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#FFF8E1"; }}
            >
              &#x2B07; Qualitätsbericht gesamt
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded text-sm font-semibold border"
            style={{ color: "#003063", borderColor: "#003063", backgroundColor: "transparent", minWidth: "140px" }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#F0F4FF"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            Weiteren Import starten
          </button>
        </div>
      </div>
    </section>
  );
}
