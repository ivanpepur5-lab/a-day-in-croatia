import { ENDINGS } from '../data/story.js';

/**
 * The holiday report card: the funniest, most specific things that happened
 * in this run, ranked. Built only from the player's own choices — every run
 * produces a different, shareable story.
 */
export function reportCard(state) {
  const ending = ENDINGS.find((e) => e.id === state.ending);
  const highlights = [...(state.moments ?? [])]
    .sort((a, b) => b.rank - a.rank || a.day - b.day)
    .slice(0, 3)
    .map((m) => m.text);

  const f = (k) => state.flags[k] ?? 0;
  const stats = [
    { icon: '☕', label: 'hours spent on coffee', value: f('coffeeHours') },
    { icon: '🥃', label: 'rakija toasts', value: f('rakija') },
    { icon: '🍷', label: 'konobas', value: f('konoba') },
    { icon: '🔎', label: 'hidden places', value: f('hidden') },
    { icon: '📇', label: 'local tips learned', value: state.tipsFound.length },
    { icon: '🗣️', label: 'times speaking Croatian', value: f('phrases') },
  ].filter((x) => x.value > 0);

  // A run with no memorable moments still deserves a story.
  if (highlights.length === 0) highlights.push('Survived five days without a single disaster (suspicious)');

  return { ending, verdict: ending.verdict, highlights, stats };
}
