"use client";

interface RoseProgressProps {
  progress: number; // 0-100
  uploadedMB?: number;
  totalMB?: number;
}

/**
 * Animierte rote Rose als Upload-Fortschrittsanzeige.
 * Die Rose wächst von unten (Stiel) nach oben (Blüte) mit dem Fortschritt.
 * Technik: stroke-dashoffset auf SVG-Paths, gesteuert durch progress (0-100).
 */
export default function RoseProgress({ progress, uploadedMB, totalMB }: RoseProgressProps) {
  // Stiel + Blätter: sichtbar ab 0%, vollständig bei 40%
  const stemProgress = Math.min(1, progress / 40);
  // Blütenblätter: öffnen sich von 40% bis 100%
  const petalProgress = Math.max(0, Math.min(1, (progress - 40) / 60));

  const stemDash = 120;
  const stemOffset = stemDash * (1 - stemProgress);

  const petalDash = 80;
  // 5 Blütenblätter, jedes erscheint gestaffelt
  const petalOffsets = [0, 0.15, 0.3, 0.45, 0.6].map((delay) => {
    const p = Math.max(0, Math.min(1, (petalProgress - delay) / (1 - delay)));
    return petalDash * (1 - p);
  });

  const leafDash = 60;
  const leaf1Offset = leafDash * (1 - Math.min(1, progress / 30));
  const leaf2Offset = leafDash * (1 - Math.min(1, Math.max(0, (progress - 15) / 25)));

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width="120"
        height="180"
        viewBox="0 0 120 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stiel */}
        <path
          d="M60 170 C60 140 58 120 60 95"
          stroke="#2D7A2D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={stemDash}
          strokeDashoffset={stemOffset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />

        {/* Blatt links */}
        <path
          d="M57 145 C45 138 38 128 42 118 C50 122 56 132 57 145"
          stroke="#2D7A2D"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={leafDash}
          strokeDashoffset={leaf1Offset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />

        {/* Blatt rechts */}
        <path
          d="M63 130 C75 123 82 112 78 102 C70 106 64 118 63 130"
          stroke="#2D7A2D"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={leafDash}
          strokeDashoffset={leaf2Offset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />

        {/* Blütenblatt 1 — oben */}
        <path
          d="M60 90 C55 72 50 60 60 50 C70 60 65 72 60 90"
          stroke="#E10019"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalOffsets[0]}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />

        {/* Blütenblatt 2 — rechts oben */}
        <path
          d="M60 90 C76 80 88 74 93 63 C80 58 70 68 60 90"
          stroke="#E10019"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalOffsets[1]}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />

        {/* Blütenblatt 3 — rechts unten */}
        <path
          d="M60 90 C78 92 90 100 91 112 C78 113 67 103 60 90"
          stroke="#E10019"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalOffsets[2]}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />

        {/* Blütenblatt 4 — links unten */}
        <path
          d="M60 90 C42 92 30 100 29 112 C42 113 53 103 60 90"
          stroke="#E10019"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalOffsets[3]}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />

        {/* Blütenblatt 5 — links oben */}
        <path
          d="M60 90 C44 80 32 74 27 63 C40 58 50 68 60 90"
          stroke="#E10019"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={petalDash}
          strokeDashoffset={petalOffsets[4]}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />

        {/* Blütenmitte — erscheint bei 100% */}
        {progress >= 95 && (
          <circle cx="60" cy="90" r="8" fill="#E10019" opacity={Math.min(1, (progress - 95) / 5)} />
        )}
      </svg>

      {/* Fortschrittstext */}
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: "#003063" }}>
          {Math.round(progress)}&nbsp;%
        </div>
        {uploadedMB !== undefined && totalMB !== undefined && (
          <div className="text-sm mt-1" style={{ color: "#505050" }}>
            {uploadedMB.toFixed(1)}&nbsp;MB von {totalMB.toFixed(1)}&nbsp;MB
          </div>
        )}
      </div>
    </div>
  );
}
