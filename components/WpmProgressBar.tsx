"use client";

import { useEffect, useState } from 'react';

const WPM_FLAGS = [20, 40, 60, 80, 90, 100];
const MAX_WPM   = 110;

export function WpmProgressBar({ wpm }: { wpm: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    setDisplayed(0);
    let start: number | null = null;
    const duration = 2500;
    const target   = Math.min(wpm, MAX_WPM);
    const animate  = (ts: number) => {
      if (!start) start = ts;
      const t    = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 5);
      setDisplayed(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(animate);
      else setDisplayed(target);
    };
    requestAnimationFrame(animate);
  }, [wpm]);

  const fillPct = Math.min((displayed / MAX_WPM) * 100, 100);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontSize: '7px', color: 'var(--gb-dark)', letterSpacing: '2px', marginBottom: '10px' }}>
        WPM DISTANCE
      </div>
      <div style={{
        position: 'relative', width: '100%', height: '22px',
        background: 'rgba(15,56,15,0.35)', border: '3px solid var(--gb-dark)',
        boxShadow: 'inset 0 2px 0 rgba(0,0,0,0.25)', overflow: 'visible',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: `${fillPct}%`,
          background: 'var(--gb-darkest)',
          boxShadow: '2px 0 0 var(--gb-dark)',
        }} />
        <div style={{
          position: 'absolute', top: '3px', left: 0, right: 0, height: '3px',
          background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
        }} />
        {WPM_FLAGS.map(flag => {
          const pos    = (flag / MAX_WPM) * 100;
          const passed = displayed >= flag;
          return (
            <div key={flag} style={{
              position: 'absolute', left: `${pos}%`, top: '-2px',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              zIndex: 3,
            }}>
              <div style={{ width: '2px', height: '28px', background: passed ? 'var(--gb-mid)' : 'var(--gb-dark)' }} />
              <div style={{
                position: 'absolute', top: 0, left: '2px',
                width: '14px', height: '9px',
                background: passed ? 'var(--gb-mid)' : 'var(--gb-dark)',
                border: `1px solid ${passed ? 'var(--gb-darkest)' : 'rgba(15,56,15,0.5)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '4px', color: passed ? 'var(--gb-darkest)' : 'rgba(15,56,15,0.6)', lineHeight: 1 }}>
                  {flag}
                </span>
              </div>
            </div>
          );
        })}
        {fillPct > 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: `${fillPct}%`,
            width: '12px', height: '12px', borderRadius: '50%',
            background: 'var(--gb-mid)', border: '3px solid var(--gb-darkest)',
            boxShadow: '0 0 0 2px var(--gb-dark)',
            transform: 'translate(-50%,-50%)',
            zIndex: 4,
          }} />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '6px', color: 'var(--gb-dark)' }}>
        <span>0</span>
        <span style={{ color: 'var(--gb-darkest)', fontSize: '7px' }}>{wpm} WPM</span>
        <span>{MAX_WPM}+</span>
      </div>
    </div>
  );
}
