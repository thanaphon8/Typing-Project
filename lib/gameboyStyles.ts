export const gameboyStyles = `
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
    height: 320px; flex-shrink: 0; align-content: flex-start;
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

  /* ── language warning toast ── */
  .lang-warn-toast {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    z-index: 1000; display: flex; align-items: center; gap: 10px;
    background: var(--gb-darkest); color: var(--gb-mid);
    border: 3px solid var(--gb-mid);
    box-shadow: 4px 4px 0 var(--gb-dark), 0 0 0 1px var(--gb-darkest);
    padding: 10px 18px; font-size: 8px; letter-spacing: 1px;
    white-space: nowrap; pointer-events: none;
    animation: toast-in 0.15s steps(2) forwards;
  }
  .lang-warn-icon { font-size: 14px; line-height: 1; }
  .lang-warn-bar {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    z-index: 999; height: 3px; background: var(--gb-mid);
    animation: toast-bar 3s linear forwards;
    pointer-events: none;
  }
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes toast-bar {
    from { width: 260px; }
    to   { width: 0px; }
  }
  @keyframes toast-out {
    from { opacity: 1; } to { opacity: 0; }
  }

  /* ── fullscreen button icon ── */
  .fs-icon {
    display: inline-block;
    font-style: normal;
    line-height: 1;
  }
`;
