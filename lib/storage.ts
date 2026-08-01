import type { HistoryRecord, SavedSettings } from '../types';
import { SETTINGS_KEY } from './constants';

export function saveResult(r: Omit<HistoryRecord, 'date'>): void {
  const record: HistoryRecord = { ...r, date: new Date().toISOString() };
  try {
    const existing = JSON.parse(localStorage.getItem('pixeltype_history') ?? '[]') as HistoryRecord[];
    existing.unshift(record);
    localStorage.setItem('pixeltype_history', JSON.stringify(existing.slice(0, 50)));
  } catch { /* ignore */ }
  // save to MongoDB (fire-and-forget)
  fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  }).catch(() => { /* ignore network errors */ });
}

export function loadSettings(): SavedSettings {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<SavedSettings>;
    return {
      language:   ['en','th'].includes(s.language ?? '')        ? s.language!   : 'en',
      difficulty: ['normal','hard'].includes(s.difficulty ?? '') ? s.difficulty! : 'normal',
      timeLimit:  [30,60,120].includes(s.timeLimit ?? 0)        ? s.timeLimit!  : 60,
    };
  } catch { return { language: 'en', difficulty: 'normal', timeLimit: 60 }; }
}

export function persistSettings(s: SavedSettings): void {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
