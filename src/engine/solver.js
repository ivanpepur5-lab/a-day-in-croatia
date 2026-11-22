import { combinations, permutations } from './combinatorics.js';
import { scorePlan } from './scoring.js';

/**
 * Exhaustively score every possible plan (C(8,4) × 4! = 1,680 for the
 * default challenge). Deterministic: ties break on lexical order of ids.
 */
export function allPlans(challenge, legFn) {
  const plans = [];
  for (const combo of combinations(challenge.cardIds, challenge.picks)) {
    for (const order of permutations(combo)) {
      plans.push({ order, result: scorePlan(challenge, order, legFn) });
    }
  }
  return plans;
}

const cache = new Map();

/** Best achievable plan for a challenge (memoised per challenge id). */
export function bestPlan(challenge, legFn) {
  if (!legFn && cache.has(challenge.id)) return cache.get(challenge.id);
  let best = null;
  for (const plan of allPlans(challenge, legFn)) {
    if (
      !best ||
      plan.result.total > best.result.total ||
      (plan.result.total === best.result.total && plan.order.join() < best.order.join())
    ) {
      best = plan;
    }
  }
  if (!legFn) cache.set(challenge.id, best);
  return best;
}

/** Percentile of a score against every possible plan (0–100). */
export function percentileOf(challenge, total, legFn) {
  const plans = allPlans(challenge, legFn);
  const beaten = plans.filter((p) => p.result.total < total).length;
  return Math.floor((beaten / plans.length) * 100);
}
