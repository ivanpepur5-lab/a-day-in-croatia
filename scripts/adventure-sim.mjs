// Balance & variety simulator for Croatia Adventure.
//   node scripts/adventure-sim.mjs [runs] [--json]
// Plays thousands of runs with six strategies and reports: ending distribution
// (overall and per strategy), event coverage and frequency, storyline
// completion, and how repetitive runs feel (event-set overlap between runs).
import { newGame, getStep, choose, computeScore, rng } from '../src/adventure/engine/game.js';
import { EVENTS, ENDINGS } from '../src/adventure/data/story.js';
import { TIPS } from '../src/adventure/data/tips.js';

const N = +process.argv[2] || 20000;
const MAIN = import.meta.url === `file://${process.argv[1]}`;
const JSON_OUT = process.argv.includes('--json');
const eff = (c, k) => c.effects?.[k] ?? (c.chance ? ((c.chance.success.effects?.[k] ?? 0) + (c.chance.fail.effects?.[k] ?? 0)) / 2 : 0);
export const STRATEGIES = {
  random: (ok, r) => ok[Math.floor(r * ok.length)],
  cheap: (ok, r) => [...ok].sort((a, b) => a.cost - b.cost)[Math.floor(r * Math.min(2, ok.length))],
  fun: (ok) => [...ok].sort((a, b) => eff(b, 'happiness') + eff(b, 'adventure') - eff(a, 'happiness') - eff(a, 'adventure'))[0],
  local: (ok, r) => [...ok].sort((a, b) => eff(b, 'local') - eff(a, 'local'))[r < 0.8 ? 0 : ok.length - 1],
  // "careful": avoids risks and keeps energy up, otherwise random
  careful: (ok, r) => {
    const safe = ok.filter((c) => !c.chance && eff(c, 'energy') >= -8);
    const pool = safe.length ? safe : ok;
    return pool[Math.floor(r * pool.length)];
  },
  // deliberately bad: lowest happiness + energy, highest cost
  bad: (ok) => [...ok].sort((a, b) => eff(a, 'happiness') + eff(a, 'energy') + eff(a, 'money') / 4 - (eff(b, 'happiness') + eff(b, 'energy') + eff(b, 'money') / 4))[0],
};
const names = Object.keys(STRATEGIES);

/** Storyline = trigger (state after the run) → payoff event. Payoff rate is measured only for runs that triggered it. */
const STORYLINES = {
  'Three-kilo fish': [(s) => s.flags.bigFish, 'fish-reunion'],
  'Rental mirror': [(s) => s.flags.mirror, 'mirror-inspection'],
  'Peka': [(s) => s.flags.pekaOrdered, 'peka-ready'],
  'Wedding aunt': [(s) => s.flags.wedding, 'wedding-aunt'],
  'Pirate grandpa': [(s) => s.flags.grandpa, 'pirate-nephew'],
  'Party boat': [(s) => s.flags.partyBoat, 'morning-after'],
  'Sunburn': [(s) => s.flags.sunburn, 'sunburn-revenge'],
  'Sea urchin': [(s) => s.flags.urchin, 'urchin-limp'],
  'Cousin Ante (3 meetings)': [(s) => (s.flags.ante ?? 0) >= 1, 'ante-reveal'],
  'Brian (Hawaiian shirt)': [(s) => s.flags.shirtMet, 'shirt-finale'],
  'Duje & Ivana': [(s) => s.flags.wingman, 'duje-date'],
  'Marija’s container': [(s) => s.flags.posuda !== undefined, 'posuda-return'],
  'Boćanje': [(s) => s.flags.bocce !== undefined, 'bocce-rematch'],
  'Pegica the dog': [(s) => s.flags.dogFriend, 'dawn-fishing'],
  'Sunglasses': [(s) => s.flags.noSunglasses !== undefined, 'squint-photos'],
  'The ham': [(s) => s.flags.prsut !== undefined, 'prsut-problem'],
  'Luka’s guitar': [(s) => s.flags.lukaGuitar, 'luka-returns'],
};

export function play(seed, strat, pickSeed = seed) {
  let s = newGame({ seed });
  let guard = 0;
  const seen = [];
  const tips = [];
  while (!s.ended && guard++ < 60) {
    const st = getStep(s);
    const ok = st.choices.filter((c) => !c.disabled);
    if (!ok.length) throw new Error(`dead end ${seed} ${st.phase}`);
    const c = STRATEGIES[strat](ok, rng(`pick${pickSeed}`, guard));
    if (st.event) seen.push(st.event.id);
    const res = choose(s, c.id);
    if (res.outcome.tip) tips.push(res.outcome.tip.id);
    s = res.state;
  }
  if (!s.ended) throw new Error('did not end');
  return { s, seen, tips, guard };
}

if (MAIN) main();

function main() {
const endings = {};
const byStrat = Object.fromEntries(names.map((n) => [n, { runs: 0, endings: {}, sets: [], steps: 0 }]));
const eventRuns = {};
const tipsSeen = new Set();
const storyStart = {};
const storyDone = {};
const scores = [];
let steps = 0;
for (let i = 0; i < N; i++) {
  const strat = names[i % names.length];
  const { s, seen, tips, guard } = play(`sim${i}`, strat, i);
  const b = byStrat[strat];
  b.runs++;
  b.steps += guard;
  steps += guard;
  b.endings[s.ending] = (b.endings[s.ending] ?? 0) + 1;
  endings[s.ending] = (endings[s.ending] ?? 0) + 1;
  if (b.sets.length < 300) b.sets.push(new Set(seen));
  for (const e of new Set(seen)) eventRuns[e] = (eventRuns[e] ?? 0) + 1;
  tips.forEach((t) => tipsSeen.add(t));
  for (const [name, [trigger, z]] of Object.entries(STORYLINES)) {
    if (trigger(s)) {
      storyStart[name] = (storyStart[name] ?? 0) + 1;
      if (seen.includes(z)) storyDone[name] = (storyDone[name] ?? 0) + 1;
    }
  }
  scores.push(computeScore(s).total);
}

const pct = (x, n) => `${((100 * x) / n).toFixed(1)}%`;
const jaccard = (sets) => {
  let tot = 0;
  let n = 0;
  for (let i = 0; i < sets.length; i++)
    for (let j = i + 1; j < sets.length; j++) {
      const a = sets[i];
      const b = sets[j];
      const inter = [...a].filter((x) => b.has(x)).length;
      tot += inter / (a.size + b.size - inter || 1);
      n++;
    }
  return tot / (n || 1);
};

scores.sort((a, b) => a - b);
const report = {
  runs: N,
  endings: Object.fromEntries(ENDINGS.map((e) => [e.id, pct(endings[e.id] ?? 0, N)])),
  byStrategy: Object.fromEntries(
    names.map((n) => [
      n,
      {
        endings: Object.fromEntries(Object.entries(byStrat[n].endings).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, pct(v, byStrat[n].runs)])),
        eventOverlap: jaccard(byStrat[n].sets).toFixed(3),
        avgDecisions: (byStrat[n].steps / byStrat[n].runs).toFixed(1),
      },
    ]),
  ),
  eventsSeen: `${Object.keys(eventRuns).length}/${EVENTS.length}`,
  neverSeen: EVENTS.filter((e) => !eventRuns[e.id]).map((e) => e.id),
  mostCommon: Object.entries(eventRuns).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => `${k} ${pct(v, N)}`),
  rarest: Object.entries(eventRuns).sort((a, b) => a[1] - b[1]).slice(0, 10).map(([k, v]) => `${k} ${pct(v, N)}`),
  storylines: Object.fromEntries(Object.keys(STORYLINES).map((k) => [k, `triggered in ${pct(storyStart[k] ?? 0, N)} of runs · paid off ${storyStart[k] ? pct(storyDone[k] ?? 0, storyStart[k]) : '—'}`])),
  tipsReachable: `${tipsSeen.size}/${TIPS.length}`,
  tipsMissing: TIPS.filter((t) => !tipsSeen.has(t.id)).map((t) => t.id),
  score: { p10: scores[(N * 0.1) | 0], p50: scores[(N / 2) | 0], p90: scores[(N * 0.9) | 0], max: scores.at(-1) },
  avgDecisions: (steps / N).toFixed(1),
};
console.log(JSON_OUT ? JSON.stringify(report, null, 2) : report);
}
