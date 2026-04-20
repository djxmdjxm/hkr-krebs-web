"use client";

export type RosePhase = "uploading" | "validating" | "importing" | "done";

interface RoseProgressProps {
  phase: RosePhase;
  uploadProgress: number; // 0-100, nur relevant in Phase "uploading"
  uploadedMB?: number;
  totalMB?: number;
  size?: number;        // 0.0–1.0, skaliert SVG-Dimensionen (default 1.0)
  showLabel?: boolean;  // false = kein Statustext (default true)
}

/**
 * Animierte rote Rose mit drei semantischen Etappen:
 *
 * Etappe 1 — "uploading":   Stiel + Blaetter wachsen (XHR upload progress 0-100%)
 * Etappe 2 — "validating":  Bluetenblaetter oeffnen sich (XSD-Validierung laeuft)
 * Etappe 3 — "importing":   Bluete leuchtet auf, rote Mitte erscheint (DB-Import)
 * Fertig    — "done":        Rose vollstaendig geoeffnet, still
 */
export default function RoseProgress({ phase, uploadProgress, uploadedMB, totalMB, size = 1, showLabel = true }: RoseProgressProps) {
  const svgW = Math.round(140 * size);
  const svgH = Math.round(200 * size);

  // --- Stiel: waechst waehrend Upload ---
  const stemP = phase === "uploading" ? uploadProgress / 100 : 1;
  const stemDash = 120;
  const stemOffset = stemDash * (1 - stemP);

  // --- Blaetter: erscheinen ab 30% Upload ---
  const leaf1P = phase === "uploading" ? Math.min(1, uploadProgress / 50) : 1;
  const leaf2P = phase === "uploading" ? Math.min(1, Math.max(0, (uploadProgress - 20) / 50)) : 1;
  const leafDash = 60;

  // --- Bluetenblaetter: oeffnen sich waehrend Validierung ---
  const petalActive = phase === "validating" || phase === "importing" || phase === "done";
  // Jedes Bluetenblatt erscheint leicht gestaffelt — gesteuert durch CSS-Animation
  const petalOpacity = petalActive ? 1 : 0;

  // --- Bluetenmitte: erscheint waehrend Import ---
  const centerActive = phase === "importing" || phase === "done";

  // Statustext
  const statusText =
    phase === "uploading" ? "Datei wird uebertragen …" :
    phase === "validating" ? "Validierung laeuft …" :
    phase === "importing" ? "Import in Datenbank …" :
    "Fertig!";

  const subText =
    phase === "uploading" && uploadedMB !== undefined && totalMB !== undefined
      ? `${uploadedMB.toFixed(1)} MB von ${totalMB.toFixed(1)} MB`
      : phase === "validating" ? "XML wird gegen Schema geprueft"
      : phase === "importing" ? "Daten werden gespeichert"
      : "Import erfolgreich";

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={svgW} height={svgH}
        viewBox="0 0 120 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stiel — waechst von unten nach oben */}
        <path
          d="M60 170 C60 140 58 120 60 95"
          stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={stemDash}
          strokeDashoffset={stemOffset}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />

        {/* Blatt links */}
        <path
          d="M57 145 C45 138 38 128 42 118 C50 122 56 132 57 145"
          stroke="#2D7A2D" strokeWidth="2" strokeLinecap="round" fill="none"
          strokeDasharray={leafDash}
          strokeDashoffset={leafDash * (1 - leaf1P)}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />

        {/* Blatt rechts */}
        <path
          d="M63 130 C75 123 82 112 78 102 C70 106 64 118 63 130"
          stroke="#2D7A2D" strokeWidth="2" strokeLinecap="round" fill="none"
          strokeDasharray={leafDash}
          strokeDashoffset={leafDash * (1 - leaf2P)}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />

        {/* Bluetenblaetter — oeffnen sich per CSS-Animation in Phase "validating" */}
        <style>{`
          @keyframes petalOpen {
            from { stroke-dashoffset: 80; }
            to   { stroke-dashoffset: 0; }
          }
          .petal {
            stroke-dasharray: 80;
            stroke-dashoffset: ${petalActive ? 0 : 80};
          }
          .petal-1 { animation: ${petalActive ? "petalOpen 0.5s ease 0.0s forwards" : "none"}; }
          .petal-2 { animation: ${petalActive ? "petalOpen 0.5s ease 0.1s forwards" : "none"}; }
          .petal-3 { animation: ${petalActive ? "petalOpen 0.5s ease 0.2s forwards" : "none"}; }
          .petal-4 { animation: ${petalActive ? "petalOpen 0.5s ease 0.3s forwards" : "none"}; }
          .petal-5 { animation: ${petalActive ? "petalOpen 0.5s ease 0.4s forwards" : "none"}; }
          @keyframes centerPop {
            0%   { r: 0; opacity: 0; }
            60%  { r: 10; opacity: 1; }
            100% { r: 8; opacity: 1; }
          }
          .center-dot {
            animation: ${centerActive ? "centerPop 0.6s ease 0.3s forwards" : "none"};
            r: ${centerActive ? 8 : 0};
            opacity: ${centerActive ? 1 : 0};
          }
        `}</style>

        <path className="petal petal-1" d="M60 90 C55 72 50 60 60 50 C70 60 65 72 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path className="petal petal-2" d="M60 90 C76 80 88 74 93 63 C80 58 70 68 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path className="petal petal-3" d="M60 90 C78 92 90 100 91 112 C78 113 67 103 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path className="petal petal-4" d="M60 90 C42 92 30 100 29 112 C42 113 53 103 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path className="petal petal-5" d="M60 90 C44 80 32 74 27 63 C40 58 50 68 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Mitte */}
        <circle className="center-dot" cx="60" cy="90" fill="#E10019" />
      </svg>

      {showLabel && (
        <div className="text-center">
          <div className="text-lg font-bold" style={{ color: "#003063" }}>{statusText}</div>
          <div className="text-sm mt-1" style={{ color: "#505050" }}>{subText}</div>
          {phase === "uploading" && (
            <div className="text-2xl font-bold mt-2" style={{ color: "#003063" }}>
              {Math.round(uploadProgress)}&nbsp;%
            </div>
          )}
        </div>
      )}
    </div>
  );
}
