// Proves every ending is reachable through actual gameplay: searches real runs
// (legal choices only, real engine, real dice) until each ending has been
// reached, then saves the seed + exact choice sequence so tests can replay it.
//   node scripts/adventure-endings.mjs            → writes tests/fixtures/ending-paths.json
import { writeFileSync } from 'node:fs';
import { newGame, getStep, choose, rng } from '../src/adventure/engine/game.js';
import { ENDINGS } from '../src/adventure/data/story.js';
import { STRATEGIES } from './adventure-sim.mjs';

const names = Object.keys(STRATEGIES);
const found = {};
const tries = {};
for (let i = 0; i < 200000 && Object.keys(found).length < ENDINGS.length; i++) {
  const strat = names[i % names.length];
  const seed = `free-path-${i}`;
  let s = newGame({ seed, mode: 'free' });
  const choices = [];
  let g = 0;
  while (!s.ended && g++ < 60) {
    const ok = getStep(s).choices.filter((c) => !c.disabled);
    const c = STRATEGIES[strat](ok, rng(`path${i}`, g));
    choices.push(c.id);
    s = choose(s, c.id).state;
  }
  tries[s.ending] = (tries[s.ending] ?? 0) + 1;
  // keep the shortest-seed example per ending; prefer runs that did not collapse early
  if (!found[s.ending]) found[s.ending] = { seed, strategy: strat, choices, route: s.route, money: s.money, happiness: s.happiness, energy: s.energy, local: s.local };
}
const missing = ENDINGS.filter((e) => !found[e.id]).map((e) => e.id);
writeFileSync('tests/fixtures/ending-paths.json', `${JSON.stringify(found, null, 2)}\n`);
console.log(Object.entries(found).map(([k, v]) => `${k.padEnd(9)} ${v.strategy.padEnd(8)} ${v.seed} · ${v.choices.length} decisions · ${v.route.join(' → ')}`).join('\n'));
if (missing.length) {
  console.error('UNREACHED:', missing);
  process.exit(1);
}
