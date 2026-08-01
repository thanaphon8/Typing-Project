"use client";

import { useRouter } from 'next/navigation';
import { gameboyStyles } from '../lib/gameboyStyles';
import { HISTORY_ROUTE, WORDS_PER_PAGE } from '../lib/constants';
import { useFullscreen } from '../hooks/useFullscreen';
import { useSettings } from '../hooks/useSettings';
import { useTypingTest } from '../hooks/useTypingTest';
import { Confetti } from '../components/Confetti';
import { WpmProgressBar } from '../components/WpmProgressBar';
import { ResultChart } from '../components/ResultChart';

export default function GameboyTyping() {
  const router = useRouter();

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const {
    language, difficulty, timeLimit, settingsLoaded, settingsRef,
    setLanguage, setDifficulty, setTimeLimit,
  } = useSettings();

  const {
    words, userInput, currentWordIndex, correctWords, timeLeft, isActive, isFinished,
    isFocused, setIsFocused, isNewRecord, stats, inputRef, langWarn,
    currentPage, displayedWords, generateWords,
    handleKeyDown, handleKeyUp, handleInputChange, acc,
  } = useTypingTest(settingsRef, settingsLoaded);

  /* FIX 2: settings buttons explicitly restart the game with the new values */
  const handleSetLanguage = (v: string) => {
    setLanguage(v);
    generateWords(v, settingsRef.current.difficulty, settingsRef.current.timeLimit);
  };
  const handleSetDifficulty = (v: string) => {
    setDifficulty(v);
    generateWords(settingsRef.current.language, v, settingsRef.current.timeLimit);
  };
  const handleSetTimeLimit = (v: number) => {
    setTimeLimit(v);
    generateWords(settingsRef.current.language, settingsRef.current.difficulty, v);
  };

  return (
    <>
      <style>{gameboyStyles}</style>
      <div className="gb-bg">

        {/* HEADER */}
        <header style={{ width: '100%', maxWidth: '1100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div className="gb-logo">PIXELTYPE <span>v1.0</span></div>
          <button
            className="pixel-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Fullscreen (F11)'}
            style={{ fontSize: '8px', padding: '6px 10px', letterSpacing: '1px', textTransform: 'uppercase' }}
          >
            {isFullscreen ? (
              // exit fullscreen icon: arrows pointing inward
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                <path d="M4 0V4H0M8 0V4H12M4 12V8H0M8 12V8H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"/>
              </svg>
            ) : (
              // enter fullscreen icon: arrows pointing outward
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                <path d="M0 4V0H4M12 4V0H8M0 8V12H4M12 8V12H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"/>
              </svg>
            )}
          </button>
        </header>

        <main style={{ width: '100%', maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* SETTINGS BAR */}
          {!isFinished && (
            <div style={{ opacity: isActive ? 0 : 1, pointerEvents: isActive ? 'none' : 'auto', transition: 'opacity 0.25s' }}>
              <div className="settings-bar">
                <span className="section-lbl">LANG</span>
                {['en', 'th'].map(l => (
                  <button key={l} className={`pixel-btn${language === l ? ' active' : ''}`}
                    onClick={() => handleSetLanguage(l)}>{l}</button>
                ))}
                <div className="settings-sep" />
                <span className="section-lbl">MODE</span>
                {['normal', 'hard'].map(d => (
                  <button key={d} className={`pixel-btn${difficulty === d ? ' active' : ''}`}
                    onClick={() => handleSetDifficulty(d)}>{d}</button>
                ))}
                <div className="settings-sep" />
                <span className="section-lbl">TIME</span>
                {[30, 60, 120].map(t => (
                  <button key={t} className={`pixel-btn${timeLimit === t ? ' active' : ''}`}
                    onClick={() => handleSetTimeLimit(t)}>{t}s</button>
                ))}
                <div style={{ marginLeft: 'auto' }}>
                  <button className="pixel-btn" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
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
              style={{ padding: 'clamp(16px,3vw,36px)', position: 'relative', cursor: 'default' }}
              onClick={() => { inputRef.current?.focus(); setIsFocused(true); }}>

              <div className="gb-timer" style={{ marginBottom: '12px', opacity: isActive ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                {String(timeLeft || settingsRef.current.timeLimit).padStart(2, '0')}
              </div>
              <div className="pixel-divider" />

              {/* FIX 3: disabled until settings are loaded to prevent premature input */}
              <input ref={inputRef} type="text" spellCheck={false} autoComplete="off"
                value={userInput} onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onBlur={() => setIsFocused(false)} onFocus={() => setIsFocused(true)}
                disabled={!settingsLoaded}
                style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
                autoFocus />

              {!isFocused && (
                <div className="focus-overlay"><div className="focus-msg">CLICK TO FOCUS</div></div>
              )}

              <div className={`words-box${isFocused ? '' : ' blur-focus'}`}>
                {displayedWords.map((word, index) => {
                  const ai = currentPage * WORDS_PER_PAGE + index;
                  if (ai < currentWordIndex)
                    return <div key={ai} className={correctWords[ai] ? 'word-correct' : 'word-wrong'}>{word}</div>;
                  if (ai === currentWordIndex) {
                    const chars = word.split(''), typedChars = userInput.split('');
                    const maxLen = Math.max(chars.length, typedChars.length);
                    return (
                      <div key={ai} style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(15,56,15,0.2)', padding: '0 4px', borderBottom: '3px solid #306230', whiteSpace: 'nowrap' }}>
                        {typedChars.length === 0 && isFocused && <span className="gb-caret" />}
                        {Array.from({ length: maxLen }).map((_, ci) => {
                          const char = chars[ci] ?? '', typed = typedChars[ci];
                          let cls = 'char-pending', display = char;
                          if (typed !== undefined) {
                            if (!char)          { display = typed; cls = 'char-extra'; }
                            else if (typed === char) cls = 'char-correct';
                            else                cls = 'char-wrong';
                          }
                          return (
                            <span key={ci} style={{ position: 'relative' }}>
                              {ci === typedChars.length && ci > 0 && isFocused && <span className="gb-caret" />}
                              <span className={cls}>{display}</span>
                            </span>
                          );
                        })}
                        {typedChars.length >= maxLen && typedChars.length > 0 && isFocused && <span className="gb-caret" />}
                      </div>
                    );
                  }
                  return <div key={ai} className="word-idle">{word}</div>;
                })}
              </div>
            </div>

          ) : (
            /* RESULTS SCREEN */
            <div className="gb-screen screen-texture" style={{ padding: 'clamp(16px,3vw,36px)', position: 'relative', overflow: 'hidden' }}>

              <Confetti active={isNewRecord} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <div style={{ fontSize: '9px', color: 'var(--gb-dark)', letterSpacing: '4px' }}>RESULTS</div>
                {isNewRecord && (
                  <div style={{
                    fontSize: '6px', color: 'var(--gb-darkest)', background: 'var(--gb-mid)',
                    border: '2px solid var(--gb-darkest)', padding: '2px 8px',
                    letterSpacing: '1px', animation: 'gb-pulse 0.6s steps(1) infinite',
                  }}>NEW RECORD!</div>
                )}
              </div>
              <div className="pixel-divider" />

              <div style={{ display: 'flex', gap: 'clamp(20px,5vw,48px)', flexWrap: 'wrap', marginBottom: '12px' }}>
                <div><div className="stat-label">WPM</div><div className="stat-big">{stats.wpm}</div></div>
                <div><div className="stat-label">ACC</div><div className="stat-big">{acc}%</div></div>
                <div><div className="stat-label">CORRECT</div><div className="stat-big" style={{ fontSize: 'clamp(18px,3vw,28px)' }}>{stats.correctWordsCount}</div></div>
                <div><div className="stat-label">WRONG</div><div className="stat-big" style={{ fontSize: 'clamp(18px,3vw,28px)', color: 'rgba(15,56,15,0.5)' }}>{stats.wrongWordsCount}</div></div>
              </div>

              <div className="pixel-divider" />
              <WpmProgressBar wpm={stats.wpm} />
              <div className="pixel-divider" />
              <ResultChart wordEvents={stats.wordEvents} timeLimit={timeLimit} />
              <div className="pixel-divider" />

              <div style={{ fontSize: '8px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--gb-dark)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>TEST</span><span style={{ color: 'var(--gb-darkest)' }}>{timeLimit}s / {language} / {difficulty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>KEYSTROKES</span><span style={{ color: 'var(--gb-darkest)' }}>{stats.keystrokes.correct} ok / {stats.keystrokes.wrong} err</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button className="pixel-btn" onClick={() => generateWords()}
                  style={{ fontSize: '8px', padding: '8px 18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  PLAY AGAIN
                </button>
                <button className="pixel-btn" onClick={() => router.push(HISTORY_ROUTE)}
                  style={{ fontSize: '8px', padding: '8px 18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  VIEW HISTORY
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="gb-footer" style={{ marginTop: '20px', fontSize: '7px', color: 'var(--gb-dark)', display: 'flex', gap: '12px', opacity: 0.7, flexWrap: 'wrap' }}>
          <span><kbd>SPACE</kbd> submit word</span>
          <span>|</span>
          <span><kbd>TAB</kbd>+<kbd>ENTER</kbd> restart</span>
        </footer>

        {/* LANGUAGE MISMATCH WARNING TOAST */}
        {langWarn > 0 && (
          <>
            <div className="lang-warn-toast" key={langWarn}>
              <span className="lang-warn-icon">⌨️</span>
              <span>
                {language === 'en'
                  ? 'WRONG LANGUAGE! — SWITCH TO ENGLISH'
                  : 'ผิดภาษา! — เปลี่ยนเป็นภาษาไทย'}
              </span>
            </div>
            <div className="lang-warn-bar" key={`bar-${langWarn}`} />
          </>
        )}
      </div>
    </>
  );
}
