"use client";

import { useRef, useEffect } from "react";

export type FlowerVariant = "rose" | "sunflower" | "daisy" | "tulip" | "cherry";
export type FlowerPhase   = "uploading" | "validating" | "importing" | "done";

interface FlowerProgressProps {
  progress:    number;
  phase:       FlowerPhase;
  variant?:    FlowerVariant;
  uploadedMB?: number;
  totalMB?:    number;
  size?:       number;
  showLabel?:  boolean;
}

const VARIANTS: FlowerVariant[] = ["rose", "sunflower", "daisy", "tulip", "cherry"];

export function randomVariant(): FlowerVariant {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

export function variantFromString(s: string): FlowerVariant {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return VARIANTS[Math.abs(h) % VARIANTS.length];
}

function p01(v: number, lo: number, hi: number) {
  return Math.min(1, Math.max(0, (v - lo) / (hi - lo)));
}
function eO(t: number) {
  t = Math.max(0, Math.min(1, t));
  return 1 - (1 - t) ** 3;
}

// ─── Rose ────────────────────────────────────────────────────────────────────
function drawRose(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, base = H - 4, sLen = H * 0.72;
  const sT = eO(p01(p, 0, 0.22)), sTop = base - sT * sLen;

  if (sT > 0) {
    ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(cx, sTop);
    ctx.strokeStyle = '#2d7a3a'; ctx.lineWidth = Math.max(2, W * 0.026); ctx.lineCap = 'round'; ctx.stroke();
  }

  const lL = eO(p01(p, 0.08, 0.20));
  if (lL > 0) {
    ctx.beginPath();
    ctx.ellipse(cx - W*0.14*lL, base - sLen*0.44*Math.min(lL*2,1), W*0.13*lL, H*0.054*lL, -Math.PI/4, 0, Math.PI*2);
    ctx.fillStyle = '#2d9e50'; ctx.fill();
  }
  const lR = eO(p01(p, 0.16, 0.26));
  if (lR > 0) {
    ctx.beginPath();
    ctx.ellipse(cx + W*0.14*lR, base - sLen*0.60*Math.min(lR*2,1), W*0.13*lR, H*0.054*lR, Math.PI/4, 0, Math.PI*2);
    ctx.fillStyle = '#2d9e50'; ctx.fill();
  }

  const bud = eO(p01(p, 0.44, 0.52));
  if (bud > 0 && sT > 0.85) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a)*W*0.055*bud, sTop - H*0.035*bud, W*0.033*bud, H*0.055*bud, a, 0, Math.PI*2);
      ctx.fillStyle = '#2d7a3a'; ctx.fill();
    }
  }

  const pT = eO(p01(p, 0.50, 0.87));
  if (pT > 0 && sT > 0.85) {
    for (let i = 0; i < 5; i++) {
      const frac = eO((pT * 5 - i) / 1);
      if (frac <= 0) continue;
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a)*W*0.14*frac, sTop + Math.sin(a)*H*0.10*frac, W*0.082*frac, H*0.11*frac, a + Math.PI/2, 0, Math.PI*2);
      ctx.fillStyle = '#E10019'; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
    }
    ctx.beginPath(); ctx.arc(cx, sTop, W*0.065*Math.min(pT,1), 0, Math.PI*2);
    ctx.fillStyle = '#ffd700'; ctx.fill();
  }
}

// ─── Sonnenblume ─────────────────────────────────────────────────────────────
function drawSunflower(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W/2, base = H - 4, sLen = H * 0.72;
  const sT = eO(p01(p, 0, 0.30)), sTop = base - sT * sLen;

  if (sT > 0) {
    ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(cx, sTop);
    ctx.strokeStyle = '#4a8c2a'; ctx.lineWidth = Math.max(2.5, W*0.034); ctx.lineCap = 'round'; ctx.stroke();
  }
  const lL = eO(p01(p, 0.10, 0.22));
  if (lL > 0) {
    ctx.save(); ctx.translate(cx, base - sLen*0.38*Math.min(lL*2,1)); ctx.rotate(-Math.PI/6);
    ctx.beginPath(); ctx.ellipse(-W*0.07, 0, W*0.14*lL, H*0.054*lL, 0, 0, Math.PI*2);
    ctx.fillStyle = '#3a7a1e'; ctx.fill(); ctx.restore();
  }
  const lR = eO(p01(p, 0.20, 0.32));
  if (lR > 0) {
    ctx.save(); ctx.translate(cx, base - sLen*0.58*Math.min(lR*2,1)); ctx.rotate(Math.PI/6);
    ctx.beginPath(); ctx.ellipse(W*0.07, 0, W*0.14*lR, H*0.054*lR, 0, 0, Math.PI*2);
    ctx.fillStyle = '#3a7a1e'; ctx.fill(); ctx.restore();
  }

  const pT = eO(p01(p, 0.40, 0.80));
  if (pT > 0 && sT > 0.85) {
    for (let i = 0; i < 13; i++) {
      const frac = eO((pT * 13 - i) / 2);
      if (frac <= 0) continue;
      const a = (i / 13) * Math.PI * 2;
      ctx.save(); ctx.translate(cx, sTop); ctx.rotate(a);
      ctx.beginPath(); ctx.ellipse(0, -H*0.18*frac, W*0.047*frac, H*0.10*frac, 0, 0, Math.PI*2);
      ctx.fillStyle = '#f5a623'; ctx.fill(); ctx.restore();
    }
  }
  const cT = eO(p01(p, 0.55, 0.85));
  if (cT > 0 && sT > 0.85) {
    ctx.beginPath(); ctx.arc(cx, sTop, W*0.125*cT, 0, Math.PI*2);
    const g = ctx.createRadialGradient(cx, sTop-3, 1, cx, sTop, W*0.125*cT);
    g.addColorStop(0, '#6b3a0f'); g.addColorStop(1, '#3b1e05');
    ctx.fillStyle = g; ctx.fill();
  }
}

// ─── Margerite ───────────────────────────────────────────────────────────────
function drawDaisy(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W/2, base = H - 4, sLen = H * 0.68;
  const sT = eO(p01(p, 0, 0.28)), sTop = base - sT * sLen;

  if (sT > 0) {
    ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(cx, sTop);
    ctx.strokeStyle = '#3a8c2a'; ctx.lineWidth = Math.max(1.5, W*0.022); ctx.lineCap = 'round'; ctx.stroke();
  }
  const lT = eO(p01(p, 0.12, 0.25));
  if (lT > 0) {
    ctx.save(); ctx.translate(cx-1, base - sLen*0.40*Math.min(lT*2,1)); ctx.rotate(-Math.PI/5);
    ctx.beginPath(); ctx.ellipse(-W*0.06, 0, W*0.11*lT, H*0.045*lT, 0, 0, Math.PI*2);
    ctx.fillStyle = '#2d7a1e'; ctx.fill(); ctx.restore();
  }

  const pT = eO(p01(p, 0.38, 0.80));
  if (pT > 0 && sT > 0.80) {
    for (let i = 0; i < 18; i++) {
      const frac = eO((pT * 18 - i) / 2.5);
      if (frac <= 0) continue;
      const a = (i / 18) * Math.PI * 2 - Math.PI / 2;
      ctx.save(); ctx.translate(cx, sTop); ctx.rotate(a);
      ctx.beginPath(); ctx.ellipse(0, -H*0.15*frac, W*0.025*frac, H*0.085*frac, 0, 0, Math.PI*2);
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#d0dae4'; ctx.lineWidth = 0.5;
      ctx.fill(); ctx.stroke(); ctx.restore();
    }
  }
  const cT = eO(p01(p, 0.50, 0.75));
  if (cT > 0 && sT > 0.80) {
    ctx.beginPath(); ctx.arc(cx, sTop, W*0.088*cT, 0, Math.PI*2);
    const g = ctx.createRadialGradient(cx-1, sTop-1, 0, cx, sTop, W*0.088*cT);
    g.addColorStop(0, '#ffe566'); g.addColorStop(1, '#f5a000');
    ctx.fillStyle = g; ctx.fill();
  }
}

// ─── Tulpe ───────────────────────────────────────────────────────────────────
function drawTulip(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W/2, base = H - 4, sLen = H * 0.65;
  const sT = eO(p01(p, 0, 0.30)), sTop = base - sT * sLen;

  if (sT > 0) {
    ctx.beginPath(); ctx.moveTo(cx, base);
    ctx.bezierCurveTo(cx-4, base-sLen*0.3, cx+4, base-sLen*0.7, cx, sTop);
    ctx.strokeStyle = '#3a8c2a'; ctx.lineWidth = Math.max(2.5, W*0.034); ctx.lineCap = 'round'; ctx.stroke();
  }
  const lL = eO(p01(p, 0.12, 0.25));
  if (lL > 0) {
    const ly = base - sLen * 0.35;
    ctx.save(); ctx.translate(cx, ly);
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-4*lL, -H*0.11*lL, -W*0.22*lL, -H*0.17*lL, -W*0.24*lL, -H*0.08*lL);
    ctx.bezierCurveTo(-W*0.15*lL, -H*0.13*lL, -5*lL, -H*0.055*lL, 0, 0);
    ctx.fillStyle = '#2d9a3a'; ctx.fill(); ctx.restore();
  }
  const lR = eO(p01(p, 0.22, 0.35));
  if (lR > 0) {
    const ly2 = base - sLen * 0.55;
    ctx.save(); ctx.translate(cx, ly2);
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.bezierCurveTo(4*lR, -H*0.11*lR, W*0.22*lR, -H*0.17*lR, W*0.24*lR, -H*0.08*lR);
    ctx.bezierCurveTo(W*0.15*lR, -H*0.13*lR, 5*lR, -H*0.055*lR, 0, 0);
    ctx.fillStyle = '#2d9a3a'; ctx.fill(); ctx.restore();
  }

  const tT = eO(p01(p, 0.42, 0.87));
  if (tT > 0 && sT > 0.85) {
    const openA = tT * 28 * Math.PI / 180;
    const cols = ['#E10019','#cc0015','#E10019','#cc0015','#E10019','#cc0015'];
    for (let i = 0; i < 6; i++) {
      const frac = eO((tT * 6 - i * 0.8) / 1.5);
      if (frac <= 0) continue;
      ctx.save(); ctx.translate(cx, sTop);
      ctx.rotate((i / 6) * Math.PI * 2); ctx.rotate(-openA * frac);
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-W*0.077*frac, -H*0.11*frac, -W*0.077*frac, -H*0.27*frac, 0, -H*0.32*frac);
      ctx.bezierCurveTo(W*0.077*frac, -H*0.27*frac, W*0.077*frac, -H*0.11*frac, 0, 0);
      ctx.fillStyle = cols[i]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1; ctx.restore();
    }
  }
}

// ─── Kirschblüte ─────────────────────────────────────────────────────────────
function drawCherry(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const sX = W / 140, sY = H / 170;

  const branches: [number,number,number,number][] = [
    [20*sX, 158*sY, 70*sX, 90*sY],
    [70*sX, 90*sY,  28*sX, 55*sY],
    [70*sX, 90*sY,  112*sX, 55*sY],
    [28*sX, 55*sY,  12*sX, 28*sY],
    [28*sX, 55*sY,  50*sX, 24*sY],
    [112*sX, 55*sY, 90*sX, 24*sY],
    [112*sX, 55*sY, 128*sX, 28*sY],
  ];
  const blossoms: [number,number][] = [
    [12*sX, 22*sY], [50*sX, 18*sY], [90*sX, 18*sY], [128*sX, 22*sY], [70*sX, 60*sY],
  ];

  const brT = p01(p, 0, 0.55);
  branches.forEach(([x1, y1, x2, y2], i) => {
    const frac = eO((brT * branches.length - i) / 1);
    if (frac <= 0) return;
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + (x2-x1)*frac, y1 + (y2-y1)*frac);
    ctx.strokeStyle = '#5c3317';
    ctx.lineWidth = (i < 2 ? 4 : i < 4 ? 3 : 2) * Math.min(sX, sY);
    ctx.lineCap = 'round'; ctx.stroke();
  });

  const blT = p01(p, 0.50, 0.95);
  blossoms.forEach(([x, y], i) => {
    const frac = eO((blT * blossoms.length - i) / 1.5);
    if (frac <= 0) return;
    const r = W * 0.088 * frac;
    for (let j = 0; j < 5; j++) {
      const a = (j / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a)*r*0.9, y + Math.sin(a)*r*0.9, r*0.7, r*0.55, a, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(255,192,203,0.9)'; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(x, y, r*0.35, 0, Math.PI*2);
    ctx.fillStyle = '#ffd700'; ctx.fill();
  });
}

type DrawFn = (ctx: CanvasRenderingContext2D, W: number, H: number, p: number) => void;
const DRAW: Record<FlowerVariant, DrawFn> = {
  rose: drawRose, sunflower: drawSunflower, daisy: drawDaisy, tulip: drawTulip, cherry: drawCherry,
};

// ─── Komponente ──────────────────────────────────────────────────────────────

export default function FlowerProgress({
  progress,
  phase,
  variant = "rose",
  uploadedMB,
  totalMB,
  size = 1,
  showLabel = true,
}: FlowerProgressProps) {
  const W = Math.round(140 * size);
  const H = Math.round(190 * size);

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const curPRef    = useRef<number>(0);
  const targetPRef = useRef<number>(progress / 100);

  // Ziel synchron halten
  useEffect(() => { targetPRef.current = progress / 100; }, [progress]);

  // Animations-Loop: interpoliert curP sanft gegen targetP
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const fn = DRAW[variant];

    // Bei Varianten-Wechsel sauber von 0 neu aufbauen
    curPRef.current = 0;

    function tick() {
      const diff = targetPRef.current - curPRef.current;
      curPRef.current += Math.abs(diff) < 0.001 ? diff : diff * 0.09;
      fn(ctx!, W, H, curPRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [variant, W, H]);

  const statusText =
    phase === "uploading"  ? "Datei wird übertragen …" :
    phase === "validating" ? "Validierung läuft …"     :
    phase === "importing"  ? "Import in Datenbank …"   : "Fertig!";

  const subText =
    phase === "uploading" && uploadedMB !== undefined && totalMB !== undefined
      ? `${uploadedMB.toFixed(1)} MB von ${totalMB.toFixed(1)} MB`
      : phase === "validating" ? "XML wird gegen Schema geprüft"
      : phase === "importing"  ? "Daten werden gespeichert"
      : "Import erfolgreich";

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} width={W} height={H} />
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
