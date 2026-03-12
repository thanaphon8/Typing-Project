"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ═══════════════════════════ CSS ═══════════════════════════ */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  * { font-family: 'Press Start 2P', monospace; }

  :root {
    --gb-darkest: #0f380f;
    --gb-dark:    #306230;
    --gb-mid:     #8bac0f;
    --gb-light:   #9bbc0f;
    --gb-screen:  #8bac0f;
  }

  html, body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }

  .gb-bg {
    background: var(--gb-darkest); min-height: 100vh; width: 100%;
    display: flex; flex-direction: column; align-items: center;
    padding: 20px 16px 32px;
  }
  .gb-bg::before {
    content: ''; position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px);
    pointer-events: none; z-index: 9999;
  }

  .pixel-btn {
    border: 3px solid var(--gb-dark); box-shadow: 3px 3px 0 var(--gb-darkest);
    cursor: pointer; background: var(--gb-mid); color: var(--gb-darkest);
    padding: 6px 12px; font-size: 8px; text-transform: lowercase;
    transition: all 0.08s; white-space: nowrap;
  }
  .pixel-btn:hover  { box-shadow: 1px 1px 0 var(--gb-darkest); transform: translate(2px,2px); }
  .pixel-btn.active { background: var(--gb-light); box-shadow: inset 2px 2px 0 var(--gb-darkest); transform: translate(2px,2px); }

  .gb-logo { font-size: clamp(12px,3vw,18px); color: var(--gb-mid); text-shadow: 2px 2px 0 var(--gb-darkest), 3px 3px 0 var(--gb-dark); letter-spacing: 3px; }
  .gb-logo span { font-size: 9px; color: var(--gb-dark); text-shadow: none; }

  .gb-screen {
    background: var(--gb-screen); width: 100%;
    border: 6px solid var(--gb-dark);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.28), 0 0 0 4px var(--gb-darkest), 0 0 0 8px var(--gb-dark);
  }
  .screen-texture { background-image: radial-gradient(circle,rgba(0,0,0,0.05) 1px,transparent 1px); background-size: 8px 8px; }

  .settings-bar {
    display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center;
    padding: 10px 16px; background: rgba(15,56,15,0.6);
    border: 3px solid var(--gb-dark); box-shadow: 3px 3px 0 var(--gb-darkest); width: 100%;
  }
  .settings-sep { width: 2px; height: 20px; background: var(--gb-dark); flex-shrink: 0; }
  .section-lbl  { font-size: 7px; color: var(--gb-dark); letter-spacing: 2px; white-space: nowrap; }

  .gb-timer { font-size: clamp(18px,4vw,28px); color: var(--gb-darkest); letter-spacing: 2px; text-shadow: 2px 2px 0 var(--gb-mid); }

  .pixel-divider {
    width: 100%; height: 4px;
    background: repeating-linear-gradient(90deg,var(--gb-dark) 0,var(--gb-dark) 8px,transparent 8px,transparent 16px);
    margin: 12px 0;
  }

  .words-box {
    display: flex; flex-wrap: wrap; gap: 10px 24px;
    font-size: clamp(14px,2.2vw,20px); line-height: 3.2;
    height: 320px; overflow: hidden; align-content: flex-start;
  }
  @media(max-width:600px){ .words-box{ height:260px; font-size:13px; gap:8px 14px; } }

  .word-idle    { color: var(--gb-dark); }
  .word-correct { color: var(--gb-darkest); }
  .word-wrong   { color: var(--gb-darkest); text-decoration: underline; text-decoration-style: wavy; }
  .char-correct { color: var(--gb-darkest); }
  .char-wrong   { color: #1a1a1a; text-shadow: 1px 1px 0 rgba(255,0,0,0.3); background: rgba(0,0,0,0.18); }
  .char-pending { color: var(--gb-dark); }
  .char-extra   { color: rgba(15,56,15,0.45); }

  .gb-caret {
    display: inline-block; width: 0.6em; height: 3px;
    animation: gb-blink 0.5s steps(1) infinite;
    vertical-align: baseline; position: relative; bottom: -2px; margin-right: 1px;
  }
  @keyframes gb-blink { 0%,49%{background:var(--gb-darkest);} 50%,100%{background:var(--gb-mid);} }

  .blur-focus { filter: blur(2px); }
  .focus-overlay {
    position: absolute; inset: 0; z-index: 10;
    display: flex; align-items: center; justify-content: center;
    background: rgba(139,172,15,0.6); backdrop-filter: blur(2px);
  }
  .focus-msg {
    font-size: 8px; color: var(--gb-darkest);
    border: 3px solid var(--gb-darkest); padding: 12px 20px;
    background: var(--gb-light); box-shadow: 4px 4px 0 var(--gb-darkest);
    animation: gb-pulse 1s steps(1) infinite;
  }
  @keyframes gb-pulse { 0%,49%{opacity:1} 50%,100%{opacity:0.6} }

  .stat-big   { font-size: clamp(28px,6vw,48px); color: var(--gb-darkest); text-shadow: 3px 3px 0 var(--gb-dark); line-height: 1; }
  .stat-label { font-size: 8px; color: var(--gb-dark); letter-spacing: 2px; margin-bottom: 6px; }

  /* ── chart ── */
  .chart-area { width: 100%; }
  .chart-bars  {
    display: flex; align-items: flex-end; gap: 2px;
    height: 90px; width: 100%; overflow: hidden;
  }
  .cbar-wrap { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: stretch; height: 90px; gap: 1px; min-width: 0; }
  .cbar { width: 100%; min-height: 2px; }
  .cbar-c { background: var(--gb-darkest); border: 1px solid rgba(0,0,0,0.4); }
  .cbar-w { background: rgba(48,98,48,0.5); border: 1px solid rgba(0,0,0,0.2); }
  .chart-xlabels { display: flex; gap: 2px; margin-top: 3px; }
  .chart-xlabels span { flex: 1; font-size: 5px; color: var(--gb-dark); text-align: center; min-width: 0; }
  .chart-legend { display: flex; gap: 14px; font-size: 7px; color: var(--gb-dark); margin-top: 6px; align-items: center; }
  .cleg { display: flex; align-items: center; gap: 5px; }
  .cleg-dot { display: inline-block; width: 10px; height: 10px; border: 1px solid rgba(0,0,0,0.4); }
  .cleg-c .cleg-dot { background: var(--gb-darkest); }
  .cleg-w .cleg-dot { background: rgba(48,98,48,0.5); border-color: rgba(0,0,0,0.2); }

  .gb-footer kbd {
    background: var(--gb-dark); color: #c4d486;
    border: 2px solid var(--gb-darkest); box-shadow: 2px 2px 0 var(--gb-darkest);
    padding: 2px 6px; font-size: 7px;
  }
`;

/* ═══════════════════════════ DATA ═══════════════════════════ */
const FAIRY_TALE_TEXT: Record<string,string> = {
  en: `Once upon a time in a land far away there lived a young girl named Elara who had hair as dark as midnight and eyes like two bright stars she spent her days wandering through the ancient forest collecting fallen leaves and whispering secrets to the old oak trees one morning she discovered a tiny door carved into the roots of the oldest tree in the wood pushing it open she found a golden staircase spiraling down into the earth at the bottom waited a small fox with a silver tail who bowed and said welcome dear traveler we have waited long for you to arrive the fox led her through glowing tunnels past rivers of amber and bridges made of moonbeam she saw castles built from crystal and gardens where flowers sang soft lullabies in the evening breeze the girl was not afraid because the forest had always been her friend and magic felt as natural as breathing when she finally returned home the sunrise painted the sky in shades of rose and honey and she carried in her heart a warmth that no winter could ever touch`,
  th: `กาลครั้งหนึ่งนานมาแล้ว ในดินแดนที่ห่างไกล มีเด็กหญิงคนหนึ่งชื่อ เอลารา เธอมีผมดำสลวยดั่งราตรีและดวงตาสว่างดั่งดาว เธอใช้เวลาทุกวันเดินเล่นในป่าโบราณ เก็บใบไม้ที่ร่วงหล่นและกระซิบความลับกับต้นโอ๊กเก่าแก่ เช้าวันหนึ่งเธอพบประตูเล็กๆ แกะสลักอยู่ที่รากของต้นไม้ที่เก่าแก่ที่สุด เมื่อเปิดออกพบบันไดทองคำวกวนลงสู่พื้นดิน ที่ปลายบันไดมีสุนัขจิ้งจอกตัวเล็กหางเงินรอคอยอยู่ มันก้มหัวและพูดว่า ยินดีต้อนรับนักเดินทาง เราได้รอคอยคุณมานานแล้ว สุนัขจิ้งจอกนำเธอผ่านอุโมงค์เรืองแสง แม่น้ำอำพัน และสะพานที่สร้างจากแสงจันทร์ เธอเห็นปราสาทสร้างจากคริสตัลและสวนที่ดอกไม้ร้องเพลงกล่อมในสายลมยามเย็น เด็กหญิงไม่กลัวเลย เพราะป่าคือเพื่อนเก่าของเธอ และเวทมนตร์รู้สึกเป็นธรรมชาติดั่งการหายใจ`,
};
const SAMPLE_WORDS: Record<string,string[]> = {
  en: ["the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just"],
  th: ["และ","ที่","เป็น","ใน","การ","มี","ได้","ให้","ไป","ของ","จะ","ไม่","กับ","มา","ความ","ก็","ด้วย","นี้","ว่า","จาก","ผู้","หรือ","อย่าง","คือ","แล้ว","อาจ","ต้อง","คน","ซึ่ง","เรา","ท่าน","เพื่อ","นั้น","มาก","หนึ่ง","ส่วน","ขึ้น","เขา"],
};
const WORDS_PER_PAGE = 30;
const HISTORY_ROUTE  = '/history';

/* ═══════════════════════════ TYPES ═══════════════════════════ */
interface KeystrokeStats { correct: number; wrong: number; }
interface WordEvent       { word: string; correct: boolean; sec: number; }
interface Stats {
  wpm: number; keystrokes: KeystrokeStats;
  correctWordsCount: number; wrongWordsCount: number;
  wordEvents: WordEvent[];
}
interface HistoryRecord {
  wpm: number; acc: number; timeLimit: number;
  language: string; difficulty: string;
  keystrokes: KeystrokeStats;
  correctWordsCount: number; wrongWordsCount: number;
  wordEvents: WordEvent[];
  date: string;
}
interface SavedSettings { language: string; difficulty: string; timeLimit: number; }

/* ═══════════════════════════ HELPERS ═══════════════════════════ */
function getFairyTaleWords(lang: string): string[] {
  const base = (FAIRY_TALE_TEXT[lang] ?? FAIRY_TALE_TEXT['en']).trim().split(/\s+/);
  const arr: string[] = [];
  while (arr.length < 300) arr.push(...base);
  return arr.slice(0, 300);
}
function saveResult(r: Omit<HistoryRecord,'date'>): void {
  try {
    const existing = JSON.parse(localStorage.getItem('pixeltype_history') ?? '[]') as HistoryRecord[];
    existing.unshift({ ...r, date: new Date().toISOString() });
    localStorage.setItem('pixeltype_history', JSON.stringify(existing.slice(0, 50)));
  } catch { /* ignore */ }
}
const SETTINGS_KEY = 'pixeltype_settings';
function loadSettings(): SavedSettings {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<SavedSettings>;
    return {
      language:   ['en','th'].includes(s.language ?? '')       ? s.language!   : 'en',
      difficulty: ['normal','hard'].includes(s.difficulty ?? '') ? s.difficulty! : 'normal',
      timeLimit:  [30,60,120].includes(s.timeLimit ?? 0)       ? s.timeLimit!  : 60,
    };
  } catch { return { language:'en', difficulty:'normal', timeLimit:60 }; }
}
function persistSettings(s: SavedSettings): void {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

/* ═══════════════════════════ CONFETTI ═══════════════════════════ */
interface Particle { id:number; x:number; y:number; vx:number; vy:number; rot:number; vrot:number; color:string; w:number; h:number; }
function Confetti({ active }: { active: boolean }) {
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
        .map(p => ({ ...p, x: p.x+p.vx, y: p.y+p.vy, vy: p.vy+0.12, rot: p.rot+p.vrot }))
        .filter(p => p.y < 120)
      );
      if (frame < 120) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  if (!particles.length) return null;
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:50 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position:'absolute',
          left:`${p.x}%`, top:`${p.y}%`,
          width:`${p.w}px`, height:`${p.h}px`,
          background: p.color,
          transform:`rotate(${p.rot}deg)`,
          opacity: 0.9,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════ WPM PROGRESS BAR ═══════════════════════════ */
const WPM_FLAGS = [20, 40, 60, 80, 90, 100];
const MAX_WPM   = 110;

function WpmProgressBar({ wpm }: { wpm: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    setDisplayed(0);
    let start: number | null = null;
    const duration = 2500;
    const target   = Math.min(wpm, MAX_WPM);
    const animate  = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 5);
      setDisplayed(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(animate);
      else setDisplayed(target);
    };
    requestAnimationFrame(animate);
  }, [wpm]);

  const fillPct = Math.min((displayed / MAX_WPM) * 100, 100);

  return (
    <div style={{ width:'100%' }}>
      <div style={{ fontSize:'7px', color:'var(--gb-dark)', letterSpacing:'2px', marginBottom:'10px' }}>
        WPM DISTANCE
      </div>
      <div style={{ position:'relative', width:'100%', height:'22px',
        background:'rgba(15,56,15,0.35)', border:'3px solid var(--gb-dark)',
        boxShadow:'inset 0 2px 0 rgba(0,0,0,0.25)', overflow:'visible' }}>
        <div style={{
          position:'absolute', top:0, left:0, bottom:0,
          width:`${fillPct}%`,
          background:'var(--gb-darkest)',
          boxShadow:'2px 0 0 var(--gb-dark)',
        }} />
        <div style={{
          position:'absolute', top:'3px', left:0, right:0, height:'3px',
          background:'rgba(255,255,255,0.07)', pointerEvents:'none',
        }} />
        {WPM_FLAGS.map(flag => {
          const pos = (flag / MAX_WPM) * 100;
          const passed = displayed >= flag;
          return (
            <div key={flag} style={{
              position:'absolute', left:`${pos}%`, top:'-2px',
              transform:'translateX(-50%)',
              display:'flex', flexDirection:'column', alignItems:'center',
              zIndex: 3,
            }}>
              <div style={{ width:'2px', height:'28px', background: passed ? 'var(--gb-mid)' : 'var(--gb-dark)' }} />
              <div style={{
                position:'absolute', top:0, left:'2px',
                width:'14px', height:'9px',
                background: passed ? 'var(--gb-mid)' : 'var(--gb-dark)',
                border: `1px solid ${passed ? 'var(--gb-darkest)' : 'rgba(15,56,15,0.5)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{ fontSize:'4px', color: passed ? 'var(--gb-darkest)' : 'rgba(15,56,15,0.6)', lineHeight:1 }}>
                  {flag}
                </span>
              </div>
            </div>
          );
        })}
        {fillPct > 0 && (
          <div style={{
            position:'absolute', top:'50%', left:`${fillPct}%`,
            width:'12px', height:'12px', borderRadius:'50%',
            background:'var(--gb-mid)', border:'3px solid var(--gb-darkest)',
            boxShadow:'0 0 0 2px var(--gb-dark)',
            transform:'translate(-50%,-50%)',
            zIndex:4,
          }} />
        )}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:'6px', fontSize:'6px', color:'var(--gb-dark)' }}>
        <span>0</span>
        <span style={{ color:'var(--gb-darkest)', fontSize:'7px' }}>{wpm} WPM</span>
        <span>{MAX_WPM}+</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════ CHART ═══════════════════════════ */
function buildChartData(wordEvents: WordEvent[], timeLimit: number) {
  const wBySecond: number[] = Array(timeLimit).fill(0);
  wordEvents.forEach(ev => {
    if (ev.correct) {
      const idx = Math.max(0, Math.min(ev.sec, timeLimit - 1));
      wBySecond[idx]++;
    }
  });
  let cumWords = 0;
  const wpmPts: number[] = wBySecond.map((w, i) => {
    cumWords += w;
    return Math.round(cumWords / ((i + 1) / 60));
  });
  const maxWpm = Math.max(1, ...wpmPts);
  const pts = wpmPts.map((v, i) => ({
    x: ((i + 0.5) / timeLimit) * 100,
    y: ((maxWpm - v) / maxWpm) * 100,
    wpm: v,
    sec: i + 1,
  }));
  function smoothPath(ps: {x:number;y:number}[]): string {
    if (ps.length < 2) return `M${ps[0].x},${ps[0].y}`;
    let d = `M${ps[0].x},${ps[0].y}`;
    for (let i = 1; i < ps.length; i++) {
      const cpx = (ps[i-1].x + ps[i].x) / 2;
      d += ` C${cpx},${ps[i-1].y} ${cpx},${ps[i].y} ${ps[i].x},${ps[i].y}`;
    }
    return d;
  }
  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L${pts[pts.length-1].x},100 L${pts[0].x},100 Z`;
  return { pts, wpmPts, maxWpm, linePath, areaPath };
}

function ResultChart({ wordEvents, timeLimit }: { wordEvents: WordEvent[]; timeLimit: number }) {
  const [tooltip, setTooltip] = useState<{x:number;y:number;wpm:number;sec:number} | null>(null);
  if (!wordEvents.length) return null;

  const { pts, wpmPts, maxWpm, linePath, areaPath } = buildChartData(wordEvents, timeLimit);
  const CHART_H = 90;
  const step = timeLimit <= 30 ? 5 : timeLimit <= 60 ? 10 : 20;
  const yTicks = [1, 0.75, 0.5, 0.25, 0].map(t => Math.round(maxWpm * t));

  return (
    <div>
      <div style={{ fontSize:'7px', color:'var(--gb-dark)', letterSpacing:'2px', marginBottom:'8px' }}>
        WPM OVER TIME
      </div>
      <div style={{ position:'relative', width:'100%', height:`${CHART_H}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ display:'block', overflow:'visible', position:'absolute', inset:0 }}>
          {[0.25, 0.5, 0.75].map((t, i) => (
            <line key={i} x1="0" y1={t*100} x2="100" y2={t*100}
              stroke="var(--gb-dark)" strokeWidth="0.4" strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke" />
          ))}
          <path d={areaPath} fill="rgba(15,56,15,0.25)" stroke="none" />
          <path d={linePath} fill="none" stroke="var(--gb-darkest)"
            strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {pts.map((p, i) => (
          <div key={i}
            onMouseEnter={() => setTooltip({ x: p.x, y: p.y, wpm: p.wpm, sec: p.sec })}
            onMouseLeave={() => setTooltip(null)}
            style={{
              position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
              width:10, height:10, borderRadius:'50%',
              background:'var(--gb-darkest)', border:'none',
              transform:'translate(-50%, calc(-100% - 3px))', cursor:'crosshair', zIndex:2,
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
        <div style={{ position:'absolute', top:0, left:0, height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', pointerEvents:'none' }}>
          {yTicks.map((v, i) => (
            <span key={i} style={{ fontSize:'5px', color:'var(--gb-dark)', lineHeight:1 }}>{v}</span>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', marginTop:'4px' }}>
        {wpmPts.map((_,i) => (
          <span key={i} style={{ flex:1, fontSize:'5px', color:'var(--gb-dark)', textAlign:'center' }}>
            {(i+1) % step === 0 ? i+1 : ''}
          </span>
        ))}
      </div>
      <div style={{ display:'flex', gap:'16px', marginTop:'6px', fontSize:'7px', color:'var(--gb-dark)' }}>
        <span>PEAK <span style={{ color:'var(--gb-darkest)' }}>{Math.max(...wpmPts)}</span></span>
        <span>AVG <span style={{ color:'var(--gb-darkest)' }}>{Math.round(wpmPts.reduce((a,b)=>a+b,0)/wpmPts.length)}</span></span>
      </div>
    </div>
  );
}

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
export default function GameboyTyping() {
  const router = useRouter();

  /* ── FIX: start with SSR-safe defaults, load from localStorage after mount ── */
  const [language,       setLangState]    = useState<string>('en');
  const [difficulty,     setDiffState]    = useState<string>('normal');
  const [timeLimit,      setTimeLimState] = useState<number>(60);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const s = loadSettings();
    setLangState(s.language);
    setDiffState(s.difficulty);
    setTimeLimState(s.timeLimit);
    setSettingsLoaded(true);
  }, []);

  /* wrappers that also persist */
  const setLanguage = useCallback((v: string) => {
    setLangState(v);
    persistSettings({ language: v, difficulty, timeLimit });
  }, [difficulty, timeLimit]);
  const setDifficulty = useCallback((v: string) => {
    setDiffState(v);
    persistSettings({ language, difficulty: v, timeLimit });
  }, [language, timeLimit]);
  const setTimeLimit = useCallback((v: number) => {
    setTimeLimState(v);
    persistSettings({ language, difficulty, timeLimit: v });
  }, [language, difficulty]);

  const [words,            setWords]            = useState<string[]>([]);
  const [userInput,        setUserInput]        = useState<string>('');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [correctWords,     setCorrectWords]     = useState<boolean[]>([]);
  const [timeLeft,         setTimeLeft]         = useState<number>(60);
  const [isActive,         setIsActive]         = useState<boolean>(false);
  const [isFinished,       setIsFinished]       = useState<boolean>(false);
  const [isFocused,        setIsFocused]        = useState<boolean>(true);
  const [isNewRecord,      setIsNewRecord]      = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    wpm:0, keystrokes:{correct:0,wrong:0}, correctWordsCount:0, wrongWordsCount:0, wordEvents:[],
  });
  const inputRef       = useRef<HTMLInputElement>(null);
  const elapsedRef     = useRef<number>(0);
  const savedRef2      = useRef<boolean>(false);
  const statsRef       = useRef<Stats>({ wpm:0, keystrokes:{correct:0,wrong:0}, correctWordsCount:0, wrongWordsCount:0, wordEvents:[] });

  const currentPage    = Math.floor(currentWordIndex / WORDS_PER_PAGE);
  const displayedWords = words.slice(currentPage * WORDS_PER_PAGE, (currentPage+1) * WORDS_PER_PAGE);

  const generateWords = useCallback((lang=language, diff=difficulty, time=timeLimit) => {
    const newWords = diff === 'hard'
      ? getFairyTaleWords(lang)
      : Array.from({length:300}, () => {
          const src = SAMPLE_WORDS[lang] ?? SAMPLE_WORDS['en'];
          return src[Math.floor(Math.random()*src.length)];
        });
    setWords(newWords);
    setUserInput('');
    setCurrentWordIndex(0);
    setCorrectWords([]);
    setTimeLeft(time);
    setIsActive(false);
    setIsFinished(false);
    setIsNewRecord(false);
    elapsedRef.current = 0;
    savedRef2.current  = false;
    const emptyStats = { wpm:0, keystrokes:{correct:0,wrong:0}, correctWordsCount:0, wrongWordsCount:0, wordEvents:[] };
    statsRef.current = emptyStats;
    setStats(emptyStats);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [language, difficulty, timeLimit]);

  /* ── FIX: only generate words after settings are loaded from localStorage ── */
  useEffect(() => {
    if (settingsLoaded) generateWords();
  }, [generateWords, settingsLoaded]);

  useEffect(() => {
    let iv: ReturnType<typeof setInterval> | undefined;
    if (isActive && timeLeft > 0) {
      iv = setInterval(() => {
        setTimeLeft(p => p - 1);
        elapsedRef.current += 1;
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      // Guard with ref — runs synchronously, never duplicates even in Strict Mode
      if (!savedRef2.current) {
        savedRef2.current = true;
        const prev = statsRef.current;
        const wpm = Math.round((prev.keystrokes.correct / 5) / (timeLimit / 60));
        const acc = Math.round((prev.correctWordsCount / (prev.correctWordsCount + prev.wrongWordsCount || 1)) * 100);
        setStats(s => ({ ...s, wpm }));
        try {
          const existing = JSON.parse(localStorage.getItem('pixeltype_history') ?? '[]') as HistoryRecord[];
          const prevBest = existing.length ? Math.max(...existing.map(r => r.wpm)) : 0;
          if (wpm > prevBest) setIsNewRecord(true);
        } catch { /* ignore */ }
        saveResult({ wpm, acc, timeLimit, language, difficulty, keystrokes: prev.keystrokes, correctWordsCount: prev.correctWordsCount, wrongWordsCount: prev.wrongWordsCount, wordEvents: prev.wordEvents });
      }
    }
    return () => { if (iv) clearInterval(iv); };
  }, [isActive, timeLeft, timeLimit, language, difficulty]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isFinished) return;
    if (!isActive && value.length > 0) {
      setIsActive(true);
      elapsedRef.current = 0;
    }
    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      if (!typedWord) return;
      const isCorrect = typedWord === words[currentWordIndex];
      const sec = elapsedRef.current;
      setCorrectWords(prev => [...prev, isCorrect]);
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      setStats(prev => {
        const next = {
          ...prev,
          correctWordsCount: isCorrect ? prev.correctWordsCount+1 : prev.correctWordsCount,
          wrongWordsCount:   !isCorrect ? prev.wrongWordsCount+1 : prev.wrongWordsCount,
          keystrokes: {
            correct: prev.keystrokes.correct + (isCorrect ? typedWord.length+1 : 0),
            wrong:   prev.keystrokes.wrong   + (!isCorrect ? typedWord.length+1 : 0),
          },
          wordEvents: [...prev.wordEvents, { word:typedWord, correct:isCorrect, sec }],
        };
        statsRef.current = next;
        return next;
      });
    } else {
      setUserInput(value);
    }
  };

  const acc = Math.round((stats.correctWordsCount / (stats.correctWordsCount + stats.wrongWordsCount || 1)) * 100);

  return (
    <>
      <style>{style}</style>
      <div className="gb-bg">

        {/* HEADER */}
        <header style={{ width:'100%', maxWidth:'1100px', display:'flex', alignItems:'center', marginBottom:'16px' }}>
          <div className="gb-logo">PIXELTYPE <span>v1.0</span></div>
        </header>

        <main style={{ width:'100%', maxWidth:'1100px', display:'flex', flexDirection:'column', gap:'12px' }}>

          {/* SETTINGS BAR */}
          {!isFinished && (
            <div style={{ opacity:isActive?0:1, pointerEvents:isActive?'none':'auto', transition:'opacity 0.25s' }}>
              <div className="settings-bar">
                <span className="section-lbl">LANG</span>
                {['en','th'].map(l => (
                  <button key={l} className={`pixel-btn${language===l?' active':''}`} onClick={() => setLanguage(l)}>{l}</button>
                ))}
                <div className="settings-sep" />
                <span className="section-lbl">MODE</span>
                {['normal','hard'].map(d => (
                  <button key={d} className={`pixel-btn${difficulty===d?' active':''}`} onClick={() => setDifficulty(d)}>{d}</button>
                ))}
                <div className="settings-sep" />
                <span className="section-lbl">TIME</span>
                {[30,60,120].map(t => (
                  <button key={t} className={`pixel-btn${timeLimit===t?' active':''}`} onClick={() => setTimeLimit(t)}>{t}s</button>
                ))}
                <div style={{ marginLeft:'auto' }}>
                  <button className="pixel-btn" style={{ textTransform:'uppercase', letterSpacing:'1px' }}
                    onClick={() => router.push(HISTORY_ROUTE)}>
                    HISTORY
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TYPING SCREEN */}
          {!isFinished ? (
            <div className="gb-screen screen-texture"
              style={{ padding:'clamp(16px,3vw,36px)', position:'relative', cursor:'default' }}
              onClick={() => { inputRef.current?.focus(); setIsFocused(true); }}>

              <div className="gb-timer" style={{ marginBottom:'12px', opacity:isActive?1:0.4, transition:'opacity 0.3s' }}>
                {String(timeLeft).padStart(2,'0')}
              </div>
              <div className="pixel-divider" />

              <input ref={inputRef} type="text" spellCheck={false} autoComplete="off"
                value={userInput} onChange={handleInputChange}
                onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)}
                style={{ position:'absolute', opacity:0, width:1, height:1, pointerEvents:'none' }} autoFocus />

              {!isFocused && (
                <div className="focus-overlay"><div className="focus-msg">CLICK TO FOCUS</div></div>
              )}

              <div className={`words-box${isFocused?'':' blur-focus'}`}>
                {displayedWords.map((word, index) => {
                  const ai = currentPage * WORDS_PER_PAGE + index;
                  if (ai < currentWordIndex)
                    return <div key={ai} className={correctWords[ai] ? 'word-correct' : 'word-wrong'}>{word}</div>;
                  if (ai === currentWordIndex) {
                    const chars=word.split(''), typedChars=userInput.split('');
                    const maxLen=Math.max(chars.length,typedChars.length);
                    return (
                      <div key={ai} style={{ display:'inline-flex', alignItems:'center', background:'rgba(15,56,15,0.2)', padding:'0 4px', borderBottom:'3px solid #306230', whiteSpace:'nowrap' }}>
                        {typedChars.length===0 && isFocused && <span className="gb-caret" />}
                        {Array.from({length:maxLen}).map((_,ci) => {
                          const char=chars[ci]??'', typed=typedChars[ci];
                          let cls='char-pending', display=char;
                          if (typed!==undefined) {
                            if (!char)         { display=typed; cls='char-extra'; }
                            else if (typed===char) cls='char-correct';
                            else               cls='char-wrong';
                          }
                          return (
                            <span key={ci} style={{ position:'relative' }}>
                              {ci===typedChars.length && ci>0 && isFocused && <span className="gb-caret" />}
                              <span className={cls}>{display}</span>
                            </span>
                          );
                        })}
                        {typedChars.length>=maxLen && typedChars.length>0 && isFocused && <span className="gb-caret" />}
                      </div>
                    );
                  }
                  return <div key={ai} className="word-idle">{word}</div>;
                })}
              </div>

              <div className="pixel-divider" />
              <div style={{ display:'flex', justifyContent:'center' }}>
                <button className="pixel-btn" onClick={e => { e.stopPropagation(); generateWords(); }} style={{ fontSize:'8px' }}>
                  RESTART
                </button>
              </div>
            </div>

          ) : (
            /* RESULTS SCREEN */
            <div className="gb-screen screen-texture" style={{ padding:'clamp(16px,3vw,36px)', position:'relative', overflow:'hidden' }}>

              <Confetti active={isNewRecord} />

              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'4px' }}>
                <div style={{ fontSize:'9px', color:'var(--gb-dark)', letterSpacing:'4px' }}>RESULTS</div>
                {isNewRecord && (
                  <div style={{
                    fontSize:'6px', color:'var(--gb-darkest)', background:'var(--gb-mid)',
                    border:'2px solid var(--gb-darkest)', padding:'2px 8px',
                    letterSpacing:'1px', animation:'gb-pulse 0.6s steps(1) infinite',
                  }}>NEW RECORD!</div>
                )}
              </div>
              <div className="pixel-divider" />

              <div style={{ display:'flex', gap:'clamp(20px,5vw,48px)', flexWrap:'wrap', marginBottom:'12px' }}>
                <div><div className="stat-label">WPM</div><div className="stat-big">{stats.wpm}</div></div>
                <div><div className="stat-label">ACC</div><div className="stat-big">{acc}%</div></div>
                <div><div className="stat-label">CORRECT</div><div className="stat-big" style={{ fontSize:'clamp(18px,3vw,28px)' }}>{stats.correctWordsCount}</div></div>
                <div><div className="stat-label">WRONG</div><div className="stat-big" style={{ fontSize:'clamp(18px,3vw,28px)', color:'rgba(15,56,15,0.5)' }}>{stats.wrongWordsCount}</div></div>
              </div>

              <div className="pixel-divider" />
              <WpmProgressBar wpm={stats.wpm} />
              <div className="pixel-divider" />
              <ResultChart wordEvents={stats.wordEvents} timeLimit={timeLimit} />
              <div className="pixel-divider" />

              <div style={{ fontSize:'8px', display:'flex', flexDirection:'column', gap:'8px', color:'var(--gb-dark)', marginBottom:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>TEST</span><span style={{ color:'var(--gb-darkest)' }}>{timeLimit}s / {language} / {difficulty}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span>KEYSTROKES</span><span style={{ color:'var(--gb-darkest)' }}>{stats.keystrokes.correct} ok / {stats.keystrokes.wrong} err</span>
                </div>
              </div>

              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                <button className="pixel-btn" onClick={() => generateWords()}
                  style={{ fontSize:'8px', padding:'8px 18px', textTransform:'uppercase', letterSpacing:'1px' }}>
                  PLAY AGAIN
                </button>
                <button className="pixel-btn" onClick={() => router.push(HISTORY_ROUTE)}
                  style={{ fontSize:'8px', padding:'8px 18px', textTransform:'uppercase', letterSpacing:'1px' }}>
                  VIEW HISTORY
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="gb-footer" style={{ marginTop:'20px', fontSize:'7px', color:'var(--gb-dark)', display:'flex', gap:'12px', opacity:0.7, flexWrap:'wrap' }}>
          <span><kbd>SPACE</kbd> submit word</span>
          <span>|</span>
          <span><kbd>TAB</kbd>+<kbd>ENTER</kbd> restart</span>
        </footer>
      </div>
    </>
  );
}