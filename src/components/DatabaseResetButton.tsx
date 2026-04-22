"use client";

import { useState } from "react";

type Phase = "idle" | "confirm" | "loading" | "success" | "error";

export default function DatabaseResetButton() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async () => {
    setPhase("loading");
    try {
      const res = await fetch("/api/database/reset", { method: "POST" });
      if (res.ok) {
        setPhase("success");
      } else {
        setErrorMsg(`Serverfehler (${res.status})`);
        setPhase("error");
      }
    } catch {
      setErrorMsg("Netzwerkfehler");
      setPhase("error");
    }
  };

  if (phase === "success") {
    return (
      <div className="rounded-lg px-5 py-4 text-center" style={{ backgroundColor: "#F0FFF4", border: "1px solid #22C55E" }}>
        <div className="text-2xl mb-1">✓</div>
        <p className="text-sm font-semibold" style={{ color: "#166534" }}>Datenbank erfolgreich zurückgesetzt.</p>
        <p className="text-xs mt-1" style={{ color: "#505050" }}>Alle Patientendaten, Tumormeldungen und Import-Protokolle wurden gelöscht.</p>
        <button
          onClick={() => setPhase("idle")}
          className="mt-3 text-xs px-3 py-1.5 rounded border"
          style={{ color: "#505050", borderColor: "#D8D8D8" }}
        >
          Schließen
        </button>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="rounded-lg px-5 py-4 text-center" style={{ backgroundColor: "#FFF5F5", border: "1px solid #E10019" }}>
        <p className="text-sm font-semibold" style={{ color: "#E10019" }}>Fehler beim Zurücksetzen: {errorMsg}</p>
        <button
          onClick={() => setPhase("idle")}
          className="mt-3 text-xs px-3 py-1.5 rounded border"
          style={{ color: "#505050", borderColor: "#D8D8D8" }}
        >
          Schließen
        </button>
      </div>
    );
  }

  if (phase === "confirm") {
    return (
      <div className="rounded-lg px-5 py-5" style={{ backgroundColor: "#FFF5F5", border: "1px solid #E10019" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "#E10019" }}>Wirklich alle Daten löschen?</p>
        <p className="text-xs mb-4" style={{ color: "#505050" }}>
          Diese Aktion löscht <strong>alle</strong> Patientendaten, Tumormeldungen und Import-Protokolle
          unwiderruflich. Hochgeladene XML-Dateien werden ebenfalls entfernt.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setPhase("idle")}
            className="flex-1 py-2 rounded text-sm border"
            style={{ color: "#505050", borderColor: "#D8D8D8", backgroundColor: "#FFFFFF" }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-2 rounded text-sm font-semibold text-white"
            style={{ backgroundColor: "#E10019" }}
          >
            Ja, Datenbank löschen
          </button>
        </div>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="rounded-lg px-5 py-4 text-center" style={{ backgroundColor: "#F2F5F7", border: "1px solid #D8D8D8" }}>
        <p className="text-sm" style={{ color: "#505050" }}>Datenbank wird zurückgesetzt…</p>
      </div>
    );
  }

  return (
    <button
      onClick={() => setPhase("confirm")}
      className="w-full py-2.5 rounded text-sm font-semibold text-white"
      style={{ backgroundColor: "#E10019" }}
      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#C00015"; }}
      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#E10019"; }}
    >
      Datenbank zurücksetzen
    </button>
  );
}
