// Prints a full readable transcript of one Croatia Adventure run.
//   node scripts/adventure-transcript.mjs <seed> <strategy: first|last|cheap|fun|local|bad|car|island>
import { newGame, getStep, choose, computeScore } from '../src/adventure/engine/game.js';
import { ENDINGS } from '../src/adventure/data/story.js';
import { reportCard } from '../src/adventure/engine/report.js';
const [seed = 'demo', strat = 'first'] = process.argv.slice(2);
const score = (c, k) => c.effects?.[k] ?? 0;
const pickers = {
  first: (ok) => ok[0],
  last: (ok) => ok[ok.length - 1],
  cheap: (ok) => [...ok].sort((a, b) => a.cost - b.cost)[0],
  fun: (ok) => [...ok].sort((a, b) => score(b, 'happiness') + score(b, 'adventure') - score(a, 'happiness') - score(a, 'adventure'))[0],
  local: (ok) => [...ok].sort((a, b) => score(b, 'local') - score(a, 'local'))[0],
  bad: (ok) => [...ok].sort((a, b) => score(a, 'happiness') + score(a, 'energy') - score(b, 'happiness') - score(b, 'energy'))[0],
  car: (ok) => ok.find((c) => c.id === 'car' || c.id === 'boutique') ?? ok[0],
  island: (ok) => ok.find((c) => /hvar|brac|island|stay-island|cat-|ferry/.test(c.id)) ?? ok[0],
};
let s = newGame({ seed });
const out = [];
while (!s.ended) {
  const st = getStep(s);
  const ok = st.choices.filter((c) => !c.disabled);
  const c = (pickers[strat] ?? pickers.first)(ok);
  out.push(`\n## ${st.kind ? `[${st.kind.toUpperCase()}] ` : ''}${st.title}  [day ${s.day} ${s.phase}] €${s.money} ⚡${s.energy} 🙂${s.happiness}`);
  out.push(st.prompt);
  for (const x of st.choices) out.push(`  ${x.id === c.id ? '▶' : ' '} ${x.label}${x.disabled ? ' (disabled)' : ''}`);
  const r = choose(s, c.id);
  out.push(`  → ${r.outcome.text}`);
  if (r.outcome.duje) out.push(`  💬 Duje: ${r.outcome.duje}`);
  if (r.outcome.moment) out.push(`  📝 ${r.outcome.moment.text}`);
  if (r.outcome.night?.line) out.push(`  🌙 Duje: ${r.outcome.night.line}`);
  out.push(`    ${JSON.stringify(r.outcome.deltas)}${r.outcome.tip ? `  📇 ${r.outcome.tip.title}` : ''}${r.outcome.night ? `  🌙 ${JSON.stringify(r.outcome.night)}` : ''}`);
  s = r.state;
}
const e = ENDINGS.find((x) => x.id === s.ending);
out.push(`\n=== ENDING: ${e.title} · score ${computeScore(s).total} · €${s.money} ⚡${s.energy} 🙂${s.happiness} · tips ${s.tipsFound.length} · route ${s.route.join(' → ')}`);
out.push(e.epilogue);
const rc = reportCard(s);
out.push(`REPORT: “${rc.verdict}”`);
out.push(`TITLE: “${rc.title}”`);
rc.diary.forEach((d) => out.push(`  Day ${d.day} · ${d.place}: ${d.text}`));
rc.highlights.forEach((h) => out.push(`  • ${h}`));
console.log(out.join('\n'));
