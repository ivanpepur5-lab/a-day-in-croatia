import { CATEGORIES } from '../data/locations.js';

const COMPONENT_EMOJI = { time: '⏱️', budget: '💶', route: '🧭', mission: '🎯' };

/** Ten-cell bar: 🟦🟦🟦⬜… */
export function scoreBar(points, max, cells = 5) {
  const filled = Math.round((points / max) * cells);
  return '🟦'.repeat(filled) + '⬜'.repeat(cells - filled);
}

/**
 * Spoiler-light share text: shows categories, not the actual stops.
 */
export function buildShareText({ number, challenge, result, url }) {
  const route = result.itinerary.stops
    .map((s) => CATEGORIES[s.location.category]?.emoji ?? '📍')
    .join(' → ');
  const lines = [
    `A Day in Croatia #${number} · ${challenge.region}`,
    `${result.total}/100 — ${result.rating.title}`,
    '',
    route,
    ...result.components.map(
      (c) => `${COMPONENT_EMOJI[c.id]} ${scoreBar(c.points, c.max)} ${c.points}/${c.max}`,
    ),
  ];
  if (url) lines.push('', url);
  return lines.join('\n');
}
