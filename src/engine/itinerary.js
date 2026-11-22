import { getLocation } from '../data/locations.js';
import { estimateLeg } from './travel.js';

/** "09:30" → 570 */
export function parseClock(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** 570 → "09:30" (wraps past midnight). */
export function formatClock(totalMinutes) {
  const m = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** 135 → "2h 15m" */
export function formatDuration(minutes) {
  const sign = minutes < 0 ? '−' : '';
  const abs = Math.abs(Math.round(minutes));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${sign}${m}m`;
  if (m === 0) return `${sign}${h}h`;
  return `${sign}${h}h ${m}m`;
}

/** €12.5 → "€12.50", €12 → "€12" */
export function formatEuro(value) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? `€${rounded}` : `€${rounded.toFixed(2)}`;
}

const money = (v) => Math.round(v * 100) / 100;

/**
 * Build a full, timed itinerary: hub → stops (in order) → hub.
 * Pure and deterministic.
 *
 * @param {object} challenge
 * @param {string[]} orderedIds  Location ids in visiting order (0–N).
 */
export function buildItinerary(challenge, orderedIds, legFn = estimateLeg) {
  const party = challenge.partySize;
  const start = parseClock(challenge.startTime);
  let clock = start;
  let prev = challenge.hub;

  let travelMinutes = 0;
  let experienceMinutes = 0;
  let transportCost = 0;
  let experienceCost = 0;

  const legs = [];
  const stops = orderedIds.map((id, index) => {
    const location = getLocation(id);
    const leg = makeLeg(prev, location, legFn, party);
    legs.push(leg);
    travelMinutes += leg.minutes;
    transportCost += leg.cost;
    clock += leg.minutes;

    const arrive = clock;
    clock += location.durationMin;
    experienceMinutes += location.durationMin;
    const cost = money(location.costPerPerson * party);
    experienceCost += cost;

    prev = location;
    return { index, location, legIn: leg, arrive, depart: clock, cost };
  });

  const returnLeg = orderedIds.length > 0 ? makeLeg(prev, challenge.hub, legFn, party) : null;
  if (returnLeg) {
    legs.push(returnLeg);
    travelMinutes += returnLeg.minutes;
    transportCost += returnLeg.cost;
    clock += returnLeg.minutes;
  }

  const totalMinutes = clock - start;
  const totalCost = money(experienceCost + transportCost);
  const overrunMinutes = Math.max(0, totalMinutes - challenge.availableMinutes);
  const overBudget = money(Math.max(0, totalCost - challenge.budget));

  return {
    stops,
    legs,
    returnLeg,
    totals: {
      startTime: start,
      endTime: clock,
      deadline: start + challenge.availableMinutes,
      experienceMinutes,
      travelMinutes,
      totalMinutes,
      freeMinutes: Math.max(0, challenge.availableMinutes - totalMinutes),
      experienceCost: money(experienceCost),
      transportCost: money(transportCost),
      totalCost,
    },
    constraints: {
      timeOk: overrunMinutes === 0,
      budgetOk: overBudget === 0,
      overrunMinutes,
      overBudget,
    },
  };
}

function makeLeg(from, to, legFn, party) {
  const est = legFn(from.coords, to.coords);
  return {
    fromId: from.id,
    toId: to.id,
    mode: est.mode,
    km: est.km,
    minutes: est.minutes,
    costPerPerson: est.costPerPerson,
    cost: money(est.costPerPerson * party),
  };
}
