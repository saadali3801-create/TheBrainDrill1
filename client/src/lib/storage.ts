/**
 * BrainDrill — Local Storage Utilities
 * Design: Void Interface — amber accent, deep charcoal, full-viewport focus
 */

export interface SessionResult {
  date: string; // ISO date string YYYY-MM-DD
  score: number;
  total: number;
  categoryScores: Record<string, { correct: number; total: number }>;
}

export interface BrainDrillStorage {
  streak: number;
  lastPlayedDate: string | null;
  longestStreak: number;
  totalSessions: number;
  history: SessionResult[];
}

const STORAGE_KEY = "braindrill_data";

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function loadStorage(): BrainDrillStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as BrainDrillStorage;
    }
  } catch {}
  return {
    streak: 0,
    lastPlayedDate: null,
    longestStreak: 0,
    totalSessions: 0,
    history: [],
  };
}

export function saveStorage(data: BrainDrillStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function hasPlayedToday(): boolean {
  const data = loadStorage();
  return data.lastPlayedDate === getTodayDate();
}

export function saveSessionResult(result: SessionResult): BrainDrillStorage {
  const data = loadStorage();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  // Update streak
  if (data.lastPlayedDate === today) {
    // Already played today — don't double-count streak
  } else if (data.lastPlayedDate === yesterday) {
    // Consecutive day
    data.streak += 1;
  } else {
    // Streak broken or first time
    data.streak = 1;
  }

  data.lastPlayedDate = today;
  data.longestStreak = Math.max(data.longestStreak, data.streak);
  data.totalSessions += 1;

  // Keep last 30 sessions
  data.history = [result, ...data.history].slice(0, 30);

  saveStorage(data);
  return data;
}

export function getCurrentStreak(): number {
  const data = loadStorage();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  // If last played was neither today nor yesterday, streak is broken
  if (
    data.lastPlayedDate !== today &&
    data.lastPlayedDate !== yesterday
  ) {
    return 0;
  }
  return data.streak;
}
