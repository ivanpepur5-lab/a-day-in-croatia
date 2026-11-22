import { CHALLENGES } from '../data/challenges.js';

/** Day #1 of the game (local calendar date). */
export const EPOCH = { year: 2026, month: 11, day: 1 };

const MS_PER_DAY = 86_400_000;

/** Local calendar date → "YYYY-MM-DD" */
export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Whole calendar days between the epoch and `date` (DST-safe, uses UTC of the local date). */
function dayIndex(date) {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const epoch = Date.UTC(EPOCH.year, EPOCH.month - 1, EPOCH.day);
  return Math.floor((local - epoch) / MS_PER_DAY);
}

/** Puzzle number shown to players (#1 on the epoch day). Never below 1. */
export function puzzleNumber(date = new Date()) {
  return Math.max(1, dayIndex(date) + 1);
}

/** The challenge everybody plays on `date`. */
export function getDailyChallenge(date = new Date(), challenges = CHALLENGES) {
  const n = puzzleNumber(date);
  const index = (n - 1) % challenges.length;
  return { number: n, dateKey: dateKey(date), challenge: challenges[index] };
}

/** Milliseconds until local midnight (next puzzle). */
export function msUntilNextPuzzle(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** "YYYY-MM-DD" of the day before a key. */
export function previousDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return dateKey(new Date(y, m - 1, d - 1));
}
