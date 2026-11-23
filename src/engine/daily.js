import { CHALLENGES } from '../data/challenges.js';

/**
 * Daily rotation.
 *
 * The puzzle day is defined in ONE timezone for everybody — Croatia
 * (Europe/Zagreb, CET/CEST) — so all players worldwide get the same
 * challenge and it changes at local midnight in Croatia, whatever the
 * device's own timezone is. A player in New York therefore sees the new
 * puzzle at 18:00 (or 19:00 when the DST changeovers are out of sync).
 */
export const PUZZLE_TIMEZONE = 'Europe/Zagreb';

/** Day #1 of the game, as a calendar date in PUZZLE_TIMEZONE. */
export const EPOCH_KEY = '2026-11-01';

const MS_PER_DAY = 86_400_000;
const formatterCache = new Map();

function formatter(timeZone) {
  if (!formatterCache.has(timeZone)) {
    formatterCache.set(
      timeZone,
      new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }),
    );
  }
  return formatterCache.get(timeZone);
}

/** Wall-clock parts of an instant in a timezone. */
export function zonedParts(instant = new Date(), timeZone = PUZZLE_TIMEZONE) {
  const parts = Object.fromEntries(
    formatter(timeZone)
      .formatToParts(instant)
      .filter((p) => p.type !== 'literal')
      .map((p) => [p.type, Number(p.value)]),
  );
  return parts; // { year, month, day, hour, minute, second }
}

const pad = (n) => String(n).padStart(2, '0');

/** Puzzle date ("YYYY-MM-DD") of an instant, in the puzzle timezone. */
export function dateKey(instant = new Date(), timeZone = PUZZLE_TIMEZONE) {
  const { year, month, day } = zonedParts(instant, timeZone);
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Whole days between two "YYYY-MM-DD" keys (calendar arithmetic, DST-proof). */
export function daysBetween(fromKey, toKey) {
  const toUTC = (k) => {
    const [y, m, d] = k.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUTC(toKey) - toUTC(fromKey)) / MS_PER_DAY);
}

/** "YYYY-MM-DD" ± n days. */
export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export const previousDateKey = (key) => addDays(key, -1);

/** Puzzle number for a puzzle date key (#1 on the epoch, never below 1). */
export function puzzleNumberForKey(key) {
  return Math.max(1, daysBetween(EPOCH_KEY, key) + 1);
}

/** Puzzle number shown to players at a given instant. */
export function puzzleNumber(instant = new Date()) {
  return puzzleNumberForKey(dateKey(instant));
}

/** Challenge for a puzzle date key. */
export function challengeForKey(key, challenges = CHALLENGES) {
  const number = puzzleNumberForKey(key);
  return { number, dateKey: key, challenge: challenges[(number - 1) % challenges.length] };
}

/** The challenge everybody plays at `instant`. */
export function getDailyChallenge(instant = new Date(), challenges = CHALLENGES) {
  return challengeForKey(dateKey(instant), challenges);
}

/**
 * The instant of the next midnight in the puzzle timezone.
 * Solved by correcting a UTC guess with the zone's actual offset (twice, to
 * be exact across DST transitions).
 */
export function nextPuzzleInstant(now = new Date(), timeZone = PUZZLE_TIMEZONE) {
  const [y, m, d] = addDays(dateKey(now, timeZone), 1).split('-').map(Number);
  const target = Date.UTC(y, m - 1, d, 0, 0, 0);
  let guess = target;
  for (let i = 0; i < 3; i++) {
    const p = zonedParts(new Date(guess), timeZone);
    const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    guess += target - wall;
  }
  return new Date(guess);
}

/** Milliseconds until the next puzzle. */
export function msUntilNextPuzzle(now = new Date()) {
  return Math.max(0, nextPuzzleInstant(now).getTime() - now.getTime());
}

/** Human date label for a puzzle key, e.g. "Sunday 22 November". */
export function formatPuzzleDate(key, options = { weekday: 'long', day: 'numeric', month: 'long' }) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('en-GB', { ...options, timeZone: 'UTC' });
}
