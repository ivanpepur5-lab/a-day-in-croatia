import {
  START,
  DESTINATIONS,
  ISLANDS,
  MAINLAND_DAY_TRIPS,
  BASES,
  TRAVEL,
  DAY4,
  DAY5,
  ACTIVITIES,
  EVENTS,
  ACHIEVEMENTS,
  ENDINGS,
} from '../data/story.js';
import { TIPS_BY_ID } from '../data/tips.js';

/* ────────────────────────────────────────────────────────── RNG ──
 * Deterministic: every random draw is derived from (seed, day, purpose),
 * never from Math.random, so a daily seed gives every player the same
 * events and outcomes for the same choices. */
export function hashString(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
}
export function rng(seed, ...parts) {
  let a = hashString([seed, ...parts].join('|'));
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * Balance knobs (tuned with scripts/adventure-sim.mjs):
 * happiness gains are damped so the meter doesn't saturate, energy costs bite
 * a little harder, and going to bed exhausted costs happiness.
 */
export const BALANCE = { happyGain: 0.85, happyCeiling: 120, energyCost: 1.25, tiredAtNight: 35, tiredPenalty: 8 };
const HOST = { hostel: 'The hostel guitarist', apartment: 'Marija next door', boutique: 'The concierge' };

/* ────────────────────────────────────────────────────── STATE ── */
export function newGame({ seed, mode = 'free' } = {}) {
  return {
    seed: String(seed ?? 'free'),
    mode,
    day: 0,
    phase: 'base', // base → (travel → activity → event) × 5 → ended
    money: START.money,
    energy: START.energy,
    happiness: START.happiness,
    adventure: 0,
    local: 0,
    base: null,
    location: null,
    visited: [],
    route: [], // destination per day
    doneActivities: [],
    seenEvents: [],
    currentEvent: null,
    flags: {},
    tipsFound: [],
    achievements: [],
    choices: [], // [{day, phase, id}]
    ended: false,
    ending: null,
  };
}

const nextUnvisited = (s, list) => list.find((d) => !s.visited.includes(d));

/** Resolve "@next-mainland" style targets. */
function resolveTarget(s, to) {
  if (to === '@next-mainland') return nextUnvisited(s, MAINLAND_DAY_TRIPS) ?? 'split';
  if (to === '@other-island') return ISLANDS.find((i) => i !== s.location && !s.visited.includes(i)) ?? s.location;
  if (to === '@stay') return s.location;
  return to;
}

/* ─────────────────────────────────────────────────── OPTIONS ── */
function travelChoices(s) {
  if (s.day <= 3) {
    const choices = TRAVEL[s.day].choices.filter((c) => {
      const to = resolveTarget(s, c.to);
      return s.day === 1 || !s.visited.includes(to) || to === 'split';
    });
    return choices.map((c) => {
      if (c.to !== '@next-mainland') return c;
      const to = resolveTarget(s, c.to);
      return { ...c, label: `${c.label} (${DESTINATIONS[to].name})` };
    });
  }
  const onIsland = ISLANDS.includes(s.location);
  if (s.day === 4) {
    if (onIsland && s.flags.stranded) {
      return [
        { ...DAY4.stuck, to: '@stay' },
        { ...DAY4.privateBoat, to: nextUnvisited(s, MAINLAND_DAY_TRIPS) ?? 'split' },
      ];
    }
    if (onIsland) {
      const other = ISLANDS.find((i) => i !== s.location && !s.visited.includes(i));
      const mainland = nextUnvisited(s, MAINLAND_DAY_TRIPS);
      return [
        { ...DAY4.stayIsland, to: '@stay' },
        other && { ...DAY4.islandHop, to: other, label: `${DAY4.islandHop.label} to ${DESTINATIONS[other].name}` },
        mainland && { ...DAY4.backMainland, to: mainland, label: `${DAY4.backMainland.label}: ${DESTINATIONS[mainland].name}` },
      ].filter(Boolean);
    }
    const mainland = nextUnvisited(s, MAINLAND_DAY_TRIPS);
    const islands = TRAVEL[3].choices.filter((c) => ISLANDS.includes(c.to) && !s.visited.includes(c.to));
    return [
      mainland && { ...DAY4.mainlandNext, to: mainland, label: `${DAY4.mainlandNext.label}: ${DESTINATIONS[mainland].name}` },
      ...islands,
    ].filter(Boolean);
  }
  // day 5
  return onIsland ? [DAY5.islandToDubrovnik, DAY5.farewellSplit] : [DAY5.coachDubrovnik, DAY5.farewellSplit];
}

/** Up to three activities, picked per seed + day so replays differ (daily players see the same). */
function activityChoices(s) {
  return (ACTIVITIES[s.location] ?? [])
    .filter((a) => !s.doneActivities.includes(a.id))
    .map((a) => ({ a, r: rng(s.seed, 'activity', s.day, a.id) }))
    .sort((x, y) => x.r - y.r)
    .slice(0, 3)
    .map((x) => x.a);
}

function eligibleEvents(s) {
  return EVENTS.filter(
    (e) =>
      !s.seenEvents.includes(e.id) &&
      (e.where.includes('any') || e.where.includes(s.location)) &&
      (!e.when || e.when(s)),
  );
}

/** Deterministic weighted pick of today's event. */
export function pickEvent(s) {
  const pool = eligibleEvents(s);
  if (pool.length === 0) return null;
  const total = pool.reduce((a, e) => a + (e.weight ?? 1), 0);
  let r = rng(s.seed, 'event', s.day, s.location) * total;
  for (const e of pool) {
    r -= e.weight ?? 1;
    if (r < 0) return e;
  }
  return pool[pool.length - 1];
}

const worstMoney = (c) => {
  if (c.chance) return Math.min(c.chance.success.effects?.money ?? 0, c.chance.fail.effects?.money ?? 0);
  return c.effects?.money ?? 0;
};

const BROKE = {
  id: 'broke',
  label: 'Out of money: improvise',
  hint: 'Free, but not exactly fun',
  effects: { happiness: -8, energy: -5 },
  result: 'You sit on a bench and watch everyone else have fun. The view is still free. Your stomach files a formal complaint.',
};

/** What the player sees and can choose right now. */
export function getStep(s) {
  if (s.ended) return { phase: 'ended' };
  let title;
  let prompt;
  let raw;
  let event = null;
  if (s.phase === 'base') {
    title = 'Before you go';
    prompt = 'Five days, €500, one suitcase of optimism. First, where will you sleep? (You can’t change it later — choose wisely.)';
    raw = BASES.map((b) => ({ ...b, effects: { ...b.effects } }));
  } else if (s.phase === 'travel') {
    title = TRAVEL[s.day].title;
    prompt = TRAVEL[s.day].prompt.replace('Marija/the hostel guitarist/the concierge', HOST[s.base] ?? 'Everyone');
    raw = travelChoices(s);
  } else if (s.phase === 'activity') {
    const d = DESTINATIONS[s.location];
    title = `Day ${s.day} · ${d.name}`;
    prompt = `${d.blurb} What will you do?`;
    raw = activityChoices(s);
  } else {
    event = EVENTS.find((e) => e.id === s.currentEvent);
    title = event.title;
    prompt = event.story;
    raw = event.choices;
  }
  const choices = raw.map((c) => {
    const cost = -Math.min(0, worstMoney(c));
    const affordable = s.money - cost >= 0;
    return { ...c, cost, disabled: !affordable, reason: affordable ? '' : 'Not enough money' };
  });
  if (choices.length && choices.every((c) => c.disabled)) choices.push({ ...BROKE, cost: 0, disabled: false, reason: '' });
  return { phase: s.phase, day: s.day, title, prompt, choices, event, location: s.location };
}

/* ─────────────────────────────────────────────────── SCORING ── */
export function computeScore(s) {
  const parts = {
    happiness: s.happiness * 4,
    adventure: s.adventure * 12,
    local: s.local * 12,
    places: s.visited.length * 30,
    tips: s.tipsFound.length * 8,
    money: Math.floor(Math.max(0, s.money) / 2),
    energy: Math.max(0, s.energy),
  };
  return { parts, total: Object.values(parts).reduce((a, b) => a + b, 0) };
}

export function evaluateEnding(s) {
  const extra = { score: computeScore(s).total };
  return ENDINGS.find((e) => e.test(s, extra));
}

function checkAchievements(s) {
  const fresh = [];
  for (const a of ACHIEVEMENTS) {
    if (!s.achievements.includes(a.id) && a.test(s)) {
      s.achievements.push(a.id);
      fresh.push(a.id);
    }
  }
  return fresh;
}

function applyEffects(s, effects = {}, flags = {}) {
  const before = { money: s.money, energy: s.energy, happiness: s.happiness, adventure: s.adventure, local: s.local };
  s.money = Math.round((s.money + (effects.money ?? 0)) * 100) / 100;
  const e = effects.energy ?? 0;
  const h = effects.happiness ?? 0;
  s.energy = clamp(s.energy + (e < 0 ? Math.round(e * BALANCE.energyCost) : e), 0, 100);
  // diminishing returns: the happier you are, the less each nice thing adds
  const gain = h > 0 ? Math.max(1, Math.round(h * BALANCE.happyGain * (1 - s.happiness / BALANCE.happyCeiling))) : h;
  s.happiness = clamp(s.happiness + gain, 0, 100);
  s.adventure += effects.adventure ?? 0;
  s.local += effects.local ?? 0;
  for (const [k, v] of Object.entries(flags)) {
    if (typeof v === 'number') s.flags[k] = (s.flags[k] ?? 0) + v;
    else s.flags[k] = v;
  }
  return Object.fromEntries(
    Object.keys(before)
      .map((k) => [k, Math.round((s[k] - before[k]) * 100) / 100])
      .filter(([, v]) => v !== 0),
  );
}

function finish(s) {
  s.ended = true;
  s.phase = 'ended';
  s.ending = evaluateEnding(s).id;
}

/**
 * Apply a choice. Returns { state, outcome } — never mutates the input.
 * outcome: { text, deltas, tip, newTip, achievements, night, ending }
 */
export function choose(state, choiceId) {
  const s = structuredClone({ ...state, currentEventRef: undefined });
  const step = getStep(s);
  const choice = step.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error(`Unknown choice "${choiceId}" in phase ${s.phase}`);
  if (choice.disabled) throw new Error(`Choice "${choiceId}" is not affordable`);
  s.choices.push({ day: s.day, phase: s.phase, id: choiceId });

  // resolve chance outcomes deterministically
  let effects = choice.effects;
  let flags = choice.flags ?? {};
  let text = choice.result;
  let lucky = null;
  if (choice.chance) {
    const roll = rng(s.seed, 'chance', s.day, s.currentEvent ?? s.phase, choice.id);
    lucky = roll < choice.chance.p;
    const branch = lucky ? choice.chance.success : choice.chance.fail;
    effects = branch.effects;
    flags = { ...flags, ...(branch.flags ?? {}) };
    text = branch.result;
  }

  // phase-specific bookkeeping
  if (s.phase === 'base') {
    s.base = choice.id;
  } else if (s.phase === 'travel') {
    const to = resolveTarget(s, choice.to);
    s.location = to;
    s.route.push(to);
    if (!s.visited.includes(to)) s.visited.push(to);
  } else if (s.phase === 'activity') {
    if (choice.id !== 'broke') s.doneActivities.push(choice.id);
  } else if (s.phase === 'event') {
    s.seenEvents.push(s.currentEvent);
  }

  const deltas = applyEffects(s, effects, flags);

  let tip = null;
  let newTip = false;
  if (choice.tip && TIPS_BY_ID[choice.tip]) {
    tip = TIPS_BY_ID[choice.tip];
    newTip = !s.tipsFound.includes(tip.id);
    if (newTip) s.tipsFound.push(tip.id);
  }

  const outcome = { text, deltas, tip, newTip, lucky, achievements: [], night: null, ending: null, choice: { id: choice.id, label: choice.label } };

  // collapse = immediate disaster
  if (s.energy <= 0 || s.happiness <= 0) {
    finish(s);
    outcome.achievements = checkAchievements(s);
    outcome.ending = s.ending;
    return { state: s, outcome };
  }

  // advance phase
  if (s.phase === 'base') {
    s.day = 1;
    s.phase = 'travel';
  } else if (s.phase === 'travel') {
    s.phase = 'activity';
    if (activityChoices(s).length === 0) s.phase = 'event';
  } else if (s.phase === 'activity') {
    s.phase = 'event';
  } else if (s.phase === 'event') {
    if (s.day >= START.days) {
      finish(s);
      outcome.ending = s.ending;
    } else {
      outcome.night = night(s);
      s.day += 1;
      s.phase = 'travel';
    }
  }
  if (!s.ended && (s.energy <= 0 || s.happiness <= 0)) {
    finish(s);
    outcome.ending = s.ending;
  }
  if (s.phase === 'event' && !s.ended) {
    const e = pickEvent(s);
    s.currentEvent = e ? e.id : null;
    if (!e) {
      // no eligible event: skip straight to the night
      if (s.day >= START.days) {
        finish(s);
        outcome.ending = s.ending;
      } else {
        outcome.night = night(s);
        s.day += 1;
        s.phase = 'travel';
      }
    }
  }
  outcome.achievements = checkAchievements(s);
  return { state: s, outcome };
}

/** Overnight: pay for the bed (if you can) and recover energy. */
function night(s) {
  const base = BASES.find((b) => b.id === s.base) ?? BASES[0];
  const tired = s.energy < BALANCE.tiredAtNight;
  if (tired) s.happiness = clamp(s.happiness - BALANCE.tiredPenalty, 0, 100);
  if (s.money >= base.nightly) {
    s.money -= base.nightly;
    s.energy = clamp(s.energy + base.recover, 0, 100);
    return { paid: base.nightly, recovered: base.recover, rough: false, tired };
  }
  s.energy = clamp(s.energy + 5, 0, 100);
  s.happiness = clamp(s.happiness - 10, 0, 100);
  return { paid: 0, recovered: 5, rough: true, tired };
}

export const isIsland = (id) => ISLANDS.includes(id);
