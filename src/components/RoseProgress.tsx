"use client";

export type RosePhase = "uploading" | "validating" | "importing" | "done";

interface RoseProgressProps {
  progress: number;      // 0–100: steuert das gesamte visuelle Wachstum
  phase: RosePhase;      // nur für den Statustext
  uploadedMB?: number;
  totalMB?: number;
  size?: number;
  showLabel?: boolean;
}

// Mappt progress-Wert auf [0, 1] innerhalb eines Fensters [min, max]
function p01(val: number, min: number, max: number): number {
  return Math.min(1, Math.max(0, (val - min) / (max - min)));
}

export default function RoseProgress({
  progress,
  phase,
  uploadedMB,
  totalMB,
  size = 1,
  showLabel = true,
}: RoseProgressProps) {
  const svgW = Math.round(140 * size);
  const svgH = Math.round(200 * size);

  // Fortschrittsfenster je Element:
  //  0–25  → Stiel wächst           (Phase: uploading)
  // 15–35  → Blatt links erscheint  (Phase: uploading → validating)
  // 25–45  → Blatt rechts erscheint (Phase: validating)
  // 38–79  → Blütenblätter öffnen sich gestaffelt (Phase: importing)
  // 86–100 → Blütenmitte erscheint  (Phase: done)
  const stemP   = p01(progress, 0,  25);
  const leaf1P  = p01(progress, 15, 35);
  const leaf2P  = p01(progress, 25, 45);
  const petal1P = p01(progress, 38, 55);
  const petal2P = p01(progress, 44, 61);
  const petal3P = p01(progress, 50, 67);
  const petal4P = p01(progress, 56, 73);
  const petal5P = p01(progress, 62, 79);
  const centerP = p01(progress, 86, 100);

  const stemDash  = 120;
  const leafDash  = 60;
  const petalDash = 80;
  const tr = "stroke-dashoffset 0.8s ease";

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

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={svgW} height={svgH} viewBox="0 0 120 180" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* Stiel */}
        <path
          d="M60 170 C60 140 58 120 60 95"
          stroke="#2D7A2D" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={stemDash}
          strokeDashoffset={stemDash * (1 - stemP)}
          style={{ transition: tr }}
        />

        {/* Blatt links */}
        <path
          d="M57 145 C45 138 38 128 42 118 C50 122 56 132 57 145"
          stroke="#2D7A2D" strokeWidth="2" strokeLinecap="round" fill="none"
          strokeDasharray={leafDash}
          strokeDashoffset={leafDash * (1 - leaf1P)}
          style={{ transition: tr }}
        />

        {/* Blatt rechts */}
        <path
          d="M63 130 C75 123 82 112 78 102 C70 106 64 118 63 130"
          stroke="#2D7A2D" strokeWidth="2" strokeLinecap="round" fill="none"
          strokeDasharray={leafDash}
          strokeDashoffset={leafDash * (1 - leaf2P)}
          style={{ transition: tr }}
        />

        {/* Blütenblatt 1 */}
        <path d="M60 90 C55 72 50 60 60 50 C70 60 65 72 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalDash * (1 - petal1P)}
          style={{ transition: tr }}
        />
        {/* Blütenblatt 2 */}
        <path d="M60 90 C76 80 88 74 93 63 C80 58 70 68 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalDash * (1 - petal2P)}
          style={{ transition: tr }}
        />
        {/* Blütenblatt 3 */}
        <path d="M60 90 C78 92 90 100 91 112 C78 113 67 103 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalDash * (1 - petal3P)}
          style={{ transition: tr }}
        />
        {/* Blütenblatt 4 */}
        <path d="M60 90 C42 92 30 100 29 112 C42 113 53 103 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalDash * (1 - petal4P)}
          style={{ transition: tr }}
        />
        {/* Blütenblatt 5 */}
        <path d="M60 90 C44 80 32 74 27 63 C40 58 50 68 60 90"
          stroke="#E10019" strokeWidth="2.5" strokeLinecap="round" fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalDash * (1 - petal5P)}
          style={{ transition: tr }}
        />

        {/* Blütenmitte */}
        <circle
          cx="60" cy="90"
          r={8 * centerP}
          fill="#E10019"
          opacity={centerP}
          style={{ transition: "r 0.8s ease, opacity 0.8s ease" }}
        />
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
