import { PHOTOS } from './photos.js';
import TRAVEL from './travel-data.json' with { type: 'json' };
import { FARE_SOURCE, PROMET_FARES } from './fares.js';

/**
 * Locations for the Split & Dalmatia region.
 *
 * This file holds only DESCRIPTIVE content (names, descriptions, coordinates,
 * photos). Everything that can change in the real world — prices, visit
 * times, opening hours, transport, fares and their sources — lives in the
 * editable data file src/data/travel-data.json (see docs/EDITING_DATA.md)
 * and is merged in below. Statuses:
 *
 *   verified    — read on an official source on `verifiedOn`, with a source link
 *   unverified  — real-world claim not yet confirmed; `checkAt` says where to look
 *   estimate    — a game value, never presented as an official price
 *
 * `npm run audit` validates the data (missing sources, stale dates, …).
 */

export const AUDIT_DATE = TRAVEL.meta.auditDate;
export const DEFAULT_REVIEW_DAYS = TRAVEL.meta.defaultReviewDays;
export const SOURCES = TRAVEL.sources;

export const DATA_STATUS = {
  label: 'Partly verified data',
  note:
    'Green “Verified” items were checked on an official source on the date shown. ' +
    '“≈” and “est.” mark estimates — visit times, travel times and some prices are game estimates, never official prices. ' +
    'Prices and opening hours change: always check the official source before travelling.',
};

/** Experience categories used by mission requirements. */
export const CATEGORIES = {
  history: { id: 'history', label: 'History', emoji: '🏛️' },
  nature: { id: 'nature', label: 'Nature', emoji: '🌲' },
  beach: { id: 'beach', label: 'Beach', emoji: '🏖️' },
  culture: { id: 'culture', label: 'Old Town', emoji: '⛪' },
  adventure: { id: 'adventure', label: 'Adventure', emoji: '🛶' },
  viewpoint: { id: 'viewpoint', label: 'Viewpoint', emoji: '🌅' },
};

/** The fixed start/end point of every Split challenge. */
export const SPLIT_HUB = {
  id: 'split-riva',
  name: 'Split Riva',
  short: 'Riva',
  coords: { lat: 43.5075, lng: 16.44 },
};

const source = (id) => {
  const s = SOURCES[id];
  if (!s) throw new Error(`travel-data.json: unknown source "${id}"`);
  return { id, label: s.label, url: s.url, publisher: s.publisher };
};

/** Fact as used by the UI: source ids resolved to {label,url}. */
function resolveFact(f) {
  const out = { ...f, field: f.label };
  if (f.source) out.source = source(f.source);
  if (f.checkAt) out.toVerify = f.checkAt.map(source);
  return out;
}

/** "Bus fare from Split" facts are generated from the fare table (single source of truth). */
const FARE_FACT_FOR = { salona: 'Solin', klis: 'Klis', trogir: 'Trogir', omis: 'Omiš' };
function fareFact(locationId) {
  const town = FARE_FACT_FOR[locationId];
  if (!town) return null;
  const f = PROMET_FARES[['Split', town].sort().join('|')];
  if (!f) return null;
  return {
    id: 'bus-fare-from-split',
    type: 'transport',
    field: 'Bus fare from Split',
    label: 'Bus fare from Split',
    value: `€${f.online.toFixed(2)} per person online / at a ticket office, €${f.driver.toFixed(2)} from the driver (Split – ${town}, ticket valid ${f.validityMin} min)`,
    status: 'verified',
    source: source(FARE_SOURCE.id),
    verifiedOn: FARE_SOURCE.verifiedOn,
    validFrom: FARE_SOURCE.validFrom,
    note: 'Official fares valid from 1 Jun 2026. The game uses the online / ticket-office fare × party size.',
  };
}

const DESCRIPTIVE = [
  {
    id: "diocletians-palace",
    name: "Diocletian's Palace",
    short: "Palace",
    area: "Split old town",
    tagline: "A Roman emperor’s retirement palace that became a city.",
    description:
      "Wander the Peristyle and the narrow lanes inside the 4th-century palace walls, with optional paid sights such as the cathedral complex and the substructures.",
    category: "history",
    tags: ["history", "culture"],
    coords: { lat: 43.5083, lng: 16.4402 },
  },
  {
    id: "marjan",
    name: "Marjan Hill",
    short: "Marjan",
    area: "Split peninsula",
    tagline: "Pine forest, stone steps and wide views over Split.",
    description:
      "Climb from the Varoš quarter towards the Vidilica viewpoint and on into the forest park that covers the peninsula.",
    category: "nature",
    tags: ["nature", "viewpoint"],
    coords: { lat: 43.5094, lng: 16.4296 },
  },
  {
    id: "bacvice",
    name: "Bačvice Beach",
    short: "Bačvice",
    area: "Split",
    tagline: "Shallow sandy bay and home of picigin.",
    description:
      "A sandy city beach a short walk from the centre, known for picigin — keeping a small ball in the air in the shallows.",
    category: "beach",
    tags: ["beach"],
    coords: { lat: 43.5018, lng: 16.4462 },
  },
  {
    id: "salona",
    name: "Salona",
    short: "Salona",
    area: "Solin",
    tagline: "Ruins of the Roman provincial capital of Dalmatia.",
    description:
      "Walk among the amphitheatre, basilicas and city walls of the ancient city near today’s Solin, run by the Archaeological Museum in Split.",
    category: "history",
    tags: ["history"],
    coords: { lat: 43.5392, lng: 16.4833 },
  },
  {
    id: "klis",
    name: "Klis Fortress",
    short: "Klis",
    area: "Klis",
    tagline: "A clifftop stronghold guarding the pass to the coast.",
    description:
      "A fortress strung along a limestone ridge, with sweeping views over Split, the islands and the hinterland.",
    category: "history",
    tags: ["history", "viewpoint"],
    coords: { lat: 43.5596, lng: 16.5236 },
  },
  {
    id: "trogir",
    name: "Trogir",
    short: "Trogir",
    area: "Trogir",
    tagline: "A medieval island town of stone lanes and loggias.",
    description:
      "Cross the bridge to a compact, UNESCO-listed old town on a small island, then walk the waterfront to the Kamerlengo fortress.",
    category: "culture",
    tags: ["culture", "history"],
    coords: { lat: 43.5167, lng: 16.2503 },
  },
  {
    id: "omis",
    name: "Omiš & Cetina",
    short: "Omiš",
    area: "Omiš",
    tagline: "Where the Cetina river canyon meets the sea.",
    description:
      "Paddle into the dramatic Cetina canyon from the old town of Omiš. Trips are run by private operators.",
    category: "adventure",
    tags: ["adventure", "nature"],
    coords: { lat: 43.4447, lng: 16.6886 },
  },
  {
    id: "krka",
    name: "Krka National Park",
    short: "Krka",
    area: "Skradin",
    tagline: "Travertine terraces and roaring waterfalls.",
    description:
      "Boardwalks loop around Skradinski buk, a cascade of travertine pools and falls inside the national park.",
    category: "nature",
    tags: ["nature"],
    coords: { lat: 43.8169, lng: 15.9225 },
  },
];

/**
 * @typedef {'verified'|'unverified'|'estimate'} FactStatus
 * @typedef {Object} Location
 * @property {string} id
 * @property {number} durationMin       Game estimate (minutes on site), from travel-data.json.
 * @property {number} costPerPerson     EUR per person used for scoring, from travel-data.json.
 * @property {FactStatus} costStatus    Whether costPerPerson is an official price.
 * @property {object} price             Full price record (status, source, verifiedOn, checkAt…).
 * @property {object[]} facts           Resolved facts (source → {label,url}, checkAt → toVerify).
 */

/** @type {Location[]} */
export const LOCATIONS = DESCRIPTIVE.map((d) => {
  const t = TRAVEL.locations[d.id];
  if (!t) throw new Error(`travel-data.json: no entry for location "${d.id}"`);
  const price = resolveFact({ ...t.price, label: 'Price per person', value: `€${t.price.perPerson}` });
  const facts = t.facts.map(resolveFact);
  const fare = fareFact(d.id);
  if (fare) facts.push(fare);
  return {
    ...d,
    durationMin: t.visitMinutes.value,
    costPerPerson: t.price.perPerson,
    costStatus: t.price.status,
    costNote: t.price.note ?? '',
    price,
    visit: t.visitMinutes,
    photo: PHOTOS[d.id] ?? null,
    lastReviewed: [t.price.verifiedOn, ...t.facts.map((f) => f.verifiedOn)].filter(Boolean).sort().at(-1) ?? AUDIT_DATE,
    facts,
  };
});

export const LOCATIONS_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));

export function getLocation(id) {
  const loc = LOCATIONS_BY_ID[id];
  if (!loc) throw new Error(`Unknown location: ${id}`);
  return loc;
}
