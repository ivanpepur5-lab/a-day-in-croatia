import { buildItinerary, formatDuration, formatEuro } from './itinerary.js';
import { requirementMet } from './requirements.js';
import { permutations } from './combinatorics.js';

/**
 * Transparent, deterministic scoring (0–100).
 *
 *  TIME     40  Share of the day spent at experiences, against a target of
 *               TIME_TARGET_RATIO of the available time. −1 point per
 *               OVERRUN_MIN_PER_POINT minutes past the deadline.
 *  BUDGET   25  20 points for staying within budget, plus up to 5 for keeping
 *               a reserve of BUDGET_RESERVE_RATIO of the budget. Over budget:
 *               20 points fall linearly to 0 at BUDGET_OVER_ZERO_RATIO over.
 *  ROUTE    20  Fastest possible travel time for the same stops ÷ your travel time.
 *  MISSION  15  Shared equally between the mission requirements.
 *
 * Each component is rounded to a whole number; the total is their sum.
 */
export const SCORING = {
  TIME_MAX: 40,
  BUDGET_MAX: 25,
  ROUTE_MAX: 20,
  MISSION_MAX: 15,
  TIME_TARGET_RATIO: 0.75,
  OVERRUN_MIN_PER_POINT: 2,
  BUDGET_BASE: 20,
  BUDGET_RESERVE_BONUS: 5,
  BUDGET_RESERVE_RATIO: 0.2,
  BUDGET_OVER_ZERO_RATIO: 0.25,
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function scoreTime(challenge, itinerary, S = SCORING) {
  const { experienceMinutes } = itinerary.totals;
  const { overrunMinutes } = itinerary.constraints;
  const target = challenge.availableMinutes * S.TIME_TARGET_RATIO;
  const base = S.TIME_MAX * Math.min(1, experienceMinutes / target);
  const penalty = overrunMinutes / S.OVERRUN_MIN_PER_POINT;
  const points = Math.round(clamp(base - penalty, 0, S.TIME_MAX));
  const pct = Math.round((experienceMinutes / challenge.availableMinutes) * 100);
  const detail =
    overrunMinutes > 0
      ? `Your day overran by ${formatDuration(overrunMinutes)} (−${Math.round(penalty)} pts). ` +
        `${formatDuration(experienceMinutes)} of experiences.`
      : `${formatDuration(experienceMinutes)} of experiences — ${pct}% of your day. ` +
        `Full marks from ${Math.round(S.TIME_TARGET_RATIO * 100)}%.`;
  return {
    id: 'time',
    label: 'Time efficiency',
    points,
    max: S.TIME_MAX,
    detail,
    data: { experienceMinutes, target, overrunMinutes, penalty },
  };
}

export function scoreBudget(challenge, itinerary, S = SCORING) {
  const { totalCost } = itinerary.totals;
  const { budget } = challenge;
  let raw;
  let detail;
  if (totalCost <= budget) {
    const reserve = budget - totalCost;
    const bonus = S.BUDGET_RESERVE_BONUS * Math.min(1, reserve / (budget * S.BUDGET_RESERVE_RATIO));
    raw = S.BUDGET_BASE + bonus;
    detail =
      `Spent ${formatEuro(totalCost)} of ${formatEuro(budget)}. ` +
      `${formatEuro(reserve)} kept in reserve (bonus maxes at ${formatEuro(budget * S.BUDGET_RESERVE_RATIO)}).`;
  } else {
    const over = totalCost - budget;
    raw = S.BUDGET_BASE * Math.max(0, 1 - over / (budget * S.BUDGET_OVER_ZERO_RATIO));
    detail = `Over budget by ${formatEuro(over)}. Points reach zero at ${formatEuro(
      budget * S.BUDGET_OVER_ZERO_RATIO,
    )} over.`;
  }
  return {
    id: 'budget',
    label: 'Budget management',
    points: Math.round(clamp(raw, 0, S.BUDGET_MAX)),
    max: S.BUDGET_MAX,
    detail,
    data: { totalCost, budget },
  };
}

/** Minimum travel minutes over every ordering of the given stops. */
export function optimalTravelMinutes(challenge, ids, legFn) {
  if (ids.length === 0) return { minutes: 0, order: [] };
  let best = { minutes: Infinity, order: ids };
  for (const order of permutations(ids)) {
    const t = buildItinerary(challenge, order, legFn).totals.travelMinutes;
    if (t < best.minutes) best = { minutes: t, order };
  }
  return best;
}

export function scoreRoute(challenge, itinerary, legFn, S = SCORING) {
  const ids = itinerary.stops.map((s) => s.location.id);
  const actual = itinerary.totals.travelMinutes;
  const optimal = optimalTravelMinutes(challenge, ids, legFn);
  const ratio = actual === 0 ? 1 : optimal.minutes / actual;
  const points = Math.round(clamp(S.ROUTE_MAX * ratio, 0, S.ROUTE_MAX));
  const wasted = actual - optimal.minutes;
  const detail =
    wasted <= 0
      ? `${formatDuration(actual)} of travel — the fastest order for these stops.`
      : `${formatDuration(actual)} of travel. The best order takes ${formatDuration(
          optimal.minutes,
        )} (${formatDuration(wasted)} saved).`;
  return {
    id: 'route',
    label: 'Route efficiency',
    points,
    max: S.ROUTE_MAX,
    detail,
    data: { actual, optimal: optimal.minutes, optimalOrder: optimal.order },
  };
}

export function scoreMission(challenge, itinerary, S = SCORING) {
  const ids = itinerary.stops.map((s) => s.location.id);
  const checks = challenge.requirements.map((req) => ({ ...req, met: requirementMet(req, ids) }));
  const met = checks.filter((c) => c.met).length;
  const total = checks.length;
  const points = total === 0 ? S.MISSION_MAX : Math.round((S.MISSION_MAX * met) / total);
  return {
    id: 'mission',
    label: 'Mission requirements',
    points,
    max: S.MISSION_MAX,
    detail: `${met} of ${total} requirements met.`,
    data: { checks, met, total },
  };
}

export const RATINGS = [
  { min: 95, title: 'Local legend', blurb: 'Even Split’s nonnas would approve.' },
  { min: 85, title: 'Seasoned explorer', blurb: 'A beautifully balanced day.' },
  { min: 70, title: 'Savvy traveller', blurb: 'A great day with a little to polish.' },
  { min: 50, title: 'Day tripper', blurb: 'Fun, if a bit frantic.' },
  { min: 0, title: 'Lost in the lanes', blurb: 'Tomorrow is a fresh start.' },
];

export function ratingFor(total) {
  return RATINGS.find((r) => total >= r.min);
}

/**
 * Score an ordered selection for a challenge.
 * @returns {{total:number, components:object[], itinerary:object, rating:object, valid:boolean}}
 */
export function scorePlan(challenge, orderedIds, legFn) {
  if (orderedIds.length !== challenge.picks) {
    throw new Error(`A plan needs exactly ${challenge.picks} experiences (got ${orderedIds.length}).`);
  }
  if (new Set(orderedIds).size !== orderedIds.length) {
    throw new Error('A plan cannot contain the same experience twice.');
  }
  for (const id of orderedIds) {
    if (!challenge.cardIds.includes(id)) throw new Error(`${id} is not part of this challenge.`);
  }
  const itinerary = buildItinerary(challenge, orderedIds, legFn);
  const components = [
    scoreTime(challenge, itinerary),
    scoreBudget(challenge, itinerary),
    scoreRoute(challenge, itinerary, legFn),
    scoreMission(challenge, itinerary),
  ];
  const total = components.reduce((sum, c) => sum + c.points, 0);
  return {
    total,
    components,
    itinerary,
    rating: ratingFor(total),
    valid: itinerary.constraints.timeOk && itinerary.constraints.budgetOk,
  };
}
