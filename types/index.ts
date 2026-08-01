import type { WordEvent } from '../lib/chartUtils';

export interface KeystrokeStats { correct: number; wrong: number; }

export interface Stats {
  wpm: number; keystrokes: KeystrokeStats;
  correctWordsCount: number; wrongWordsCount: number;
  wordEvents: WordEvent[];
}

export interface HistoryRecord {
  wpm: number; acc: number; timeLimit: number;
  language: string; difficulty: string;
  keystrokes: KeystrokeStats;
  correctWordsCount: number; wrongWordsCount: number;
  wordEvents: WordEvent[];
  date: string;
}

export interface SavedSettings { language: string; difficulty: string; timeLimit: number; }
