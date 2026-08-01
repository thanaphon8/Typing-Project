"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadSettings, persistSettings } from '../lib/storage';
import type { SavedSettings } from '../types';

/* FIX 1: settingsRef always holds the latest settings values,
   preventing stale closures in persistSettings wrappers */
export function useSettings() {
  const [language,       setLangState]      = useState<string>('en');
  const [difficulty,     setDiffState]      = useState<string>('normal');
  const [timeLimit,      setTimeLimState]   = useState<number>(60);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  const settingsRef = useRef<SavedSettings>({ language: 'en', difficulty: 'normal', timeLimit: 60 });
  useEffect(() => {
    settingsRef.current = { language, difficulty, timeLimit };
  }, [language, difficulty, timeLimit]);

  useEffect(() => {
    const s = loadSettings();
    setLangState(s.language);
    setDiffState(s.difficulty);
    setTimeLimState(s.timeLimit);
    settingsRef.current = s;
    setSettingsLoaded(true);
  }, []);

  const setLanguage = useCallback((v: string) => {
    setLangState(v);
    persistSettings({ ...settingsRef.current, language: v });
  }, []);
  const setDifficulty = useCallback((v: string) => {
    setDiffState(v);
    persistSettings({ ...settingsRef.current, difficulty: v });
  }, []);
  const setTimeLimit = useCallback((v: number) => {
    setTimeLimState(v);
    persistSettings({ ...settingsRef.current, timeLimit: v });
  }, []);

  return {
    language, difficulty, timeLimit, settingsLoaded, settingsRef,
    setLanguage, setDifficulty, setTimeLimit,
  };
}
