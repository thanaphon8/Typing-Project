"use client";

import { useEffect, useRef, useState } from 'react';

interface Particle { id: number; x: number; y: number; vx: number; vy: number; rot: number; vrot: number; color: string; w: number; h: number; }

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const raf = useRef<number>(0);
  const COLORS = ['#0f380f','#306230','#8bac0f','#9bbc0f','#c4d486','#ffffff'];

  useEffect(() => {
    if (!active) { setParticles([]); return; }
    const ps: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 30 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(1.5 + Math.random() * 2.5),
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: 4 + Math.random() * 6,
      h: 3 + Math.random() * 4,
    }));
    setParticles(ps);
    let frame = 0;
    const tick = () => {
      frame++;
      setParticles(prev => prev
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.12, rot: p.rot + p.vrot }))
        .filter(p => p.y < 120)
      );
      if (frame < 120) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  if (!particles.length) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 50 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.w}px`, height: `${p.h}px`,
          background: p.color,
          transform: `rotate(${p.rot}deg)`,
          opacity: 0.9,
        }} />
      ))}
    </div>
  );
}
