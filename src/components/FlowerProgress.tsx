"use client";

import { useRef, useEffect } from "react";

export type FlowerVariant = "rose" | "sunflower" | "daisy" | "tulip" | "cherry" | "poppy" | "lavender" | "cornflower" | "cactus" | "forgetmenot";
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

const VARIANTS: FlowerVariant[] = ["rose", "sunflower", "daisy", "tulip", "cherry", "poppy", "lavender", "cornflower", "cactus", "forgetmenot"];

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
  // 10% Puffer links+rechts damit äußere Blüten nicht abgeschnitten werden
  const pad = Math.round(W * 0.10);
  const iW  = W - 2 * pad;
  const sX  = iW / 140, sY = H / 170;
  const ox  = pad;

  const branches: [number,number,number,number][] = [
    [ox+20*sX, 158*sY, ox+70*sX, 90*sY],
    [ox+70*sX, 90*sY,  ox+28*sX, 55*sY],
    [ox+70*sX, 90*sY,  ox+112*sX, 55*sY],
    [ox+28*sX, 55*sY,  ox+12*sX, 28*sY],
    [ox+28*sX, 55*sY,  ox+50*sX, 24*sY],
    [ox+112*sX, 55*sY, ox+90*sX, 24*sY],
    [ox+112*sX, 55*sY, ox+128*sX, 28*sY],
  ];
  const blossoms: [number,number][] = [
    [ox+12*sX, 22*sY], [ox+50*sX, 18*sY], [ox+90*sX, 18*sY], [ox+128*sX, 22*sY], [ox+70*sX, 60*sY],
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
    const r = iW * 0.088 * frac;
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

// ─── Mohnblume ────────────────────────────────────────────────────────────────
function drawPoppy(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, base = H - 4, sLen = H * 0.70;
  const sT = eO(p01(p, 0, 0.25)), sTop = base - sT * sLen;

  if (sT > 0) {
    ctx.beginPath(); ctx.moveTo(cx, base);
    ctx.quadraticCurveTo(cx + W * 0.06, base - sLen * 0.5, cx, sTop);
    ctx.strokeStyle = '#5a8c2a'; ctx.lineWidth = Math.max(1.5, W * 0.018); ctx.lineCap = 'round'; ctx.stroke();
  }
  const lT = eO(p01(p, 0.10, 0.26));
  if (lT > 0) {
    ctx.beginPath();
    ctx.ellipse(cx - W*0.13*lT, base - sLen*0.42*Math.min(lT*2,1), W*0.09*lT, H*0.036*lT, -Math.PI/4, 0, Math.PI*2);
    ctx.fillStyle = '#3d7a2a'; ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + W*0.11*lT, base - sLen*0.58*Math.min(lT*2,1), W*0.08*lT, H*0.030*lT, Math.PI/4, 0, Math.PI*2);
    ctx.fillStyle = '#3d7a2a'; ctx.fill();
  }
  const pT = eO(p01(p, 0.44, 0.88));
  if (pT > 0 && sT > 0.85) {
    for (let i = 0; i < 4; i++) {
      const frac = eO((pT * 4 - i) / 1.2);
      if (frac <= 0) continue;
      const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a)*W*0.10*frac, sTop + Math.sin(a)*H*0.075*frac, W*0.11*frac, H*0.135*frac, a + Math.PI/2, 0, Math.PI*2);
      ctx.fillStyle = '#E10019'; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
    }
    ctx.beginPath(); ctx.arc(cx, sTop, W*0.055*Math.min(pT,1), 0, Math.PI*2);
    ctx.fillStyle = '#1a1a1a'; ctx.fill();
    if (pT > 0.5) {
      for (let k = 0; k < 8; k++) {
        const ka = (k / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ka)*W*0.060, sTop + Math.sin(ka)*H*0.042, W*0.011, 0, Math.PI*2);
        ctx.fillStyle = '#ffd700'; ctx.fill();
      }
    }
  }
}

// ─── Lavendel ────────────────────────────────────────────────────────────────
function drawLavender(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, base = H - 4, sLen = H * 0.66;
  const sT = eO(p01(p, 0, 0.28)), sTop = base - sT * sLen;

  if (sT > 0) {
    ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(cx, sTop);
    ctx.strokeStyle = '#5a6e2a'; ctx.lineWidth = Math.max(1.8, W*0.020); ctx.lineCap = 'round'; ctx.stroke();
  }
  const lT = eO(p01(p, 0.10, 0.28));
  if (lT > 0) {
    const pairs: [number, number][] = [[0.30, -1], [0.30, 1], [0.52, -1], [0.52, 1]];
    pairs.forEach(([h, side]) => {
      const ly = base - sLen * h * Math.min(lT * 2, 1);
      ctx.beginPath();
      ctx.ellipse(cx + side*W*0.10*lT, ly, W*0.085*lT, H*0.033*lT, side*Math.PI/5, 0, Math.PI*2);
      ctx.fillStyle = '#4a7a2a'; ctx.fill();
    });
  }
  const flT = eO(p01(p, 0.42, 0.90));
  if (flT > 0 && sT > 0.78) {
    const spikLen = H * 0.30 * flT;
    const numF = 14;
    for (let i = 0; i < numF; i++) {
      const frac = eO((flT * numF - i) / 2.5);
      if (frac <= 0) continue;
      const fy = sTop + (i / numF) * spikLen;
      const side = (i % 2 === 0) ? -1 : 1;
      ctx.beginPath();
      ctx.ellipse(cx + side*W*0.052, fy, W*0.040*frac, H*0.025*frac, 0, 0, Math.PI*2);
      ctx.fillStyle = '#7b52ab'; ctx.globalAlpha = 0.88; ctx.fill(); ctx.globalAlpha = 1;
    }
  }
}

// ─── Kornblume mit Marienkäfer ───────────────────────────────────────────────
function drawCornflower(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, base = H - 4, sLen = H * 0.72;
  const sT = eO(p01(p, 0, 0.26)), sTop = base - sT * sLen;

  if (sT > 0) {
    ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(cx, sTop);
    ctx.strokeStyle = '#4a7a2a'; ctx.lineWidth = Math.max(2, W*0.022); ctx.lineCap = 'round'; ctx.stroke();
  }
  const lT = eO(p01(p, 0.10, 0.24));
  if (lT > 0) {
    ctx.save(); ctx.translate(cx, base - sLen*0.38*Math.min(lT*2,1)); ctx.rotate(-Math.PI/5);
    ctx.beginPath(); ctx.ellipse(-W*0.07, 0, W*0.10*lT, H*0.036*lT, 0, 0, Math.PI*2);
    ctx.fillStyle = '#5a8c3a'; ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(cx, base - sLen*0.56*Math.min(lT*2,1)); ctx.rotate(Math.PI/5);
    ctx.beginPath(); ctx.ellipse(W*0.07, 0, W*0.10*lT, H*0.036*lT, 0, 0, Math.PI*2);
    ctx.fillStyle = '#5a8c3a'; ctx.fill(); ctx.restore();
  }
  // Marienkäfer
  const lbT = p01(p, 0.35, 0.74);
  if (lbT > 0 && sT > 0.6) {
    const lbY = base - sLen * sT * (0.12 + lbT * 0.54);
    const lbX = cx + Math.sin(lbT * Math.PI * 4) * W * 0.035;
    const lbR = Math.max(3.5, W * 0.052);
    ctx.beginPath(); ctx.ellipse(lbX, lbY, lbR, lbR*0.78, 0, 0, Math.PI*2);
    ctx.fillStyle = '#E10019'; ctx.fill();
    ctx.beginPath(); ctx.arc(lbX, lbY - lbR*0.72, lbR*0.40, 0, Math.PI*2);
    ctx.fillStyle = '#111111'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(lbX, lbY - lbR*0.15); ctx.lineTo(lbX, lbY + lbR*0.72);
    ctx.strokeStyle = '#111111'; ctx.lineWidth = Math.max(0.8, W*0.010); ctx.stroke();
    const spots: [number,number][] = [[-0.36,-0.12],[0.36,-0.12],[-0.28,0.33],[0.28,0.33]];
    spots.forEach(([dx, dy]) => {
      ctx.beginPath(); ctx.arc(lbX + dx*lbR, lbY + dy*lbR, lbR*0.17, 0, Math.PI*2);
      ctx.fillStyle = '#111111'; ctx.fill();
    });
  }
  // Blüte
  const pT = eO(p01(p, 0.55, 0.92));
  if (pT > 0 && sT > 0.85) {
    ctx.beginPath(); ctx.arc(cx, sTop, W*0.052*pT, 0, Math.PI*2);
    ctx.fillStyle = '#2244cc'; ctx.fill();
    const numP = 14;
    for (let i = 0; i < numP; i++) {
      const frac = eO((pT * numP - i) / 2.5);
      if (frac <= 0) continue;
      const a = (i / numP) * Math.PI * 2;
      ctx.save(); ctx.translate(cx, sTop); ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(0, -W*0.052);
      ctx.bezierCurveTo(-W*0.038*frac, -W*0.052-H*0.07*frac, -W*0.038*frac, -W*0.052-H*0.13*frac, 0, -W*0.052-H*0.15*frac);
      ctx.bezierCurveTo(W*0.038*frac, -W*0.052-H*0.13*frac, W*0.038*frac, -W*0.052-H*0.07*frac, 0, -W*0.052);
      ctx.fillStyle = '#4488ee'; ctx.globalAlpha = 0.88; ctx.fill(); ctx.globalAlpha = 1; ctx.restore();
    }
  }
}

// ─── Kaktus ──────────────────────────────────────────────────────────────────
function drawCactus(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, base = H - 4;
  const colW = W * 0.22, fullH = H * 0.68;
  const sT = eO(p01(p, 0, 0.32));

  // Erde
  ctx.beginPath(); ctx.ellipse(cx, base, W*0.28, H*0.038, 0, 0, Math.PI*2);
  ctx.fillStyle = '#8B6914'; ctx.fill();

  if (sT <= 0) return;
  const curH = sT * fullH;
  const colTop = base - curH;

  // Hauptkörper: Rechteck + Halbkreis oben
  ctx.beginPath();
  ctx.moveTo(cx - colW/2, base);
  ctx.lineTo(cx - colW/2, colTop + colW/2);
  ctx.arc(cx, colTop + colW/2, colW/2, Math.PI, 0);
  ctx.lineTo(cx + colW/2, base);
  ctx.closePath();
  ctx.fillStyle = '#2d8a1f'; ctx.fill();
  ctx.strokeStyle = '#1f6015'; ctx.lineWidth = Math.max(0.8, W*0.010); ctx.stroke();

  // Rillen
  ctx.strokeStyle = '#1f6015'; ctx.lineWidth = Math.max(0.4, W*0.006);
  [-0.25, 0, 0.25].forEach(off => {
    const rx = cx + off * colW;
    ctx.beginPath(); ctx.moveTo(rx, Math.min(base-2, colTop + colW*0.6)); ctx.lineTo(rx, base-2); ctx.stroke();
  });

  // Dornen am Hauptkörper
  const nSpine = Math.floor(sT * 7);
  ctx.strokeStyle = '#d4c44d'; ctx.lineCap = 'round';
  for (let i = 1; i <= nSpine; i++) {
    const sy = base - (i / 7) * curH + 4;
    [-1, 1].forEach(side => {
      ctx.beginPath();
      ctx.moveTo(cx + side * colW/2, sy);
      ctx.lineTo(cx + side * (colW/2 + W*0.07), sy - H*0.008);
      ctx.lineWidth = Math.max(0.8, W*0.011); ctx.stroke();
    });
  }

  // Linker Arm
  const lA = eO(p01(p, 0.36, 0.62));
  if (lA > 0) {
    const aw = colW * 0.76, jY = base - curH * 0.44, aH = fullH * 0.30 * lA;
    const aX = cx - colW/2 - aw/2;
    // Quersteg
    ctx.beginPath(); ctx.ellipse(aX, jY, aw*0.38, colW*0.32, 0, 0, Math.PI*2);
    ctx.fillStyle = '#2d8a1f'; ctx.fill();
    // Arm
    ctx.beginPath();
    ctx.moveTo(aX - aw/2, jY);
    ctx.lineTo(aX - aw/2, jY - aH + aw/2);
    ctx.arc(aX, jY - aH + aw/2, aw/2, Math.PI, 0);
    ctx.lineTo(aX + aw/2, jY); ctx.closePath();
    ctx.fillStyle = '#2d8a1f'; ctx.fill();
    ctx.strokeStyle = '#1f6015'; ctx.lineWidth = Math.max(0.6, W*0.008); ctx.stroke();
    // Arm-Dornen
    ctx.strokeStyle = '#d4c44d'; ctx.lineWidth = Math.max(0.8, W*0.011);
    for (let k = 1; k <= 3; k++) {
      const sy2 = jY - (k/3)*aH + 4;
      ctx.beginPath(); ctx.moveTo(aX - aw/2, sy2); ctx.lineTo(aX - aw/2 - W*0.06, sy2 - H*0.007); ctx.stroke();
    }
  }

  // Rechter Arm
  const rA = eO(p01(p, 0.58, 0.82));
  if (rA > 0) {
    const aw2 = colW * 0.70, jY2 = base - curH * 0.64, aH2 = fullH * 0.20 * rA;
    const aX2 = cx + colW/2 + aw2/2;
    ctx.beginPath(); ctx.ellipse(aX2, jY2, aw2*0.38, colW*0.28, 0, 0, Math.PI*2);
    ctx.fillStyle = '#2d8a1f'; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(aX2 - aw2/2, jY2);
    ctx.lineTo(aX2 - aw2/2, jY2 - aH2 + aw2/2);
    ctx.arc(aX2, jY2 - aH2 + aw2/2, aw2/2, Math.PI, 0);
    ctx.lineTo(aX2 + aw2/2, jY2); ctx.closePath();
    ctx.fillStyle = '#2d8a1f'; ctx.fill();
    ctx.strokeStyle = '#1f6015'; ctx.lineWidth = Math.max(0.6, W*0.008); ctx.stroke();
  }

  // Blüte oben
  const fT = eO(p01(p, 0.84, 0.98));
  if (fT > 0) {
    const fy = colTop + colW/2;
    for (let i = 0; i < 6; i++) {
      const a = (i/6)*Math.PI*2;
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a)*W*0.085*fT, fy + Math.sin(a)*H*0.058*fT, W*0.060*fT, H*0.072*fT, a, 0, Math.PI*2);
      ctx.fillStyle = '#ff69b4'; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(cx, fy, W*0.050*fT, 0, Math.PI*2);
    ctx.fillStyle = '#ffd700'; ctx.fill();
  }
}

// ─── Vergissmeinnicht ─────────────────────────────────────────────────────────
function drawForgetMeNot(ctx: CanvasRenderingContext2D, W: number, H: number, p: number) {
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, base = H - 4, sLen = H * 0.66;
  const sT = eO(p01(p, 0, 0.26)), sTop = base - sT * sLen;

  if (sT > 0) {
    ctx.beginPath(); ctx.moveTo(cx, base);
    ctx.quadraticCurveTo(cx - W*0.04, base - sLen*0.5, cx, sTop);
    ctx.strokeStyle = '#4a8c2a'; ctx.lineWidth = Math.max(1.2, W*0.014); ctx.lineCap = 'round'; ctx.stroke();
  }
  const lT = eO(p01(p, 0.10, 0.24));
  if (lT > 0) {
    const leafPs: [number, number][] = [[0.30, -1], [0.46, 1], [0.60, -1]];
    leafPs.forEach(([h, side]) => {
      const ly = base - sLen * h * Math.min(lT*2, 1);
      ctx.beginPath();
      ctx.ellipse(cx + side*W*0.088*lT, ly, W*0.068*lT, H*0.028*lT, side*Math.PI/6, 0, Math.PI*2);
      ctx.fillStyle = '#3a7a2a'; ctx.fill();
    });
  }
  const flT = eO(p01(p, 0.44, 0.90));
  if (flT > 0 && sT > 0.75) {
    const positions: [number, number][] = [
      [0, 0],
      [-W*0.17, H*0.07], [W*0.17, H*0.07],
      [-W*0.09, H*0.13], [W*0.09, H*0.13],
    ];
    positions.slice(1).forEach(([dx, dy], i) => {
      const frac = eO((flT * positions.length - (i+1)) / 2);
      if (frac <= 0) return;
      ctx.beginPath(); ctx.moveTo(cx, sTop + H*0.04);
      ctx.lineTo(cx + dx, sTop + dy);
      ctx.strokeStyle = '#4a8c2a'; ctx.lineWidth = Math.max(0.8, W*0.011); ctx.lineCap = 'round'; ctx.stroke();
    });
    positions.forEach(([dx, dy], i) => {
      const frac = eO((flT * positions.length - i) / 2);
      if (frac <= 0) return;
      const fx = cx + dx, fy = sTop + dy;
      const r = W * 0.055 * frac;
      for (let j = 0; j < 5; j++) {
        const a = (j/5)*Math.PI*2 - Math.PI/2;
        ctx.beginPath();
        ctx.ellipse(fx + Math.cos(a)*r*0.90, fy + Math.sin(a)*r*0.90, r*0.65, r*0.50, a, 0, Math.PI*2);
        ctx.fillStyle = '#87CEEB'; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(fx, fy, r*0.28, 0, Math.PI*2);
      ctx.fillStyle = '#ffd700'; ctx.fill();
    });
  }
}

type DrawFn = (ctx: CanvasRenderingContext2D, W: number, H: number, p: number) => void;
const DRAW: Record<FlowerVariant, DrawFn> = {
  rose: drawRose, sunflower: drawSunflower, daisy: drawDaisy, tulip: drawTulip, cherry: drawCherry,
  poppy: drawPoppy, lavender: drawLavender, cornflower: drawCornflower, cactus: drawCactus, forgetmenot: drawForgetMeNot,
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
