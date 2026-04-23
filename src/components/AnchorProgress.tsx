"use client";

import { useId } from "react";

export type AnchorPhase = "uploading" | "validating" | "importing" | "done";

interface AnchorProgressProps {
  progress: number;      // 0–100: steuert das visuelle Befüllen des Ankers
  phase: AnchorPhase;   // nur für den Statustext
  uploadedMB?: number;
  totalMB?: number;
  size?: number;
  showLabel?: boolean;
}

export default function AnchorProgress({
  progress,
  phase,
  uploadedMB,
  totalMB,
  size = 1,
  showLabel = true,
}: AnchorProgressProps) {
  const uid = useId();
  const clipId = `ac${uid.replace(/:/g, "")}`;

  const svgW = Math.round(140 * size);
  const svgH = Math.round(200 * size);

  // Anker füllt sich proportional von unten nach oben (0 = leer, 1 = voll)
  const fill = Math.max(0, Math.min(100, progress)) / 100;

  const statusText =
    phase === "uploading"  ? "Datei wird übertragen …"  :
    phase === "validating" ? "Validierung läuft …"      :
    phase === "importing"  ? "Import in Datenbank …"    :
                             "Fertig!";

  const subText =
    phase === "uploading" && uploadedMB !== undefined && totalMB !== undefined
      ? `${uploadedMB.toFixed(1)} MB von ${totalMB.toFixed(1)} MB`
      : phase === "validating" ? "XML wird gegen Schema geprüft"
      : phase === "importing"  ? "Daten werden gespeichert"
      : "Import erfolgreich";

  const SW = 6; // Strichstärke

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={svgW} height={svgH} viewBox="0 0 120 180" fill="none">
        <defs>
          {/*
            ClipPath-Rechteck: skaliert von unten nach oben.
            transformBox=fill-box + transformOrigin=bottom center:
              scaleY(0) → Linie am unteren Rand  → nichts sichtbar
              scaleY(1) → volle Höhe             → alles sichtbar
          */}
          <clipPath id={clipId}>
            <rect
              x="0" y="0" width="120" height="180"
              style={{
                transformBox: "fill-box",
                transformOrigin: "bottom center",
                transform: `scaleY(${fill})`,
                transition: "transform 0.8s ease",
              } as React.CSSProperties}
            />
          </clipPath>
        </defs>

        {/* ── Umriss (immer sichtbar, grau) ───────────────────────────── */}
        <circle cx="60" cy="38" r="13" stroke="#d0dae4" strokeWidth={SW} fill="none" />
        <line x1="60" y1="51" x2="60" y2="133" stroke="#d0dae4" strokeWidth={SW} strokeLinecap="round" />
        <line x1="22" y1="72" x2="98" y2="72" stroke="#d0dae4" strokeWidth={SW} strokeLinecap="round" />
        <path d="M60 133 Q28 133 16 110" stroke="#d0dae4" strokeWidth={SW} strokeLinecap="round" fill="none" />
        <path d="M60 133 Q92 133 104 110" stroke="#d0dae4" strokeWidth={SW} strokeLinecap="round" fill="none" />
        <circle cx="16" cy="110" r="8" fill="#d0dae4" />
        <circle cx="104" cy="110" r="8" fill="#d0dae4" />

        {/* ── Farbige Füllung (steigt von unten nach oben) ─────────────── */}
        <g clipPath={`url(#${clipId})`}>
          {/* Ring, Schaft, Querbalken: Hamburg Navy */}
          <circle cx="60" cy="38" r="13" stroke="#003063" strokeWidth={SW} fill="none" />
          <line x1="60" y1="51" x2="60" y2="133" stroke="#003063" strokeWidth={SW} strokeLinecap="round" />
          <line x1="22" y1="72" x2="98" y2="72" stroke="#003063" strokeWidth={SW} strokeLinecap="round" />
          {/* Arme und Spitzen: Hamburg Rot */}
          <path d="M60 133 Q28 133 16 110" stroke="#E10019" strokeWidth={SW} strokeLinecap="round" fill="none" />
          <path d="M60 133 Q92 133 104 110" stroke="#E10019" strokeWidth={SW} strokeLinecap="round" fill="none" />
          <circle cx="16" cy="110" r="8" fill="#E10019" />
          <circle cx="104" cy="110" r="8" fill="#E10019" />
        </g>
      </svg>

      {showLabel && (
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: "#003063" }}>{statusText}</div>
          <div className="text-sm mt-1" style={{ color: "#505050" }}>{subText}</div>
          {phase === "uploading" && (
            <div className="text-2xl font-bold mt-2" style={{ color: "#003063" }}>
              {Math.round(Math.min(100, progress * 4))}&nbsp;%
            </div>
          )}
        </div>
      )}
    </div>
  );
}
