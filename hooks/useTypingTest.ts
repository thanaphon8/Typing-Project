"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { generateWordList } from '../lib/words';
import { saveResult } from '../lib/storage';
import { WORDS_PER_PAGE } from '../lib/constants';
import type { HistoryRecord, SavedSettings, Stats } from '../types';

const EMPTY_STATS: Stats = { wpm: 0, keystrokes: { correct: 0, wrong: 0 }, correctWordsCount: 0, wrongWordsCount: 0, wordEvents: [] };

const isThaiChar   = (ch: string) => ch >= '฀' && ch <= '๿';
const hasThaiChar  = (s: string)  => s.split('').some(isThaiChar);
const hasLatinChar = (s: string)  => /[a-zA-Z]/.test(s);

/* Core typing-test state machine: words, input, timer, stats, language-mismatch
   warnings. Reads settings via settingsRef so it never needs settings values
   as direct deps (avoids stale closures / unwanted resets on settings change). */
export function useTypingTest(settingsRef: { current: SavedSettings }, settingsLoaded: boolean) {
  const [words,            setWords]            = useState<string[]>([]);
  const [userInput,        setUserInput]        = useState<string>('');
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [correctWords,     setCorrectWords]     = useState<boolean[]>([]);
  const [timeLeft,         setTimeLeft]         = useState<number>(0);
  const [isActive,         setIsActive]         = useState<boolean>(false);
  const [isFinished,       setIsFinished]       = useState<boolean>(false);
  const [isFocused,        setIsFocused]        = useState<boolean>(true);
  const [isNewRecord,      setIsNewRecord]      = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const inputRef    = useRef<HTMLInputElement>(null);
  const elapsedRef  = useRef<number>(0);
  const savedRef2   = useRef<boolean>(false);
  const statsRef    = useRef<Stats>(EMPTY_STATS);
  const langWarnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [langWarn, setLangWarn] = useState<number>(0);
  const tabPressedRef = useRef<boolean>(false);

  const triggerLangWarn = useCallback(() => {
    setLangWarn(c => c + 1);
    if (langWarnRef.current) clearTimeout(langWarnRef.current);
    langWarnRef.current = setTimeout(() => setLangWarn(0), 3000);
  }, []);

  const currentPage    = Math.floor(currentWordIndex / WORDS_PER_PAGE);
  const displayedWords = words.slice(currentPage * WORDS_PER_PAGE, (currentPage + 1) * WORDS_PER_PAGE);

  /* FIX 2: generateWords reads settings from settingsRef instead of depending
     on settings state directly, so it stays stable and won't trigger an
     unwanted reset when settings change mid-game. */
  const generateWords = useCallback((
    lang = settingsRef.current.language,
    diff = settingsRef.current.difficulty,
    time = settingsRef.current.timeLimit,
  ) => {
    const newWords = generateWordList(lang, diff);
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
    statsRef.current = EMPTY_STATS;
    setStats(EMPTY_STATS);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [settingsRef]);

  /* FIX 2: only run once after settings are loaded from localStorage.
     Settings button handlers call generateWords() themselves. */
  useEffect(() => {
    if (settingsLoaded) generateWords();
  }, [settingsLoaded, generateWords]);

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
      if (!savedRef2.current) {
        savedRef2.current = true;
        const prev = statsRef.current;
        const { timeLimit: tl, language: lang, difficulty: diff } = settingsRef.current;
        const wpm = Math.round((prev.keystrokes.correct / 5) / (tl / 60));
        const acc = Math.round((prev.correctWordsCount / (prev.correctWordsCount + prev.wrongWordsCount || 1)) * 100);
        setStats(s => ({ ...s, wpm }));
        try {
          const existing = JSON.parse(localStorage.getItem('pixeltype_history') ?? '[]') as HistoryRecord[];
          const prevBest = existing.length ? Math.max(...existing.map(r => r.wpm)) : 0;
          if (wpm > prevBest) setIsNewRecord(true);
        } catch { /* ignore */ }
        saveResult({
          wpm, acc, timeLimit: tl, language: lang, difficulty: diff,
          keystrokes: prev.keystrokes,
          correctWordsCount: prev.correctWordsCount,
          wrongWordsCount: prev.wrongWordsCount,
          wordEvents: prev.wordEvents,
        });
      }
    }
    return () => { if (iv) clearInterval(iv); };
  }, [isActive, timeLeft, settingsRef]);

  /* auto-extend words when running low (fast typist safety net) */
  useEffect(() => {
    if (!isActive || isFinished) return;
    if (words.length - currentWordIndex < 50) {
      const { language: lang, difficulty: diff } = settingsRef.current;
      const extra = generateWordList(lang, diff);
      setWords(prev => [...prev, ...extra]);
    }
  }, [currentWordIndex, isActive, isFinished, words.length, settingsRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // ป้องกัน focus เปลี่ยน
      tabPressedRef.current = true;
      return;
    }
    if (e.key === 'Enter' && tabPressedRef.current) {
      e.preventDefault();
      tabPressedRef.current = false;
      generateWords();
      return;
    }
    tabPressedRef.current = false;
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') tabPressedRef.current = true; // keep true while tab held
  };

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

      const language = settingsRef.current.language;
      if (language === 'en' && hasThaiChar(typedWord))  triggerLangWarn();
      if (language === 'th' && hasLatinChar(typedWord)) triggerLangWarn();

      const isCorrect = typedWord === words[currentWordIndex];
      const sec = elapsedRef.current;
      setCorrectWords(prev => [...prev, isCorrect]);
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      setStats(prev => {
        const next = {
          ...prev,
          correctWordsCount: isCorrect ? prev.correctWordsCount + 1 : prev.correctWordsCount,
          wrongWordsCount:   !isCorrect ? prev.wrongWordsCount + 1 : prev.wrongWordsCount,
          keystrokes: {
            correct: prev.keystrokes.correct + (isCorrect ? typedWord.length + 1 : 0),
            wrong:   prev.keystrokes.wrong   + (!isCorrect ? typedWord.length + 1 : 0),
          },
          wordEvents: [...prev.wordEvents, { word: typedWord, correct: isCorrect, sec }],
        };
        statsRef.current = next;
        return next;
      });
    } else {
      setUserInput(value);
    }
  };

  const acc = Math.round((stats.correctWordsCount / (stats.correctWordsCount + stats.wrongWordsCount || 1)) * 100);

  return {
    words, userInput, currentWordIndex, correctWords, timeLeft, isActive, isFinished,
    isFocused, setIsFocused, isNewRecord, stats, inputRef, langWarn,
    currentPage, displayedWords, generateWords,
    handleKeyDown, handleKeyUp, handleInputChange, acc,
  };
}
