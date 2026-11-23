import { describe, it, expect } from 'vitest';
import { CHALLENGES, CHALLENGES_BY_ID } from '../src/data/challenges.js';
import { LOCATIONS, SPLIT_HUB, CATEGORIES, getLocation } from '../src/data/locations.js';
import { estimateLeg, haversineKm, TRAVEL_MODEL } from '../src/engine/travel.js';
import {
  buildItinerary,
  parseClock,
  formatClock,
  formatDuration,
  formatEuro,
} from '../src/engine/itinerary.js';
import {
  scorePlan,
  scoreTime,
  scoreBudget,
  scoreRoute,
  scoreMission,
  SCORING,
  ratingFor,
} from '../src/engine/scoring.js';
import { requirementMet, describeRequirement } from '../src/engine/requirements.js';
import { permutations, combinations } from '../src/engine/combinatorics.js';
import { bestPlan, allPlans } from '../src/engine/solver.js';
import { toggleSelection, moveItem, isComplete } from '../src/engine/selection.js';
import { gameReducer, createInitialState } from '../src/engine/gameReducer.js';
import { buildShareText, scoreBar } from '../src/engine/share.js';

const classic = CHALLENGES_BY_ID['split-classic'];

/** Fixed, hand-checkable leg model for unit tests: 10 min & €1 pp per leg. */
const flatLeg = () => ({ mode: 'transit', km: 5, minutes: 10, costPerPerson: 1 });

/** Synthetic challenge so arithmetic can be verified by hand. */
const mini = {
  ...classic,
  id: 'test-mini',
  startTime: '09:00',
  availableMinutes: 400, // time target = 300 min of experiences
  budget: 100,
  partySize: 2,
};

describe('data', () => {
  it('has the 8 required Split-region locations', () => {
    const names = LOCATIONS.map((l) => l.id);
    expect(names).toEqual([
      'diocletians-palace',
      'marjan',
      'bacvice',
      'salona',
      'klis',
      'trogir',
      'omis',
      'krka',
    ]);
  });

  it('gives every location valid categories, durations and costs', () => {
    for (const l of LOCATIONS) {
      expect(CATEGORIES[l.category]).toBeTruthy();
      expect(l.tags).toContain(l.category);
      l.tags.forEach((t) => expect(CATEGORIES[t]).toBeTruthy());
      expect(l.durationMin).toBeGreaterThan(0);
      expect(l.costPerPerson).toBeGreaterThanOrEqual(0);
      expect(l.coords.lat).toBeGreaterThan(43);
      expect(l.coords.lat).toBeLessThan(44);
    }
  });

  it('defines challenges with exactly 8 valid cards and 4 picks', () => {
    for (const c of CHALLENGES) {
      expect(c.cardIds).toHaveLength(8);
      expect(new Set(c.cardIds).size).toBe(8);
      c.cardIds.forEach((id) => expect(() => getLocation(id)).not.toThrow());
      expect(c.picks).toBe(4);
      expect(c.requirements.length).toBeGreaterThan(0);
    }
  });

  it('includes the headline Split mission', () => {
    expect(classic.availableMinutes).toBe(480);
    expect(classic.budget).toBe(75);
    expect(classic.partySize).toBe(2);
    expect(classic.brief).toMatch(/8 hours in Split/);
  });

  it('throws on unknown locations', () => {
    expect(() => getLocation('dubrovnik')).toThrow(/Unknown location/);
  });
});

describe('travel model', () => {
  it('computes great-circle distances', () => {
    expect(haversineKm(SPLIT_HUB.coords, SPLIT_HUB.coords)).toBe(0);
    const d = haversineKm(SPLIT_HUB.coords, getLocation('trogir').coords);
    expect(d).toBeGreaterThan(14);
    expect(d).toBeLessThan(17);
  });

  it('walks short legs for free', () => {
    const leg = estimateLeg(SPLIT_HUB.coords, getLocation('diocletians-palace').coords);
    expect(leg.mode).toBe('walk');
    expect(leg.costPerPerson).toBe(0);
    expect(leg.minutes).toBeGreaterThanOrEqual(1);
  });

  it('uses estimated transit for long legs, rounded to 5 minutes', () => {
    const leg = estimateLeg(SPLIT_HUB.coords, getLocation('krka').coords);
    expect(leg.mode).toBe('transit');
    expect(leg.minutes % 5).toBe(0);
    expect(leg.minutes).toBeGreaterThanOrEqual(TRAVEL_MODEL.WAIT_MIN);
    expect(leg.costPerPerson).toBeGreaterThan(0);
  });

  it('is symmetric and deterministic', () => {
    for (const a of LOCATIONS) {
      for (const b of LOCATIONS) {
        expect(estimateLeg(a.coords, b.coords)).toEqual(estimateLeg(b.coords, a.coords));
        expect(estimateLeg(a.coords, b.coords)).toEqual(estimateLeg(a.coords, b.coords));
      }
    }
  });

  it('never makes a farther leg faster (monotonic within a mode)', () => {
    const legs = LOCATIONS.map((l) => estimateLeg(SPLIT_HUB.coords, l.coords));
    const sorted = [...legs].sort((a, b) => a.km - b.km);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].mode === sorted[i - 1].mode) {
        expect(sorted[i].minutes).toBeGreaterThanOrEqual(sorted[i - 1].minutes);
      }
    }
  });
});

describe('formatting', () => {
  it('parses and formats clock times', () => {
    expect(parseClock('09:30')).toBe(570);
    expect(formatClock(570)).toBe('09:30');
    expect(formatClock(1440 + 65)).toBe('01:05');
  });
  it('formats durations and euros', () => {
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(120)).toBe('2h');
    expect(formatDuration(135)).toBe('2h 15m');
    expect(formatDuration(-20)).toBe('−20m');
    expect(formatEuro(12)).toBe('€12');
    expect(formatEuro(12.5)).toBe('€12.50');
  });
});

describe('itinerary', () => {
  it('times a plan hub → stops → hub', () => {
    const order = ['marjan', 'bacvice', 'salona', 'klis']; // 90+90+75+60 = 315 min
    const it = buildItinerary(mini, order, flatLeg);
    expect(it.stops).toHaveLength(4);
    expect(it.legs).toHaveLength(5);
    expect(it.totals.experienceMinutes).toBe(315);
    expect(it.totals.travelMinutes).toBe(50);
    expect(it.totals.totalMinutes).toBe(365);
    expect(it.totals.endTime).toBe(540 + 365);
    expect(it.stops[0].arrive).toBe(550);
    expect(it.stops[0].depart).toBe(640);
    expect(it.stops[1].arrive).toBe(650);
    expect(it.returnLeg.toId).toBe(SPLIT_HUB.id);
  });

  it('multiplies costs by party size', () => {
    const order = ['diocletians-palace', 'salona', 'klis', 'trogir']; // 12+8+10+7 = 37 pp
    const it = buildItinerary(mini, order, flatLeg);
    expect(it.totals.experienceCost).toBe(74);
    expect(it.totals.transportCost).toBe(10); // 5 legs × €1 × 2
    expect(it.totals.totalCost).toBe(84);
  });

  it('flags time overrun and budget overspend', () => {
    const order = ['omis', 'krka', 'trogir', 'diocletians-palace']; // 150+180+90+90 = 510
    const it = buildItinerary(mini, order, flatLeg);
    expect(it.constraints.timeOk).toBe(false);
    expect(it.constraints.overrunMinutes).toBe(510 + 50 - 400);
    // (30+30+7+12)×2 + 10 = 168 → €68 over
    expect(it.constraints.budgetOk).toBe(false);
    expect(it.constraints.overBudget).toBe(68);
  });

  it('handles an empty plan', () => {
    const it = buildItinerary(mini, [], flatLeg);
    expect(it.totals.totalMinutes).toBe(0);
    expect(it.returnLeg).toBeNull();
  });

  it('starts and ends at the hub with the real model', () => {
    const it = buildItinerary(classic, ['diocletians-palace', 'bacvice', 'salona', 'marjan']);
    expect(it.legs[0].fromId).toBe(SPLIT_HUB.id);
    expect(it.legs.at(-1).toId).toBe(SPLIT_HUB.id);
  });
});

describe('official bus fares', () => {
  const leg = (order, i) => buildItinerary(classic, order).legs[i];
  it('uses the published Promet Split online fare for listed municipality pairs', () => {
    const toSalona = leg(['salona', 'klis', 'bacvice', 'marjan'], 0); // Riva (Split) → Salona (Solin)
    expect(toSalona.mode).toBe('transit');
    expect(toSalona.fareStatus).toBe('verified');
    expect(toSalona.costPerPerson).toBe(1.75);
    expect(toSalona.cost).toBe(3.5); // party of 2
    const salonaKlis = leg(['salona', 'klis', 'bacvice', 'marjan'], 1); // Solin → Klis
    expect(salonaKlis.costPerPerson).toBe(1.75);
    const toTrogir = leg(['trogir', 'salona', 'bacvice', 'marjan'], 0);
    expect(toTrogir.costPerPerson).toBe(2.5);
  });
  it('keeps estimates for pairs the price list does not publish, and walking is free', () => {
    const trogirOmis = leg(['trogir', 'omis', 'bacvice', 'marjan'], 1);
    expect(trogirOmis.fareStatus).toBe('estimate');
    const toKrka = leg(['krka', 'omis', 'bacvice', 'marjan'], 0);
    expect(toKrka.fareStatus).toBe('estimate');
    const walk = leg(['diocletians-palace', 'bacvice', 'salona', 'marjan'], 0);
    expect(walk.mode).toBe('walk');
    expect(walk.fareStatus).toBe('free');
    expect(walk.cost).toBe(0);
  });
  it('stores fares per person and totals them for the whole party', () => {
    for (const order of [
      ['salona', 'klis', 'bacvice', 'marjan'],
      ['trogir', 'omis', 'krka', 'klis'],
      ['diocletians-palace', 'bacvice', 'salona', 'marjan'],
    ]) {
      const it = buildItinerary(classic, order);
      let verified = 0;
      let estimated = 0;
      for (const l of it.legs) {
        expect(l.party).toBe(2);
        expect(l.cost).toBeCloseTo(l.costPerPerson * 2, 10);
        if (l.fareStatus === 'verified') {
          verified += l.cost;
          expect(l.driverFarePerPerson).toBe(l.fare.driver);
          expect(l.costPerPerson).toBe(l.fare.online);
        } else {
          expect(l.driverFarePerPerson).toBeNull();
          if (l.fareStatus === 'estimate') estimated += l.cost;
          else expect(l.cost).toBe(0);
        }
      }
      expect(it.totals.transportVerified).toBeCloseTo(verified, 10);
      expect(it.totals.transportEstimated).toBeCloseTo(estimated, 10);
      expect(it.totals.transportCost).toBeCloseTo(verified + estimated, 10);
    }
  });

  it('prices a Riva → Salona → Klis → Riva bus day exactly from the official list (party of 2)', () => {
    const it = buildItinerary(classic, ['salona', 'klis', 'bacvice', 'marjan']);
    // Riva→Salona (Split–Solin 1.75) + Salona→Klis (Solin–Klis 1.75) + Klis→Bačvice (Split–Klis 2.00); rest walks
    expect(it.legs.map((l) => l.fareStatus)).toEqual(['verified', 'verified', 'verified', 'free', 'free']);
    expect(it.totals.transportCost).toBe((1.75 + 1.75 + 2.0) * 2);
  });

  it('lists only the fares printed in the official PDF', async () => {
    const { PROMET_FARES, FARE_SOURCE } = await import('../src/data/fares.js');
    expect(FARE_SOURCE.url).toMatch(/^https:\/\/www\.promet-split\.hr\//);
    expect(PROMET_FARES['Solin|Split']).toEqual({ online: 1.75, driver: 3.5, validityMin: 75 });
    expect(PROMET_FARES['Klis|Split']).toEqual({ online: 2, driver: 4, validityMin: 90 });
    expect(PROMET_FARES['Split|Trogir']).toEqual({ online: 2.5, driver: 5, validityMin: 105 });
    expect(PROMET_FARES['Omiš|Split']).toEqual({ online: 2.5, driver: 5, validityMin: 105 });
    for (const f of Object.values(PROMET_FARES)) expect(f.driver).toBe(f.online * 2);
  });
});

describe('requirements', () => {
  it('checks category minimums', () => {
    const req = { type: 'category', category: 'history', min: 2 };
    expect(requirementMet(req, ['salona', 'marjan'])).toBe(false);
    expect(requirementMet(req, ['salona', 'klis'])).toBe(true);
    // Trogir is tagged history as well as culture
    expect(requirementMet(req, ['salona', 'trogir'])).toBe(true);
  });
  it('checks first and last stop', () => {
    expect(requirementMet({ type: 'finishWith', category: 'viewpoint' }, ['bacvice', 'marjan'])).toBe(true);
    expect(requirementMet({ type: 'finishWith', category: 'viewpoint' }, ['marjan', 'bacvice'])).toBe(false);
    expect(requirementMet({ type: 'startWith', category: 'beach' }, ['bacvice', 'marjan'])).toBe(true);
    expect(requirementMet({ type: 'finishWith', category: 'viewpoint' }, [])).toBe(false);
  });
  it('rejects unknown types and describes requirements', () => {
    expect(() => requirementMet({ type: 'nope' }, [])).toThrow();
    expect(describeRequirement({ type: 'category', category: 'nature', min: 1 })).toBe('Include Nature');
    expect(describeRequirement({ type: 'category', category: 'history', min: 2 })).toBe('At least 2 × History');
    expect(describeRequirement({ type: 'finishWith', category: 'viewpoint' })).toBe('Finish at a viewpoint');
  });
});

describe('scoring — time (40)', () => {
  it('gives full marks at the target ratio', () => {
    // 315 experience minutes ≥ 300 target, total 365 ≤ 400
    const it = buildItinerary(mini, ['marjan', 'bacvice', 'salona', 'klis'], flatLeg);
    expect(scoreTime(mini, it).points).toBe(40);
  });
  it('scales linearly below the target', () => {
    const shortDay = { ...mini, availableMinutes: 600 }; // target 450
    const it = buildItinerary(shortDay, ['marjan', 'bacvice', 'salona', 'klis'], flatLeg);
    expect(scoreTime(shortDay, it).points).toBe(Math.round((40 * 315) / 450)); // 28
  });
  it('deducts 1 point per 2 minutes of overrun', () => {
    const tight = { ...mini, availableMinutes: 345 }; // target 258.75; total 365 → 20 over
    const it = buildItinerary(tight, ['marjan', 'bacvice', 'salona', 'klis'], flatLeg);
    const s = scoreTime(tight, it);
    expect(s.data.overrunMinutes).toBe(20);
    expect(s.points).toBe(30);
    expect(s.detail).toMatch(/overran/);
  });
  it('never goes below zero', () => {
    const tiny = { ...mini, availableMinutes: 60 };
    const it = buildItinerary(tiny, ['omis', 'krka', 'trogir', 'diocletians-palace'], flatLeg);
    expect(scoreTime(tiny, it).points).toBe(0);
  });
});

describe('scoring — budget (25)', () => {
  const at = (totalCost, budget = 100) =>
    scoreBudget({ budget }, { totals: { totalCost } }).points;
  it('awards 20 + reserve bonus inside budget', () => {
    expect(at(100)).toBe(20); // no reserve
    expect(at(90)).toBe(23); // €10 of €20 reserve → +2.5 → 22.5 → 23
    expect(at(80)).toBe(25); // full reserve
    expect(at(0)).toBe(25); // capped
  });
  it('falls linearly to zero at 25% over', () => {
    expect(at(110)).toBe(12); // 20 × (1 − 10/25) = 12
    expect(at(125)).toBe(0);
    expect(at(500)).toBe(0);
  });
});

describe('scoring — route (20)', () => {
  it('awards full marks for the fastest order', () => {
    const first = scorePlan(classic, ['marjan', 'salona', 'bacvice', 'diocletians-palace']);
    const fastest = first.components.find((c) => c.id === 'route').data.optimalOrder;
    const route = scorePlan(classic, fastest).components.find((c) => c.id === 'route');
    expect(route.points).toBe(20);
    expect(route.data.actual).toBe(route.data.optimal);
    expect(route.detail).toMatch(/fastest order/);
  });
  it('penalises a zig-zag order in proportion to wasted travel', () => {
    const zig = scorePlan(classic, ['salona', 'diocletians-palace', 'klis', 'bacvice']);
    const route = zig.components.find((c) => c.id === 'route');
    expect(route.data.actual).toBeGreaterThan(route.data.optimal);
    expect(route.points).toBe(Math.round((20 * route.data.optimal) / route.data.actual));
    expect(route.points).toBeLessThan(20);
  });
  it('is independent of the time & budget limits', () => {
    const ids = ['trogir', 'krka', 'omis', 'klis'];
    const a = scoreRoute(classic, buildItinerary(classic, ids));
    const b = scoreRoute({ ...classic, availableMinutes: 9999, budget: 9999 }, buildItinerary(classic, ids));
    expect(a.points).toBe(b.points);
  });
});

describe('scoring — mission (15)', () => {
  it('splits points equally between requirements', () => {
    const all = scoreMission(classic, buildItinerary(classic, ['diocletians-palace', 'bacvice', 'salona', 'marjan']));
    expect(all.points).toBe(15);
    expect(all.data.met).toBe(3);
    // history ✓, nature ✗ (no nature), finish at viewpoint ✓ (Klis)
    const two = scoreMission(classic, buildItinerary(classic, ['diocletians-palace', 'bacvice', 'salona', 'klis']));
    expect(two.data.met).toBe(2);
    expect(two.points).toBe(10);
    const none = scoreMission(classic, buildItinerary(classic, ['bacvice']));
    expect(none.data.met).toBe(0);
    expect(none.points).toBe(0);
  });
});

describe('scorePlan', () => {
  it('requires exactly 4 distinct cards from the challenge', () => {
    expect(() => scorePlan(classic, ['marjan', 'bacvice', 'salona'])).toThrow(/exactly 4/);
    expect(() => scorePlan(classic, ['marjan', 'bacvice', 'salona', 'klis', 'krka'])).toThrow(/exactly 4/);
    expect(() => scorePlan(classic, ['marjan', 'marjan', 'salona', 'klis'])).toThrow(/twice/);
    const other = { ...classic, cardIds: classic.cardIds.filter((id) => id !== 'krka') };
    expect(() => scorePlan(other, ['marjan', 'bacvice', 'salona', 'krka'])).toThrow(/not part/);
  });

  it('total equals the sum of the four components and stays in 0–100', () => {
    for (const c of CHALLENGES) {
      for (const { result } of allPlans(c)) {
        const sum = result.components.reduce((s, x) => s + x.points, 0);
        expect(result.total).toBe(sum);
        expect(result.total).toBeGreaterThanOrEqual(0);
        expect(result.total).toBeLessThanOrEqual(100);
        result.components.forEach((x) => {
          expect(x.points).toBeGreaterThanOrEqual(0);
          expect(x.points).toBeLessThanOrEqual(x.max);
          expect(Number.isInteger(x.points)).toBe(true);
        });
      }
    }
  });

  it('component maxima are 40 / 25 / 20 / 15', () => {
    const r = scorePlan(classic, ['diocletians-palace', 'bacvice', 'salona', 'marjan']);
    expect(r.components.map((c) => [c.id, c.max])).toEqual([
      ['time', 40],
      ['budget', 25],
      ['route', 20],
      ['mission', 15],
    ]);
    expect(SCORING.TIME_MAX + SCORING.BUDGET_MAX + SCORING.ROUTE_MAX + SCORING.MISSION_MAX).toBe(100);
  });

  it('is deterministic', () => {
    const order = ['klis', 'salona', 'bacvice', 'marjan'];
    const a = scorePlan(classic, order);
    const b = scorePlan(classic, order.slice());
    expect(a.total).toBe(b.total);
    expect(a.components).toEqual(b.components);
  });

  it('explains every component in plain words', () => {
    const r = scorePlan(classic, ['krka', 'omis', 'trogir', 'klis']);
    r.components.forEach((c) => expect(c.detail.length).toBeGreaterThan(10));
    expect(r.valid).toBe(false);
  });

  it('maps totals to ratings', () => {
    expect(ratingFor(100).title).toBe('Local legend');
    expect(ratingFor(85).title).toBe('Seasoned explorer');
    expect(ratingFor(0).title).toBe('Lost in the lanes');
  });
});

describe('solver & balance', () => {
  it('enumerates C(8,4) × 4! plans', () => {
    expect(allPlans(classic)).toHaveLength(1680);
    expect(permutations([1, 2, 3, 4])).toHaveLength(24);
    expect(combinations([1, 2, 3, 4, 5, 6, 7, 8], 4)).toHaveLength(70);
  });

  it('every challenge has a valid, high-scoring best plan', () => {
    for (const c of CHALLENGES) {
      const best = bestPlan(c);
      expect(best.result.valid).toBe(true);
      expect(best.result.total).toBeGreaterThanOrEqual(90);
      const mission = best.result.components.find((x) => x.id === 'mission');
      expect(mission.points).toBe(15);
    }
  });

  it('Krka is a trap in the 8-hour classic (any plan with it overruns)', () => {
    for (const { order, result } of allPlans(classic)) {
      if (order.includes('krka')) expect(result.itinerary.constraints.timeOk).toBe(false);
    }
  });

  it('there is real skill: a wide spread of scores', () => {
    const totals = allPlans(classic).map((p) => p.result.total);
    expect(Math.min(...totals)).toBeLessThan(40);
    expect(Math.max(...totals)).toBeGreaterThanOrEqual(95);
  });

});

describe('selection rules', () => {
  it('allows at most 4 picks and toggles off', () => {
    let sel = [];
    for (const id of ['marjan', 'bacvice', 'salona', 'klis']) {
      const r = toggleSelection(sel, id, classic);
      expect(r.status).toBe('added');
      sel = r.selection;
    }
    expect(isComplete(sel, classic)).toBe(true);
    const full = toggleSelection(sel, 'krka', classic);
    expect(full.status).toBe('full');
    expect(full.selection).toBe(sel);
    const removed = toggleSelection(sel, 'bacvice', classic);
    expect(removed.status).toBe('removed');
    expect(removed.selection).toEqual(['marjan', 'salona', 'klis']);
    expect(toggleSelection(sel, 'dubrovnik', classic).status).toBe('invalid');
  });
  it('reorders immutably and ignores bad indices', () => {
    const list = ['a', 'b', 'c', 'd'];
    expect(moveItem(list, 0, 3)).toEqual(['b', 'c', 'd', 'a']);
    expect(moveItem(list, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
    expect(moveItem(list, 0, 9)).toEqual(list);
    expect(list).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('game flow reducer', () => {
  const run = (state, ...actions) => actions.reduce((s, a) => gameReducer(s, a, classic), state);

  it('walks intro → pick → arrange → results', () => {
    let s = createInitialState(classic);
    expect(s.screen).toBe('intro');
    s = run(s, { type: 'START' });
    expect(s.screen).toBe('pick');
    s = run(s, { type: 'GO_ARRANGE' });
    expect(s.screen).toBe('pick'); // blocked until 4 picks
    s = run(
      s,
      { type: 'TOGGLE', id: 'marjan' },
      { type: 'TOGGLE', id: 'bacvice' },
      { type: 'TOGGLE', id: 'salona' },
      { type: 'TOGGLE', id: 'diocletians-palace' },
      { type: 'GO_ARRANGE' },
    );
    expect(s.screen).toBe('arrange');
    s = run(s, { type: 'MOVE', from: 3, to: 0 }, { type: 'MOVE', from: 1, to: 3 });
    expect(s.selection).toEqual(['diocletians-palace', 'bacvice', 'salona', 'marjan']);
    s = run(s, { type: 'BACK' });
    expect(s.screen).toBe('pick');
    s = run(s, { type: 'GO_ARRANGE' }, { type: 'SUBMIT' });
    expect(s.screen).toBe('results');
    expect(s.submitted).toBe(true);
  });

  it('cannot submit an incomplete plan', () => {
    const s = run(createInitialState(classic), { type: 'START' }, { type: 'TOGGLE', id: 'marjan' }, { type: 'SUBMIT' });
    expect(s.screen).toBe('pick');
  });

  it('restores a saved result and supports practice replays', () => {
    const saved = { challengeId: classic.id, order: ['diocletians-palace', 'bacvice', 'salona', 'marjan'] };
    let s = createInitialState(classic, saved);
    expect(s.screen).toBe('results');
    s = run(s, { type: 'PRACTICE' });
    expect(s).toMatchObject({ screen: 'pick', selection: [], practice: true });
    s = run(s, { type: 'HOME' }, { type: 'VIEW_OFFICIAL', order: saved.order });
    expect(s).toMatchObject({ screen: 'results', practice: false, selection: saved.order });
    expect(run(s, { type: 'VIEW_OFFICIAL', order: ['marjan'] })).toBe(s);
    // a stale save from another challenge is ignored
    expect(createInitialState(classic, { ...saved, challengeId: 'other' }).screen).toBe('intro');
  });
});

describe('share text', () => {
  it('summarises score without revealing the stops', () => {
    const result = scorePlan(classic, ['diocletians-palace', 'bacvice', 'salona', 'marjan']);
    const text = buildShareText({ number: 7, challenge: classic, result, url: 'https://example.com' });
    expect(text).toContain('A Day in Croatia #7 · Split');
    expect(text).toContain(`${result.total}/100`);
    expect(text).toContain('🏛️ → 🏖️ → 🏛️ → 🌲');
    expect(text).not.toMatch(/Marjan|Salona|Bačvice/);
    expect(text.trim().endsWith('https://example.com')).toBe(true);
    expect(scoreBar(20, 20)).toBe('🟦🟦🟦🟦🟦');
    expect(scoreBar(0, 20)).toBe('⬜⬜⬜⬜⬜');
  });
});
