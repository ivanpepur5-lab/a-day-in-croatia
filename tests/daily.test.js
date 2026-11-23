import { describe, it, expect } from 'vitest';
import { CHALLENGES } from '../src/data/challenges.js';
import {
  PUZZLE_TIMEZONE,
  dateKey,
  puzzleNumber,
  puzzleNumberForKey,
  getDailyChallenge,
  challengeForKey,
  nextPuzzleInstant,
  msUntilNextPuzzle,
  previousDateKey,
  addDays,
  daysBetween,
  formatPuzzleDate,
} from '../src/engine/daily.js';

/*
 * All instants are absolute (UTC "Z" timestamps), so these tests mean the same
 * thing whatever timezone the machine runs in. `npm test` also re-runs this
 * file under TZ=America/Los_Angeles and TZ=Pacific/Kiritimati (UTC+14).
 */
const at = (iso) => new Date(iso);

describe('daily challenge — one puzzle day, defined in Croatia', () => {
  it('uses Europe/Zagreb', () => {
    expect(PUZZLE_TIMEZONE).toBe('Europe/Zagreb');
  });

  it('changes at midnight Croatian time in winter (CET, UTC+1)', () => {
    // 22 Nov 2026 23:59:59 in Zagreb = 22:59:59Z
    expect(dateKey(at('2026-11-22T22:59:59Z'))).toBe('2026-11-22');
    expect(dateKey(at('2026-11-22T23:00:00Z'))).toBe('2026-11-23');
    expect(puzzleNumber(at('2026-11-22T22:59:59Z'))).toBe(22);
    expect(puzzleNumber(at('2026-11-22T23:00:00Z'))).toBe(23);
  });

  it('changes at midnight Croatian time in summer (CEST, UTC+2)', () => {
    expect(dateKey(at('2027-06-30T21:59:59Z'))).toBe('2027-06-30');
    expect(dateKey(at('2027-06-30T22:00:00Z'))).toBe('2027-07-01');
  });

  it('starts at #1 on 1 Nov 2026 (Zagreb) and never goes below 1', () => {
    expect(puzzleNumber(at('2026-10-31T22:59:59Z'))).toBe(1); // still 31 Oct in Zagreb → clamped
    expect(puzzleNumber(at('2026-10-31T23:00:00Z'))).toBe(1); // 00:00 on 1 Nov in Zagreb
    expect(puzzleNumber(at('2026-11-01T22:59:59Z'))).toBe(1);
    expect(puzzleNumber(at('2026-11-01T23:00:00Z'))).toBe(2);
    expect(puzzleNumber(at('2020-01-01T12:00:00Z'))).toBe(1);
  });

  it('gives players everywhere the same puzzle at the same instant', () => {
    // 23:30 UTC on 22 Nov is 18:30 in New York, 08:30 next day in Tokyo,
    // and 00:30 on 23 Nov in Zagreb → everyone gets puzzle #23.
    const instant = at('2026-11-22T23:30:00Z');
    expect(getDailyChallenge(instant).number).toBe(23);
    expect(getDailyChallenge(instant).dateKey).toBe('2026-11-23');
  });

  it('rotates challenges daily and cycles through all of them', () => {
    const first = challengeForKey('2026-11-01');
    expect(first.challenge.id).toBe('split-classic');
    expect(challengeForKey('2026-11-02').challenge.id).not.toBe(first.challenge.id);
    expect(challengeForKey(addDays('2026-11-01', CHALLENGES.length)).challenge.id).toBe(first.challenge.id);
    const seen = new Set();
    for (let i = 0; i < CHALLENGES.length; i++) seen.add(challengeForKey(addDays('2026-11-01', i)).challenge.id);
    expect(seen.size).toBe(CHALLENGES.length);
  });

  it('counts days correctly across both DST changeovers', () => {
    expect(daysBetween('2027-03-27', '2027-03-29')).toBe(2); // spring forward 28 Mar
    expect(daysBetween('2027-10-30', '2027-11-01')).toBe(2); // fall back 31 Oct
    expect(puzzleNumberForKey('2027-03-29') - puzzleNumberForKey('2027-03-27')).toBe(2);
    expect(puzzleNumberForKey('2027-11-01')).toBe(366);
  });

  it('finds the next Croatian midnight, including on DST days', () => {
    expect(nextPuzzleInstant(at('2026-11-22T12:00:00Z')).toISOString()).toBe('2026-11-22T23:00:00.000Z');
    expect(nextPuzzleInstant(at('2027-03-27T12:00:00Z')).toISOString()).toBe('2027-03-27T23:00:00.000Z');
    expect(nextPuzzleInstant(at('2027-03-28T12:00:00Z')).toISOString()).toBe('2027-03-28T22:00:00.000Z');
    expect(nextPuzzleInstant(at('2027-10-30T12:00:00Z')).toISOString()).toBe('2027-10-30T22:00:00.000Z');
    expect(nextPuzzleInstant(at('2027-10-31T12:00:00Z')).toISOString()).toBe('2027-10-31T23:00:00.000Z');
    // the instant just after midnight belongs to the next puzzle
    const next = nextPuzzleInstant(at('2026-11-22T12:00:00Z'));
    expect(dateKey(next)).toBe('2026-11-23');
    expect(dateKey(new Date(next.getTime() - 1))).toBe('2026-11-22');
  });

  it('counts down to the next puzzle', () => {
    expect(msUntilNextPuzzle(at('2026-11-22T22:00:00Z'))).toBe(3_600_000);
    expect(msUntilNextPuzzle(at('2026-11-22T23:00:00Z'))).toBe(86_400_000);
  });

  it('does calendar arithmetic on date keys', () => {
    expect(previousDateKey('2026-03-01')).toBe('2026-02-28');
    expect(previousDateKey('2028-03-01')).toBe('2028-02-29');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(formatPuzzleDate('2026-11-22')).toBe('Sunday 22 November');
  });
});
