// Balance simulator for Croatia Adventure: plays thousands of runs with different strategies.
//   node scripts/adventure-sim.mjs [runs]
import { newGame, getStep, choose, computeScore, rng } from '../src/adventure/engine/game.js';
import { EVENTS, ACHIEVEMENTS } from '../src/adventure/data/story.js';
import { TIPS } from '../src/adventure/data/tips.js';
const N = +process.argv[2] || 20000;
const byStrat = {}; const endings = {}, events = {}, ach = {}, tips = new Set(); let scores = []; let steps = 0;
const strategies = ['random', 'cheap', 'fun', 'local', 'bad'];
for (let i = 0; i < N; i++) {
  const strat = strategies[i % 5]; byStrat[strat] ??= {}; 
  let s = newGame({ seed: 'sim' + i });
  let guard = 0;
  while (!s.ended && guard++ < 40) {
    const st = getStep(s);
    const ok = st.choices.filter((c) => !c.disabled);
    if (!ok.length) throw new Error('dead end ' + JSON.stringify(st));
    let c;
    const r = rng('pick' + i, guard);
    if (strat === 'random') c = ok[Math.floor(r * ok.length)];
    else if (strat === 'cheap') c = [...ok].sort((a, b) => a.cost - b.cost)[Math.floor(r * Math.min(2, ok.length))];
    else if (strat === 'fun') c = [...ok].sort((a, b) => (b.effects?.happiness ?? 0) + (b.effects?.adventure ?? 0) - (a.effects?.happiness ?? 0) - (a.effects?.adventure ?? 0))[0];
    else if (strat === 'local') c = [...ok].sort((a, b) => (b.effects?.local ?? 0) - (a.effects?.local ?? 0))[r < 0.8 ? 0 : ok.length - 1];
    else c = [...ok].sort((a, b) => ((a.effects?.happiness ?? 0) + (a.effects?.energy ?? 0) + (a.effects?.money ?? 0) / 4) - ((b.effects?.happiness ?? 0) + (b.effects?.energy ?? 0) + (b.effects?.money ?? 0) / 4))[0];
    if (st.phase === 'event') events[st.event.id] = (events[st.event.id] ?? 0) + 1;
    const res = choose(s, c.id); s = res.state; steps++;
    if (res.outcome.tip) tips.add(res.outcome.tip.id);
  }
  if (!s.ended) throw new Error('did not end');
  endings[s.ending] = (endings[s.ending] ?? 0) + 1; byStrat[strat][s.ending] = (byStrat[strat][s.ending] ?? 0) + 1;
  for (const a of s.achievements) ach[a] = (ach[a] ?? 0) + 1;
  scores.push(computeScore(s).total);
}
scores.sort((a, b) => a - b);
console.log('endings', endings); console.log(byStrat);
console.log('achievements', ach);
console.log('events seen', Object.keys(events).length, '/', EVENTS.length, 'missing:', EVENTS.filter(e => !events[e.id]).map(e => e.id));
console.log('tips reachable', tips.size, '/', TIPS.length, 'missing:', TIPS.filter(t => !tips.has(t.id)).map(t => t.id));
console.log('score p10/p50/p90/max', scores[N * 0.1 | 0], scores[N / 2 | 0], scores[N * 0.9 | 0], scores.at(-1), 'avg steps', steps / N);
