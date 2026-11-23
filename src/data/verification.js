/**
 * Verification rules shared by the app, the tests and `npm run audit`.
 *
 * A fact's DISPLAY STATE is one of:
 *   verified    — checked on an official source, date within the review window
 *   stale       — was verified, but the check is older than the review window
 *                 or the information's validUntil date has passed ("needs re-check")
 *   unverified  — a real-world claim not (yet) confirmed on an official source
 *   estimate    — a game value; never shown as an official price
 */
export const STATES = ['verified', 'stale', 'unverified', 'estimate'];
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const STATE_LABEL = {
  verified: 'Verified',
  stale: 'Needs re-check',
  unverified: 'Unverified',
  estimate: 'Estimate',
};

const DAY = 86_400_000;
const toUTC = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

/** Whole days from `from` to `to` (YYYY-MM-DD). */
export function daysBetweenKeys(from, to) {
  return Math.round((toUTC(to) - toUTC(from)) / DAY);
}

/**
 * Display state of a verified/unverified/estimate record at `today`.
 * @param {{status:string, verifiedOn?:string, validUntil?:string, reviewDays?:number}} rec
 * @param {{today:string, defaultReviewDays:number}} opts
 * @returns {{state:string, reason?:string, ageDays?:number}}
 */
export function displayState(rec, { today, defaultReviewDays }) {
  if (rec.status !== 'verified') return { state: rec.status };
  const reviewDays = rec.reviewDays ?? defaultReviewDays;
  const ageDays = rec.verifiedOn && DATE_RE.test(rec.verifiedOn) ? daysBetweenKeys(rec.verifiedOn, today) : Infinity;
  if (rec.validUntil && DATE_RE.test(rec.validUntil) && today > rec.validUntil) {
    return { state: 'stale', reason: `valid until ${rec.validUntil}`, ageDays };
  }
  if (ageDays > reviewDays) {
    return { state: 'stale', reason: `last checked ${ageDays} days ago (review every ${reviewDays})`, ageDays };
  }
  return { state: 'verified', ageDays };
}

/** "23 Nov 2026" */
export function formatCheckDate(key) {
  if (!key || !DATE_RE.test(key)) return '';
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
