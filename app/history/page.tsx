"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { buildChartData, buildWpmPoints, WordEvent } from '../../lib/chartUtils';

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  * { font-family: 'Press Start 2P', monospace; }

  :root {
    --gb-darkest: #0f380f; --gb-dark: #306230;
    --gb-mid: #8bac0f;     --gb-light: #9bbc0f;
    --gb-screen: #8bac0f;
  }

  html, body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }

  .gb-bg {
    background: var(--gb-darkest); min-height: 100vh; width: 100%;
    display: flex; flex-direction: column; align-items: center;
    padding: 20px 16px 40px;
  }
  .gb-bg::before {
    content: ''; position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px);
    pointer-events: none; z-index: 9999;
  }

  .pixel-btn {
    border: 3px solid var(--gb-dark); box-shadow: 3px 3px 0 var(--gb-darkest);
    cursor: pointer; background: var(--gb-mid); color: var(--gb-darkest);
    padding: 6px 14px; font-size: 8px; transition: all 0.08s; white-space: nowrap;
  }
  .pixel-btn:hover { box-shadow: 1px 1px 0 var(--gb-darkest); transform: translate(2px,2px); }
  .pixel-btn.sel { background: var(--gb-light); box-shadow: inset 2px 2px 0 var(--gb-darkest); transform: translate(2px,2px); }

  /* FIX 4: replaced confirm() danger button with inline confirm pattern */
  .pixel-btn-danger {
    border: 3px solid #4a1010; box-shadow: 3px 3px 0 var(--gb-darkest);
    cursor: pointer; background: #2a0a0a; color: #ff6b6b;
    padding: 6px 14px; font-size: 7px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.08s;
  }
  .pixel-btn-danger:hover { box-shadow: 1px 1px 0 var(--gb-darkest); transform: translate(2px,2px); }

  .pixel-btn-confirm {
    border: 3px solid #ff6b6b; box-shadow: 3px 3px 0 var(--gb-darkest);
    cursor: pointer; background: #5a0000; color: #ff6b6b;
    padding: 6px 14px; font-size: 7px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.08s;
    animation: confirm-pulse 0.5s steps(1) infinite;
  }
  .pixel-btn-confirm:hover { box-shadow: 1px 1px 0 var(--gb-darkest); transform: translate(2px,2px); }

  @keyframes confirm-pulse { 0%,49%{opacity:1} 50%,100%{opacity:0.7} }

  .pixel-btn-cancel {
    border: 3px solid var(--gb-dark); box-shadow: 3px 3px 0 var(--gb-darkest);
    cursor: pointer; background: rgba(15,56,15,0.4); color: var(--gb-mid);
    padding: 6px 14px; font-size: 7px; text-transform: uppercase; letter-spacing: 1px; transition: all 0.08s;
  }
  .pixel-btn-cancel:hover { box-shadow: 1px 1px 0 var(--gb-darkest); transform: translate(2px,2px); }

  .gb-screen {
    background: var(--gb-screen); border: 6px solid var(--gb-dark);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.28), 0 0 0 4px var(--gb-darkest), 0 0 0 8px var(--gb-dark);
    width: 100%;
  }
  .screen-texture { background-image: radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 8px 8px; }

  .gb-logo { font-size: clamp(12px,3vw,18px); color: var(--gb-mid); text-shadow: 2px 2px 0 var(--gb-darkest), 3px 3px 0 var(--gb-dark); letter-spacing: 3px; }
  .gb-logo span { font-size: 9px; color: var(--gb-dark); text-shadow: none; }

  .pixel-divider {
    width: 100%; height: 4px;
    background: repeating-linear-gradient(90deg, var(--gb-dark) 0, var(--gb-dark) 8px, transparent 8px, transparent 16px);
    margin: 12px 0;
  }

  /* ── summary cards ── */
  .summary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; width: 100%; }
  .summary-card { background: var(--gb-screen); border: 6px solid var(--gb-dark); box-shadow: inset 0 0 12px rgba(0,0,0,0.2), 0 0 0 3px var(--gb-darkest); padding: 16px 12px; text-align: center; }
  .stat-val { font-size: clamp(20px,4vw,28px); color: var(--gb-darkest); text-shadow: 2px 2px 0 var(--gb-dark); line-height: 1; }
  .stat-lbl { font-size: 7px; color: var(--gb-dark); letter-spacing: 1px; margin-top: 6px; }

  /* ── table ── */
  .tbl-head { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; gap: 8px; padding: 10px 14px; font-size: 7px; color: var(--gb-dark); letter-spacing: 1px; border-bottom: 3px solid var(--gb-dark); background: rgba(15,56,15,0.2); }
  .tbl-row  { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; gap: 8px; padding: 11px 14px; border-bottom: 2px solid rgba(48,98,48,0.35); font-size: 8px; color: var(--gb-darkest); cursor: pointer; transition: background 0.1s; }
  .tbl-row:hover { background: rgba(15,56,15,0.18); }
  @media (max-width: 600px) {
    .tbl-head, .tbl-row { grid-template-columns: 2fr 1fr 1fr 1fr; font-size: 7px; padding: 8px 10px; }
    .tbl-head .col-lang, .tbl-row .col-lang,
    .tbl-head .col-mode, .tbl-row .col-mode { display: none; }
  }

  .badge { display: inline-block; padding: 2px 6px; font-size: 6px; border: 2px solid var(--gb-dark); }
  .badge-normal { background: rgba(48,98,48,0.3); color: var(--gb-darkest); }
  .badge-hard   { background: rgba(15,56,15,0.5); color: var(--gb-mid); border-color: var(--gb-mid); }

  .rank-gold   { color: #c8a000; text-shadow: 1px 1px 0 var(--gb-darkest); }
  .rank-silver { color: #888; }
  .rank-bronze { color: #8b5a00; }

  .empty-state { text-align: center; padding: 48px 20px; color: var(--gb-dark); font-size: 9px; line-height: 2.8; }

  /* ── detail panel ── */
  .detail-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(15,56,15,0.85); backdrop-filter: blur(3px);
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .detail-panel {
    width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto;
    background: var(--gb-screen); border: 6px solid var(--gb-dark);
    box-shadow: 0 0 0 4px var(--gb-darkest), 0 0 0 8px var(--gb-dark);
    padding: clamp(16px,3vw,28px);
    background-image: radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px);
    background-size: 8px 8px;
  }
  .detail-stat { display: flex; flex-direction: column; gap: 3px; }
  .detail-stat-val { font-size: clamp(22px,4vw,36px); color: var(--gb-darkest); text-shadow: 2px 2px 0 var(--gb-dark); line-height: 1; }
  .detail-stat-lbl { font-size: 7px; color: var(--gb-dark); letter-spacing: 1px; }

  .detail-row { display: flex; justify-content: space-between; font-size: 8px; color: var(--gb-dark); padding: 6px 0; border-bottom: 1px solid rgba(48,98,48,0.3); }
  .detail-row span:last-child { color: var(--gb-darkest); }

  @keyframes gb-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .fadein { animation: gb-fadein 0.25s ease forwards; }

  .controls-bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
`;

/* ── types ── */
interface HistoryRecord {
  wpm: number; acc: number; timeLimit: number;
  language: string; difficulty: string;
  keystrokes: { correct: number; wrong: number };
  correctWordsCount: number; wrongWordsCount: number;
  wordEvents?: WordEvent[];
  date: string;
}
type FilterType = 'all' | 'normal' | 'hard';
type SortType   = 'date' | 'wpm' | 'acc';

function formatDate(iso: string): string {
  const d   = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ── mini chart inside detail (uses shared buildChartData) ── */
function MiniChart({ wordEvents, timeLimit }: { wordEvents: WordEvent[]; timeLimit: number }) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; wpm: number; sec: number } | null>(null);
  if (!wordEvents.length) return <div style={{ fontSize: '7px', color: 'var(--gb-dark)', padding: '12px 0' }}>No chart data</div>;

  const { pts, wpmPts, maxWpm, linePath, areaPath } = buildChartData(wordEvents, timeLimit);
  const CHART_H = 80;
  const step    = timeLimit <= 30 ? 5 : timeLimit <= 60 ? 10 : 20;

  return (
    <div>
      <div style={{ fontSize: '7px', color: 'var(--gb-dark)', letterSpacing: '2px', marginBottom: '8px' }}>WPM OVER TIME</div>

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
            onMouseEnter={() => setTooltip(p)}
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
            position: 'absolute', left: `${tooltip.x}%`, top: `${tooltip.y}%`,
            transform: 'translate(-50%,-140%)',
            background: 'var(--gb-darkest)', color: 'var(--gb-mid)',
            fontSize: '7px', padding: '4px 8px',
            border: '2px solid var(--gb-mid)', whiteSpace: 'nowrap',
            pointerEvents: 'none', zIndex: 10,
            boxShadow: '2px 2px 0 var(--gb-dark)',
          }}>
            {tooltip.sec}s — {tooltip.wpm} wpm
          </div>
        )}

        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
          {[maxWpm, Math.round(maxWpm * 0.75), Math.round(maxWpm * 0.5), Math.round(maxWpm * 0.25), 0].map((v: number, i: number) => (
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

/* ── detail modal ── */
function DetailModal({ record, onClose }: { record: HistoryRecord; onClose: () => void }) {
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel fadein" onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ fontSize: '9px', color: 'var(--gb-dark)', letterSpacing: '3px' }}>RESULT DETAIL</div>
          <button className="pixel-btn" onClick={onClose} style={{ fontSize: '7px', padding: '4px 10px' }}>X CLOSE</button>
        </div>
        <div style={{ fontSize: '7px', color: 'var(--gb-dark)', marginBottom: '8px', opacity: 0.7 }}>{formatDate(record.date)}</div>

        <div className="pixel-divider" />

        <div style={{ display: 'flex', gap: 'clamp(12px,3vw,32px)', flexWrap: 'wrap', marginBottom: '12px' }}>
          {[
            { lbl: 'WPM',     val: record.wpm },
            { lbl: 'ACC',     val: `${record.acc}%` },
            { lbl: 'CORRECT', val: record.correctWordsCount },
            { lbl: 'WRONG',   val: record.wrongWordsCount },
          ].map(s => (
            <div key={s.lbl} className="detail-stat">
              <div className="detail-stat-lbl">{s.lbl}</div>
              <div className="detail-stat-val">{s.val}</div>
            </div>
          ))}
        </div>

        <div className="pixel-divider" />

        {record.wordEvents && record.wordEvents.length > 0
          ? <MiniChart wordEvents={record.wordEvents} timeLimit={record.timeLimit} />
          : <div style={{ fontSize: '7px', color: 'var(--gb-dark)', padding: '8px 0' }}>No chart data (old record)</div>
        }

        <div className="pixel-divider" />

        {[
          { lbl: 'TEST',       val: `${record.timeLimit}s / ${record.language} / ${record.difficulty}` },
          { lbl: 'KEYSTROKES', val: `${record.keystrokes.correct} correct  /  ${record.keystrokes.wrong} wrong` },
          { lbl: 'WORDS',      val: `${record.correctWordsCount} correct  /  ${record.wrongWordsCount} wrong` },
        ].map(r => (
          <div key={r.lbl} className="detail-row"><span>{r.lbl}</span><span>{r.val}</span></div>
        ))}

      </div>
    </div>
  );
}

/* ── main page ── */
export default function HistoryPage() {
  const router = useRouter();
  const [history,      setHistory]      = useState<HistoryRecord[]>([]);
  const [filter,       setFilter]       = useState<FilterType>('all');
  const [sortBy,       setSortBy]       = useState<SortType>('date');
  const [selected,     setSelected]     = useState<HistoryRecord | null>(null);
  /* FIX 4: inline confirm state — replaces window.confirm() which breaks on iOS PWA */
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pixeltype_history') ?? '[]') as HistoryRecord[];
      setHistory(stored);
    } catch { setHistory([]); }
  }, []);

  /* FIX 4: no more window.confirm() */
  const handleClearRequest = () => setConfirmClear(true);
  const handleClearConfirm = () => {
    localStorage.removeItem('pixeltype_history');
    setHistory([]);
    setConfirmClear(false);
  };
  const handleClearCancel = () => setConfirmClear(false);

  const filtered: HistoryRecord[] = history
    .filter(r => filter === 'all' || r.difficulty === filter)
    .sort((a, b) => {
      if (sortBy === 'wpm') return b.wpm - a.wpm;
      if (sortBy === 'acc') return b.acc - a.acc;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const bestWpm = history.length ? Math.max(...history.map(r => r.wpm)) : 0;
  const avgWpm  = history.length ? Math.round(history.reduce((s, r) => s + r.wpm, 0) / history.length) : 0;
  const bestAcc = history.length ? Math.max(...history.map(r => r.acc)) : 0;

  const filterOpts: { value: FilterType; label: string }[] = [
    { value: 'all',    label: 'all' },
    { value: 'normal', label: 'normal' },
    { value: 'hard',   label: 'hard' },
  ];
  const sortOpts: { value: SortType; label: string }[] = [
    { value: 'date', label: 'DATE' },
    { value: 'wpm',  label: 'WPM' },
    { value: 'acc',  label: 'ACC' },
  ];

  return (
    <>
      <style>{style}</style>

      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} />}

      <div className="gb-bg">
        <header style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="gb-logo">PIXELTYPE <span>v1.0</span></div>
          <button className="pixel-btn" onClick={() => router.push('/')}
            style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '7px' }}>
            BACK
          </button>
        </header>

        <main style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* summary */}
          {history.length > 0 && (
            <div className="summary-grid fadein">
              {[
                { lbl: 'BEST WPM', val: bestWpm },
                { lbl: 'AVG WPM',  val: avgWpm },
                { lbl: 'BEST ACC', val: `${bestAcc}%` },
                { lbl: 'GAMES',    val: history.length },
              ].map(c => (
                <div key={c.lbl} className="summary-card screen-texture">
                  <div className="stat-val">{c.val}</div>
                  <div className="stat-lbl">{c.lbl}</div>
                </div>
              ))}
            </div>
          )}

          {/* controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="controls-bar">
              <span style={{ fontSize: '7px', color: 'var(--gb-dark)', letterSpacing: '1px' }}>FILTER</span>
              {filterOpts.map(f => (
                <button key={f.value} className={`pixel-btn${filter === f.value ? ' sel' : ''}`} onClick={() => setFilter(f.value)}>{f.label}</button>
              ))}
              <div style={{ width: '2px', height: '20px', background: 'var(--gb-dark)' }} />
              <span style={{ fontSize: '7px', color: 'var(--gb-dark)', letterSpacing: '1px' }}>SORT</span>
              {sortOpts.map(s => (
                <button key={s.value} className={`pixel-btn${sortBy === s.value ? ' sel' : ''}`} onClick={() => setSortBy(s.value)}>{s.label}</button>
              ))}
            </div>

            {/* FIX 4: inline two-step confirm instead of window.confirm() */}
            {history.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {confirmClear ? (
                  <>
                    <span style={{ fontSize: '7px', color: '#ff6b6b', letterSpacing: '1px' }}>SURE?</span>
                    <button className="pixel-btn-confirm" onClick={handleClearConfirm}>YES</button>
                    <button className="pixel-btn-cancel"  onClick={handleClearCancel}>NO</button>
                  </>
                ) : (
                  <button className="pixel-btn-danger" onClick={handleClearRequest}>CLEAR ALL</button>
                )}
              </div>
            )}
          </div>

          {/* table */}
          <div className="gb-screen screen-texture fadein">
            <div style={{ fontSize: '9px', color: 'var(--gb-dark)', letterSpacing: '3px', padding: '14px 14px 0' }}>HISTORY</div>
            <div className="pixel-divider" style={{ margin: '10px 14px' }} />

            {filtered.length === 0 ? (
              <div className="empty-state">
                {history.length === 0
                  ? <><div>NO RECORDS YET</div><div style={{ fontSize: '7px', marginTop: '8px', opacity: 0.7 }}>complete a game to start tracking</div></>
                  : <div>NO RESULTS FOR THIS FILTER</div>
                }
              </div>
            ) : (
              <>
                <div className="tbl-head">
                  <span>DATE</span>
                  <span>WPM</span>
                  <span>ACC</span>
                  <span>TIME</span>
                  <span className="col-lang">LANG</span>
                  <span className="col-mode">MODE</span>
                </div>
                {filtered.map((r, i) => {
                  const rankCls = sortBy === 'wpm'
                    ? (i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : '')
                    : '';
                  return (
                    <div key={i} className="tbl-row fadein" style={{ animationDelay: `${i * 0.025}s` }}
                      onClick={() => setSelected(r)} title="Click to view details">
                      <span style={{ fontSize: '6px', opacity: 0.75 }}>{formatDate(r.date)}</span>
                      <span className={rankCls} style={{ fontWeight: 'bold' }}>{r.wpm}</span>
                      <span>{r.acc}%</span>
                      <span>{r.timeLimit}s</span>
                      <span className="col-lang" style={{ textTransform: 'uppercase' }}>{r.language}</span>
                      <span className="col-mode">
                        <span className={`badge badge-${r.difficulty}`}>{r.difficulty}</span>
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div style={{ fontSize: '7px', color: 'var(--gb-dark)', opacity: 0.6, textAlign: 'center' }}>
            CLICK ANY ROW TO VIEW DETAILS
          </div>
        </main>
      </div>
    </>
  );
}