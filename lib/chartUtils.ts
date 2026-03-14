/* ═══════════════════════════════════════════════════════════════
   lib/chartUtils.ts  —  shared chart utilities for PixelType
   ═══════════════════════════════════════════════════════════════ */

export interface WordEvent {
  word: string;
  correct: boolean;
  sec?: number;
  ts?: number;
}

export function buildWpmPoints(wordEvents: WordEvent[], timeLimit: number): number[] {
  const wBySecond: number[] = Array(timeLimit).fill(0);
  wordEvents.forEach((ev: WordEvent) => {
    if (ev.correct) {
      const rawSec = ev.sec !== undefined ? ev.sec : Math.floor((ev.ts ?? 0) / 1000);
      const idx = Math.min(Math.max(0, rawSec), timeLimit - 1);
      wBySecond[idx]++;
    }
  });
  let cumWords = 0;
  return wBySecond.map((w: number, i: number) => {
    cumWords += w;
    return Math.round(cumWords / ((i + 1) / 60));
  });
}

export function smoothPath(ps: { x: number; y: number }[]): string {
  if (ps.length < 2) return `M${ps[0].x},${ps[0].y}`;
  let d = `M${ps[0].x},${ps[0].y}`;
  for (let i = 1; i < ps.length; i++) {
    const cpx = (ps[i - 1].x + ps[i].x) / 2;
    d += ` C${cpx},${ps[i - 1].y} ${cpx},${ps[i].y} ${ps[i].x},${ps[i].y}`;
  }
  return d;
}

export function buildChartData(wordEvents: WordEvent[], timeLimit: number) {
  const wpmPts = buildWpmPoints(wordEvents, timeLimit);
  const maxWpm = Math.max(1, ...wpmPts);
  const pts = wpmPts.map((v, i) => ({
    x: ((i + 0.5) / timeLimit) * 100,
    y: ((maxWpm - v) / maxWpm) * 100,
    wpm: v,
    sec: i + 1,
  }));
  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L${pts[pts.length - 1].x},100 L${pts[0].x},100 Z`;
  return { pts, wpmPts, maxWpm, linePath, areaPath };
}