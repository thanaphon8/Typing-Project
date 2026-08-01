"use client";

import { useState } from 'react';
import { buildChartData, WordEvent } from '../lib/chartUtils';

export function ResultChart({ wordEvents, timeLimit }: { wordEvents: WordEvent[]; timeLimit: number }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; wpm: number; sec: number } | null>(null);
  if (!wordEvents.length) return null;

  const { pts, wpmPts, maxWpm, linePath, areaPath } = buildChartData(wordEvents, timeLimit);
  const CHART_H = 90;
  const step    = timeLimit <= 30 ? 5 : timeLimit <= 60 ? 10 : 20;
  const yTicks  = [1, 0.75, 0.5, 0.25, 0].map(t => Math.round(maxWpm * t));

  return (
    <div>
      <div style={{ fontSize: '7px', color: 'var(--gb-dark)', letterSpacing: '2px', marginBottom: '8px' }}>
        WPM OVER TIME
      </div>
      <div style={{ position: 'relative', width: '100%', height: `${CHART_H}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ display: 'block', overflow: 'visible', position: 'absolute', inset: 0 }}>
          {[0.25, 0.5, 0.75].map((t, i) => (
            <line key={i} x1="0" y1={t * 100} x2="100" y2={t * 100}
              stroke="var(--gb-dark)" strokeWidth="0.4" strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke" />
          ))}
          <path d={areaPath} fill="rgba(15,56,15,0.25)" stroke="none" />
          <path d={linePath} fill="none" stroke="var(--gb-darkest)"
            strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {pts.map((p: { x: number; y: number; wpm: number; sec: number }, i: number) => (
          <div key={i}
            onMouseEnter={() => setTooltip({ x: p.x, y: p.y, wpm: p.wpm, sec: p.sec })}
            onMouseLeave={() => setTooltip(null)}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: 10, height: 10, borderRadius: '50%',
              background: 'var(--gb-darkest)', border: 'none',
              transform: 'translate(-50%, calc(-100% - 3px))', cursor: 'crosshair', zIndex: 2,
            }} />
        ))}
        {tooltip && (
          <div style={{
            position: 'absolute',
            left: `${tooltip.x}%`,
            top: `${tooltip.y}%`,
            transform: 'translate(-50%, -140%)',
            background: 'var(--gb-darkest)',
            color: 'var(--gb-mid)',
            fontSize: '7px',
            padding: '4px 8px',
            border: '2px solid var(--gb-mid)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '2px 2px 0 var(--gb-dark)',
          }}>
            {tooltip.sec}s — {tooltip.wpm} wpm
          </div>
        )}
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
          {yTicks.map((v: number, i: number) => (
            <span key={i} style={{ fontSize: '5px', color: 'var(--gb-dark)', lineHeight: 1 }}>{v}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', marginTop: '4px' }}>
        {wpmPts.map((_: number, i: number) => (
          <span key={i} style={{ flex: 1, fontSize: '5px', color: 'var(--gb-dark)', textAlign: 'center' }}>
            {(i + 1) % step === 0 ? i + 1 : ''}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '7px', color: 'var(--gb-dark)' }}>
        <span>PEAK <span style={{ color: 'var(--gb-darkest)' }}>{Math.max(...wpmPts)}</span></span>
        <span>AVG <span style={{ color: 'var(--gb-darkest)' }}>{Math.round(wpmPts.reduce((a: number, b: number) => a + b, 0) / wpmPts.length)}</span></span>
      </div>
    </div>
  );
}
