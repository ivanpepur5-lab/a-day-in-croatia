/**
 * Bus fares — loaded from the editable data file (src/data/travel-data.json → "fares").
 * Edit fares there, not here. See docs/EDITING_DATA.md.
 *
 * Every fare is stored PER PERSON with both official columns:
 *   online   — "Vrijednosna, biljetarnica, online" (value card, ticket office, online)
 *   driver   — "Kod vozača" (bought from the driver)
 * The game charges `gameColumn` (online) × party size.
 */
import TRAVEL from './travel-data.json' with { type: 'json' };

const F = TRAVEL.fares;
const SRC = TRAVEL.sources[F.source];

export const FARE_SOURCE = {
  id: F.source,
  label: SRC.label,
  url: SRC.url,
  validFrom: F.validFrom,
  verifiedOn: F.verifiedOn,
  reviewDays: F.reviewDays,
};

export const FARE_COLUMN = F.gameColumn;

const pair = (a, b) => [a, b].sort().join('|');

/** @type {Record<string, {online:number, driver:number, validityMin:number}>} */
export const PROMET_FARES = Object.fromEntries(
  F.pairs.map((p) => [pair(...p.between), { online: p.online, driver: p.driver, validityMin: p.validityMinutes }]),
);

/** Municipality (JLS) of each place, as used by the fare list (null = outside the fare area). */
export const MUNICIPALITY = F.municipalities;

/** Official fare for a leg between two place ids, or null if not published. */
export function officialFare(fromId, toId) {
  const a = MUNICIPALITY[fromId];
  const b = MUNICIPALITY[toId];
  if (!a || !b) return null;
  return PROMET_FARES[pair(a, b)] ?? null;
}
