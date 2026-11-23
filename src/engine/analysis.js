import { allPlans } from './solver.js';

/**
 * Exact, exhaustive analysis of a challenge: every ordered plan
 * (C(8,4) × 4! = 1,680 for an 8-card, 4-pick challenge) is scored with the
 * same `scorePlan` the player's plan uses, so rank and "best possible" can
 * never disagree with the displayed score.
 */
const cache = new Map();

export function analyzeChallenge(challenge, legFn) {
  if (!legFn && cache.has(challenge.id)) return cache.get(challenge.id);
  const plans = allPlans(challenge, legFn);
  const totals = plans.map((p) => p.result.total).sort((a, b) => b - a);
  const maxTotal = totals[0];
  const bestPlans = plans
    .filter((p) => p.result.total === maxTotal)
    .sort((a, b) => (a.order.join() < b.order.join() ? -1 : 1));
  const histogram = new Map();
  for (const t of totals) histogram.set(t, (histogram.get(t) ?? 0) + 1);
  const analysis = {
    count: plans.length,
    totals, // descending
    maxTotal,
    minTotal: totals[totals.length - 1],
    best: bestPlans[0],
    bestPlans,
    histogram,
  };
  if (!legFn) cache.set(challenge.id, analysis);
  return analysis;
}

/**
 * Standard competition ranking ("1224"): rank = 1 + number of plans that
 * score strictly higher. `tiedWith` = other plans with exactly this score.
 */
export function rankOf(analysis, total) {
  const above = analysis.totals.filter((t) => t > total).length;
  const same = analysis.histogram.get(total) ?? 0;
  return {
    rank: above + 1,
    count: analysis.count,
    plansAbove: above,
    tiedWith: Math.max(0, same - 1),
    isBest: total === analysis.maxTotal,
  };
}

/** "1st", "2nd", "23rd", "111th" */
export function ordinal(n) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`;
}
