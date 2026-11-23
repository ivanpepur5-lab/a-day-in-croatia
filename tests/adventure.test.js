import { describe, it, expect, beforeEach } from 'vitest';
import {
  DESTINATIONS,
  BASES,
  TRAVEL,
  DAY4,
  DAY5,
  ACTIVITIES,
  EVENTS,
  ACHIEVEMENTS,
  ENDINGS,
  START,
} from '../src/adventure/data/story.js';
import { TIPS, TIPS_BY_ID, TIP_CATEGORIES } from '../src/adventure/data/tips.js';
import { newGame, getStep, choose, computeScore, rng, pickEvent, BALANCE, txt } from '../src/adventure/engine/game.js';
import { loadProgress, collect, recordRun, saveCurrent } from '../src/adventure/services/progress.js';
import { buildAdventureShareText } from '../src/adventure/services/shareCard.js';
import TRAVEL_DATA from '../src/data/travel-data.json' with { type: 'json' };

const allChoices = () => [
  ...BASES,
  ...Object.values(TRAVEL).flatMap((d) => d.choices),
  ...Object.values(DAY4),
  ...Object.values(DAY5),
  ...Object.values(ACTIVITIES).flat(),
  ...EVENTS.flatMap((e) => e.choices),
];

/** Play a whole run with a deterministic picker. */
function play(seed, pick = (ok, i) => ok[Math.floor(rng('t', seed, i) * ok.length)]) {
  let s = newGame({ seed });
  const outcomes = [];
  for (let i = 0; i < 40 && !s.ended; i++) {
    const step = getStep(s);
    const ok = step.choices.filter((c) => !c.disabled);
    expect(ok.length, `dead end at ${s.phase} day ${s.day}`).toBeGreaterThan(0);
    const r = choose(s, pick(ok, i, step).id);
    s = r.state;
    outcomes.push(r.outcome);
  }
  return { s, outcomes };
}

describe('content', () => {
  it('has the required scope: 7 destinations, ≥20 events, ≥5 endings, 6 achievements', () => {
    expect(Object.keys(DESTINATIONS)).toEqual(['split', 'trogir', 'omis', 'krka', 'hvar', 'brac', 'dubrovnik']);
    expect(EVENTS.length).toBeGreaterThanOrEqual(20);
    expect(ENDINGS.length).toBeGreaterThanOrEqual(5);
    expect(ENDINGS.map((e) => e.title)).toEqual(
      expect.arrayContaining(['Croatia Legend', 'Budget Master', 'Island Explorer', 'Local Insider', 'Tourist Disaster']),
    );
    expect(ACHIEVEMENTS.map((a) => a.title)).toEqual([
      'Konoba Expert', 'Island Survivor', 'Local Explorer', 'Market Master', 'Budget Genius', 'Croatian Legend',
    ]);
    expect(START).toMatchObject({ money: 500, energy: 100, happiness: 50, days: 5 });
  });

  // a state in which every story callback has something to talk about
  const sample = {
    ...newGame({ seed: 'sample' }),
    day: 3,
    location: 'hvar',
    base: 'apartment',
    route: ['split', 'trogir', 'hvar'],
    visited: ['split', 'trogir', 'hvar'],
    flags: { marija: true, pekaOrdered: true, pekaDay: 2, pekaPlace: 'trogir', bigFish: true, phrases: 1 },
  };

  it('every event offers 2–3 choices, and every choice has a result and consequences', () => {
    for (const e of EVENTS) {
      expect(e.choices.length, e.id).toBeGreaterThanOrEqual(2);
      expect(e.choices.length, e.id).toBeLessThanOrEqual(3);
      expect(txt(e.story, sample).length, e.id).toBeGreaterThan(40);
    }
    for (const c of allChoices()) {
      const branches = c.chance ? [c.chance.success, c.chance.fail] : [c];
      for (const b of branches) {
        expect(txt(b.result, sample)?.length, c.id).toBeGreaterThan(20);
        expect(Object.keys(b.effects ?? {}).length + Object.keys(b.flags ?? {}).length, `${c.id} has no consequence`).toBeGreaterThan(0);
      }
    }
  });

  it('every destination has at least three activities', () => {
    for (const d of Object.keys(DESTINATIONS)) expect(ACTIVITIES[d].length, d).toBeGreaterThanOrEqual(3);
  });

  it('every tip referenced by the story exists, and every tip can be collected', () => {
    const referenced = new Set(allChoices().map((c) => c.tip).filter(Boolean));
    for (const id of referenced) expect(TIPS_BY_ID[id], id).toBeTruthy();
    for (const t of TIPS) expect(referenced.has(t.id), `tip ${t.id} is never awarded`).toBe(true);
  });
});

describe('Local Insider tips are accurate by construction', () => {
  it('use the seven categories and always explain why they matter', () => {
    expect(Object.values(TIP_CATEGORIES).map((c) => c.label)).toEqual([
      'Local Secrets', 'Tourist Traps', 'Dalmatian Life', 'Food & Drinks', 'Island Life', 'Survival Mode', 'Hidden Croatia',
    ]);
    for (const t of TIPS) {
      expect(TIP_CATEGORIES[t.category], t.id).toBeTruthy();
      expect(t.title && t.tip && t.why, t.id).toBeTruthy();
      expect(new Set(TIPS.map((x) => x.id)).size).toBe(TIPS.length);
    }
    for (const c of Object.keys(TIP_CATEGORIES)) expect(TIPS.some((t) => t.category === c), c).toBe(true);
  });

  it('verified tips point to an audited official source with a date', () => {
    for (const t of TIPS.filter((x) => x.verification.status === 'verified')) {
      const v = t.verification;
      for (const id of [v.source, ...(v.alsoSources ?? [])]) {
        expect(TRAVEL_DATA.sources[id], `${t.id}: unknown source ${id}`).toBeTruthy();
        expect(TRAVEL_DATA.sources[id].url).toMatch(/^https:\/\//);
      }
      expect(v.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('editorial tips contain no prices, times, durations or distances (those must be verified)', () => {
    const NUMBERS = /€\s?\d|\d\s?€|\b\d{1,2}[:.]\d{2}\b|\b\d+\s?(km|min|mins|minutes|hours?|h|euros?|kn)\b/i;
    for (const t of TIPS.filter((x) => x.verification.status === 'editorial')) {
      expect(NUMBERS.test(`${t.tip} ${t.why}`), `${t.id}: "${t.tip}"`).toBe(false);
    }
  });

  it('every price mentioned in a tip is a verified one', () => {
    for (const t of TIPS) {
      if (/€\s?\d/.test(t.tip)) expect(t.verification.status, t.id).toBe('verified');
    }
  });

  it('the story never claims real prices: in-game money is labelled fictional in the data file', async () => {
    const src = await import('node:fs').then((fs) => fs.readFileSync('src/adventure/data/story.js', 'utf8'));
    expect(src).toMatch(/simplified game values, NOT real prices/);
  });
});

describe('engine', () => {
  it('starts with the specified stats and walks base → 5 × (travel, activity, event) → ending', () => {
    let s = newGame({ seed: 'x' });
    expect(s).toMatchObject({ money: 500, energy: 100, happiness: 50, adventure: 0, phase: 'base', day: 0 });
    const phases = [];
    while (!s.ended) {
      phases.push(`${s.day}:${s.phase}`);
      const ok = getStep(s).choices.filter((c) => !c.disabled);
      s = choose(s, ok[0].id).state;
    }
    expect(phases[0]).toBe('0:base');
    expect(phases).toContain('5:event');
    expect(phases.filter((p) => p.endsWith('travel')).length).toBe(5);
    expect(s.ending).toBeTruthy();
    expect(s.route.length).toBe(5);
  });

  it('is deterministic: same seed + same choices → identical game', () => {
    const a = play('daily-2026-11-23');
    const b = play('daily-2026-11-23');
    expect(a.s).toEqual(b.s);
    expect(a.outcomes.map((o) => o.text)).toEqual(b.outcomes.map((o) => o.text));
  });

  it('daily players get the same event for the same situation, other seeds may differ', () => {
    const base = { ...newGame({ seed: 'daily-2026-11-23' }), day: 2, location: 'omis', phase: 'event' };
    expect(pickEvent(base).id).toBe(pickEvent({ ...base }).id);
    const ids = new Set(Array.from({ length: 40 }, (_, i) => pickEvent({ ...base, seed: `s${i}` }).id));
    expect(ids.size).toBeGreaterThan(1);
  });

  it('never mutates the previous state', () => {
    const s0 = newGame({ seed: 'm' });
    const snap = JSON.stringify(s0);
    choose(s0, 'hostel');
    expect(JSON.stringify(s0)).toBe(snap);
  });

  it('applies consequences, the overnight bed cost and the balance rules', () => {
    let s = newGame({ seed: 'n' });
    s = choose(s, 'apartment').state; // nightly 45, recover 30
    const r = choose(s, 'taxi'); // −€45 money, energy −3 (×1.25 → −4)
    expect(r.state.money).toBe(500 - 45);
    expect(r.outcome.deltas.money).toBe(-45);
    expect(r.state.energy).toBe(100 - Math.round(3 * BALANCE.energyCost));
    expect(r.outcome.tip.id).toBe('airport-in-kastela');
    // finish day 1 and check the night
    let st = r.state;
    st = choose(st, getStep(st).choices.find((c) => !c.disabled).id).state;
    const ev = choose(st, getStep(st).choices.find((c) => !c.disabled).id);
    expect(ev.outcome.night.paid).toBe(45);
    expect(ev.state.day).toBe(2);
  });

  it('blocks unaffordable choices and always leaves a way forward', () => {
    let s = newGame({ seed: 'broke' });
    s = choose(s, 'boutique').state;
    s = { ...s, money: 3 };
    const step = getStep(s);
    expect(step.choices.find((c) => c.id === 'taxi').disabled).toBe(true);
    expect(() => choose(s, 'taxi')).toThrow(/not affordable/);
    expect(step.choices.some((c) => !c.disabled)).toBe(true);
    const poor = { ...s, money: 0, phase: 'activity', day: 2, location: 'omis' };
    const choices = getStep(poor).choices;
    expect(choices.some((c) => !c.disabled)).toBe(true); // free option or the "improvise" fallback
  });

  it('sleeping without money is possible but hurts', () => {
    let s = newGame({ seed: 'rough' });
    s = choose(s, 'boutique').state;
    s = choose(s, 'bus').state;
    s = choose(s, getStep(s).choices.find((c) => c.cost === 0).id).state;
    s = { ...s, money: 10 };
    const ok = getStep(s).choices.filter((c) => !c.disabled).sort((a, b) => a.cost - b.cost);
    const r = choose(s, ok[0].id);
    expect(r.outcome.night.rough).toBe(true);
  });

  it('collapsing (energy 0) ends the holiday immediately as a Tourist Disaster', () => {
    let s = newGame({ seed: 'c' });
    s = choose(s, 'hostel').state;
    s = { ...s, energy: 3 };
    const r = choose(s, 'bus'); // −10 energy
    expect(r.state.ended).toBe(true);
    expect(r.state.ending).toBe('disaster');
  });
});

describe('gameplay loop over thousands of runs', () => {
  const strategies = {
    random: (ok, i, step, seed) => ok[Math.floor(rng('r', seed, i) * ok.length)],
    cheap: (ok) => [...ok].sort((a, b) => a.cost - b.cost)[0],
    fun: (ok) => [...ok].sort((a, b) => (b.effects?.happiness ?? 0) + (b.effects?.adventure ?? 0) - (a.effects?.happiness ?? 0) - (a.effects?.adventure ?? 0))[0],
    local: (ok) => [...ok].sort((a, b) => (b.effects?.local ?? 0) - (a.effects?.local ?? 0))[0],
    bad: (ok) => [...ok].sort((a, b) => (a.effects?.happiness ?? 0) + (a.effects?.energy ?? 0) - (b.effects?.happiness ?? 0) - (b.effects?.energy ?? 0))[0],
  };
  const endings = {};
  const events = new Set();
  const achievements = new Set();
  const tips = new Set();
  let runs = 0;
  for (const [name, pick] of Object.entries(strategies)) {
    for (let i = 0; i < 500; i++) {
      const seed = `${name}-${i}`;
      const { s, outcomes } = play(seed, (ok, j, step) => pick(ok, j, step, seed));
      runs++;
      endings[s.ending] = (endings[s.ending] ?? 0) + 1;
      s.seenEvents.forEach((e) => events.add(e));
      s.achievements.forEach((a) => achievements.add(a));
      s.tipsFound.forEach((t) => tips.add(t));
      if (i === 0) {
        it(`${name}: stats stay in range and the run ends`, () => {
          expect(s.ended).toBe(true);
          expect(s.energy).toBeGreaterThanOrEqual(0);
          expect(s.energy).toBeLessThanOrEqual(100);
          expect(s.happiness).toBeGreaterThanOrEqual(0);
          expect(s.happiness).toBeLessThanOrEqual(100);
          expect(s.money).toBeGreaterThanOrEqual(0);
          expect(outcomes.length).toBeLessThanOrEqual(16);
          expect(computeScore(s).total).toBeGreaterThan(0);
        });
      }
    }
  }
  it('every ending is reachable', () => {
    for (const e of ENDINGS) expect(endings[e.id] ?? 0, e.id).toBeGreaterThan(0);
  });
  it('no single ending dominates', () => {
    for (const e of ENDINGS) expect((endings[e.id] ?? 0) / runs, e.id).toBeLessThan(0.5);
  });
  it('every event, achievement and tip is reachable', () => {
    expect([...EVENTS.map((e) => e.id)].filter((id) => !events.has(id))).toEqual([]);
    expect(ACHIEVEMENTS.map((a) => a.id).filter((id) => !achievements.has(id))).toEqual([]);
    expect(TIPS.map((t) => t.id).filter((id) => !tips.has(id))).toEqual([]);
  });
});

describe('progress & sharing', () => {
  beforeEach(() => localStorage.clear());
  it('collects tips and achievements across runs without duplicates', () => {
    expect(collect({ tips: ['fjaka', 'peka'] }).newTips).toEqual(['fjaka', 'peka']);
    expect(collect({ tips: ['peka', 'klapa'], achievements: ['konoba-expert'] })).toEqual({ newTips: ['klapa'], newAch: ['konoba-expert'] });
    expect(loadProgress().tips).toEqual(['fjaka', 'peka', 'klapa']);
  });
  it('records only the first daily result and autosaves runs', () => {
    const { s } = play('daily-2026-11-23');
    const daily = { ...s, mode: 'daily' };
    saveCurrent(daily);
    expect(loadProgress().current.seed).toBe('daily-2026-11-23');
    recordRun({ state: daily, score: 900, dateKey: '2026-11-23' });
    recordRun({ state: { ...daily, ending: 'happy' }, score: 100, dateKey: '2026-11-23' });
    const p = loadProgress();
    expect(p.daily['2026-11-23'].score).toBe(900);
    expect(p.runs).toBe(2);
    expect(p.current).toBeFalsy();
  });
  it('share text summarises the run and never contains a local URL', () => {
    const { s } = play('share');
    const text = buildAdventureShareText({ state: { ...s, mode: 'daily' }, score: 1000, number: 23, url: '' });
    expect(text).toMatch(/^Croatia Adventure #23/);
    expect(text).toContain('1000 pts');
    expect(text).not.toMatch(/localhost|http/);
  });
});

describe('story memory and consequences', () => {
  /** Force specific choices where available, otherwise take the first affordable one. */
  function playWith(seed, prefer) {
    let s = newGame({ seed });
    const seen = [];
    for (let i = 0; i < 40 && !s.ended; i++) {
      const step = getStep(s);
      const ok = step.choices.filter((c) => !c.disabled);
      const c = ok.find((x) => prefer.includes(x.id)) ?? ok[0];
      if (step.phase === 'event') seen.push(step.event.id);
      s = choose(s, c.id).state;
    }
    return { s, seen };
  }

  it('a bad decision comes back later: the three-kilo fish is remembered along the coast', () => {
    let hits = 0;
    for (let i = 0; i < 60; i++) {
      const { s, seen } = playWith(`fish-${i}`, ['apartment', 'bus', 'palace', 'point-big', 'to-trogir', 'own-it']);
      if (s.flags.bigFish) {
        if (seen.includes('fish-reunion')) hits++;
      }
    }
    expect(hits).toBeGreaterThan(0);
  });

  it('a scraped mirror leads to a call from the rental company', () => {
    let calls = 0;
    for (let i = 0; i < 60; i++) {
      const { s, seen } = playWith(`car-${i}`, ['hostel', 'car', 'push-on', 'goat']);
      if (s.flags.mirror && seen.includes('mirror-inspection')) calls++;
    }
    expect(calls).toBeGreaterThan(0);
  });

  it('Duje’s lines change with your history', () => {
    const base = { ...newGame({ seed: 'm' }), day: 2, phase: 'travel', base: 'apartment', location: 'split', visited: ['split'], route: ['split'] };
    const plain = getStep(base).prompt;
    const afterFish = getStep({ ...base, flags: { bigFish: true } }).prompt;
    expect(plain).toMatch(/Marija next door/);
    expect(afterFish).toMatch(/fish invoice/);
    expect(afterFish).not.toBe(plain);
  });

  it('memorable choices land on the holiday report card, ranked', async () => {
    const { reportCard } = await import('../src/adventure/engine/report.js');
    const s = {
      ...newGame({ seed: 'r' }),
      ended: true,
      ending: 'fish',
      moments: [
        { id: 'urchin', text: 'Stepped on a sea urchin', rank: 6, day: 2 },
        { id: 'big-fish', text: 'Ordered a fish the size of a toddler', rank: 10, day: 1 },
        { id: 'graz', text: 'Lost a splash fight', rank: 4, day: 3 },
        { id: 'rakija', text: 'Accepted rakija', rank: 4, day: 4 },
      ],
      flags: { coffeeHours: 3, rakija: 1 },
    };
    const r = reportCard(s);
    expect(r.highlights).toEqual(['Ordered a fish the size of a toddler', 'Stepped on a sea urchin', 'Lost a splash fight']);
    expect(r.verdict.length).toBeGreaterThan(20);
    expect(r.stats.find((x) => x.icon === '☕').value).toBe(3);
  });

  it('every ending has a shareable verdict and every choice that matters has Duje’s reaction or a tip', () => {
    for (const e of ENDINGS) expect(e.verdict?.length, e.id).toBeGreaterThan(20);
    const silent = allChoices().filter((c) => !c.duje && !c.tip);
    expect(silent.map((c) => c.id)).toEqual([]);
  });

  it('running out of money on a travel day keeps you where you are (no broken route)', () => {
    let s = newGame({ seed: 'broke-travel' });
    s = choose(s, 'boutique').state;
    s = choose(s, 'bus').state;
    s = choose(s, getStep(s).choices.filter((c) => !c.disabled)[0].id).state;
    s = choose(s, getStep(s).choices.filter((c) => !c.disabled).sort((a, b) => a.cost - b.cost)[0].id).state;
    s = { ...s, money: 0 };
    const step = getStep(s);
    expect(step.phase).toBe('travel');
    const broke = step.choices.find((c) => c.id === 'broke');
    expect(broke).toBeTruthy();
    const next = choose(s, 'broke').state;
    expect(next.route.at(-1)).toBe('split');
    expect(next.route.every(Boolean)).toBe(true);
    expect(next.phase).toBe('activity');
  });
});
