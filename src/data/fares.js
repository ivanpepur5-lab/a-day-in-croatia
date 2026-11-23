/**
 * Official Promet Split single-ticket fares, read from the operator's own
 * price list (PDF) on 2026-11-23:
 *   "Cjenik pojedinačnih karata … — vrijedi od 01.06.2026."
 *   https://www.promet-split.hr/cjenik/cjenik-putnih-karata
 *
 * Columns in the source:
 *   online    — "Vrijednosna, biljetarnica, online" (value card, ticket office, online)
 *   driver    — "Kod vozača (EUR)" (bought from the driver)
 *   validity  — "Valjanost od prve validacije" (minutes from first validation)
 *
 * Fares are per person, per single ticket, between municipalities (JLS).
 * Only pairs listed in the PDF are included; anything else stays an estimate.
 * Bus TIMES are not taken from timetables — they remain model estimates.
 */
export const FARE_SOURCE = {
  label: 'Promet Split — single-ticket price list (valid from 1 Jun 2026)',
  url: 'https://www.promet-split.hr/cjenik/cjenik-putnih-karata',
  validFrom: '2026-06-01',
  verifiedOn: '2026-11-23',
};

/** The game uses the ticket-office / online fare. */
export const FARE_COLUMN = 'online';

const pair = (a, b) => [a, b].sort().join('|');

/** @type {Record<string, {online:number, driver:number, validityMin:number}>} */
export const PROMET_FARES = {
  [pair('Split', 'Split')]: { online: 1.5, driver: 3.0, validityMin: 60 },
  [pair('Split', 'Solin')]: { online: 1.75, driver: 3.5, validityMin: 75 },
  [pair('Split', 'Klis')]: { online: 2.0, driver: 4.0, validityMin: 90 },
  [pair('Split', 'Trogir')]: { online: 2.5, driver: 5.0, validityMin: 105 },
  [pair('Split', 'Omiš')]: { online: 2.5, driver: 5.0, validityMin: 105 },
  [pair('Solin', 'Klis')]: { online: 1.75, driver: 3.5, validityMin: 75 },
  [pair('Solin', 'Trogir')]: { online: 2.0, driver: 4.0, validityMin: 90 },
  [pair('Solin', 'Omiš')]: { online: 2.0, driver: 4.0, validityMin: 90 },
  [pair('Omiš', 'Klis')]: { online: 1.75, driver: 3.5, validityMin: 75 },
};

/**
 * Municipality (JLS) of each place, as used by the fare list.
 * Krka (Skradin) is outside Promet Split's fare area.
 */
export const MUNICIPALITY = {
  'split-riva': 'Split',
  'diocletians-palace': 'Split',
  marjan: 'Split',
  bacvice: 'Split',
  salona: 'Solin',
  klis: 'Klis',
  trogir: 'Trogir',
  omis: 'Omiš',
  krka: null,
};

/** Official fare for a leg between two place ids, or null if not published. */
export function officialFare(fromId, toId) {
  const a = MUNICIPALITY[fromId];
  const b = MUNICIPALITY[toId];
  if (!a || !b) return null;
  return PROMET_FARES[pair(a, b)] ?? null;
}
