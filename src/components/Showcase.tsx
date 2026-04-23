"use client";

import { useState } from "react";
import Link from "next/link";
import FlowerProgress, { FlowerVariant, randomVariant } from "./FlowerProgress";
import { useCodeServerUrl } from "@/lib/codeServerUrl";

export default function Showcase() {
  const codeServerUrl = useCodeServerUrl();
  const [variant] = useState<FlowerVariant>(randomVariant);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: "#F2F5F7" }}
    >
      {/* Rose */}
      <div className="mb-6">
        <FlowerProgress variant={variant} progress={100} phase="done" showLabel={false} size={1.2} />
      </div>

      {/* Titel */}
      <h1 className="text-4xl font-bold text-center mb-2" style={{ color: "#003063" }}>
        Willkommen bei KIKA
      </h1>
      <p className="text-base font-medium text-center mb-8" style={{ color: "#E10019" }}>
        Projekt KI in der Krebsregisteranalyse
      </p>

      {/* Beschreibung */}
      <p className="text-center max-w-xl text-sm leading-relaxed mb-10" style={{ color: "#505050" }}>
        KIKA ermöglicht den strukturierten Import onkologischer Meldedaten im oBDS-RKI-Format
        und stellt diese unmittelbar für epidemiologische Analysen bereit.
        Die Anwendung läuft vollständig im lokalen Netz — ohne Internetzugang, ohne externe Abhängigkeiten.
        Entwickelt vom Hamburgischen Krebsregister, bereitgestellt für alle Landeskrebsregister.
      </p>

      {/* Aktionskarten */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl mb-10">
        <Link
          href="/registry"
          className="flex-1 flex flex-col items-center gap-2 rounded-2xl px-6 py-8 no-underline transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#003063" }}
        >
          <span style={{ fontSize: "2rem" }}>📥</span>
          <span className="text-lg font-bold text-white">Daten importieren</span>
          <span className="text-xs text-white opacity-70 text-center">
            XML-Dateien hochladen<br />Einzel- oder Massenimport
          </span>
        </Link>

        <Link
          href={codeServerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center gap-2 rounded-2xl px-6 py-8 no-underline transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#FFFFFF", border: "2px solid #003063" }}
        >
          <span style={{ fontSize: "2rem" }}>📊</span>
          <span className="text-lg font-bold" style={{ color: "#003063" }}>Daten analysieren</span>
          <span className="text-xs text-center" style={{ color: "#505050" }}>
            R-Umgebung öffnen<br />Importierte Daten auswerten
          </span>
        </Link>
      </div>

      {/* Format-Hinweis */}
      <p className="text-xs" style={{ color: "#909090" }}>
        Unterstützte Formate: oBDS 3.0.4 RKI · oBDS 3.0.0.8a RKI
      </p>
    </section>
  );
}
