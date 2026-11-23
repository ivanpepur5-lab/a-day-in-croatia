import { PHOTOS } from './photos.js';

/**
 * Location data for the Split & Dalmatia region.
 *
 * Every player-facing fact is tagged with one of three statuses:
 *
 *   verified    — read on an official source (operator, museum, public transport
 *                 company or official tourist board) on `verifiedOn`, with URL.
 *   unverified  — a real-world claim we have NOT yet confirmed on an official
 *                 source. Shown with an "unverified" label. `toVerify` lists
 *                 where to check.
 *   estimate    — a game value (visit length, travel time, cost) chosen for
 *                 play. Not a real-world claim.
 *
 * The gameplay numbers (`durationMin`, `costPerPerson`) drive scoring. Only
 * Salona's ticket price is currently verified; all other costs are game
 * estimates and are labelled as such in the UI.
 *
 * Audit log: docs/DATA_AUDIT.md
 */

export const AUDIT_DATE = '2026-11-23';

export const DATA_STATUS = {
  label: 'Partly verified data',
  note:
    'Visit times and travel times are game estimates. Prices marked “est.” are estimates; ' +
    'only facts marked “verified” were checked on an official source (see each place’s details). ' +
    'Prices and opening hours change — always check official sources before travelling.',
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

const PROMET_LINES = {
  label: 'Promet Split — network of suburban lines',
  url: 'https://www.promet-split.hr/linije/mreza-linija-prigradskog-prometa',
};

const verified = (field, value, source, note) => ({
  field,
  value,
  status: 'verified',
  source,
  verifiedOn: AUDIT_DATE,
  ...(note ? { note } : {}),
});
const unverified = (field, value, toVerify, note) => ({
  field,
  value,
  status: 'unverified',
  toVerify,
  ...(note ? { note } : {}),
});
const estimate = (field, value, note) => ({ field, value, status: 'estimate', ...(note ? { note } : {}) });

const VISIT_TIME_NOTE = 'Game estimate of a typical visit; not an official recommendation.';

/**
 * @typedef {'verified'|'unverified'|'estimate'} FactStatus
 * @typedef {Object} Fact
 * @property {string} field
 * @property {string} value
 * @property {FactStatus} status
 * @property {{label:string,url:string}} [source]   verified only
 * @property {string} [verifiedOn]                  verified only (YYYY-MM-DD)
 * @property {{label:string,url:string}[]} [toVerify] unverified only
 * @property {string} [note]
 *
 * @typedef {Object} Location
 * @property {string} id
 * @property {string} name
 * @property {string} short
 * @property {string} area
 * @property {string} tagline
 * @property {string} description
 * @property {string} category
 * @property {string[]} tags
 * @property {number} durationMin       Game estimate (minutes on site).
 * @property {number} costPerPerson     EUR per person used for scoring.
 * @property {FactStatus} costStatus    Whether costPerPerson is a verified price.
 * @property {string} costNote
 * @property {{lat:number,lng:number}} coords Approximate.
 * @property {object|null} photo        See data/photos.js.
 * @property {Fact[]} facts
 * @property {string} lastReviewed      YYYY-MM-DD
 */

/** @type {Location[]} */
export const LOCATIONS = [
  {
    id: 'diocletians-palace',
    name: "Diocletian's Palace",
    short: 'Palace',
    area: 'Split old town',
    tagline: 'A Roman emperor’s retirement palace that became a city.',
    description:
      'Wander the Peristyle and the narrow lanes inside the 4th-century palace walls, with optional paid sights such as the cathedral complex and the substructures.',
    category: 'history',
    tags: ['history', 'culture'],
    durationMin: 90,
    costPerPerson: 12,
    costStatus: 'estimate',
    costNote: 'Estimated spend on paid sights inside the palace',
    coords: { lat: 43.5083, lng: 16.4402 },
    photo: PHOTOS['diocletians-palace'],
    lastReviewed: AUDIT_DATE,
    facts: [
      estimate('Spend on paid sights', '≈ €12 per person', 'Game estimate; ticket prices were not verified.'),
      unverified('Entry to palace streets', 'Free (unverified)', [
        { label: 'Split Tourist Board — Diocletian Palace', url: 'https://visitsplit.com/en/448/diocletian-palace' },
      ], 'Not confirmed: the official page uses a bot check that this audit could not pass.'),
      unverified('Cathedral & substructure tickets', 'Not verified', [
        { label: 'Split Tourist Board — Diocletian Palace', url: 'https://visitsplit.com/en/448/diocletian-palace' },
      ], 'mgst.net, previously used for the Split City Museum, now hosts an unofficial travel blog and was not used.'),
      estimate('Time on site', '1h 30m', VISIT_TIME_NOTE),
    ],
  },
  {
    id: 'marjan',
    name: 'Marjan Hill',
    short: 'Marjan',
    area: 'Split peninsula',
    tagline: 'Pine forest, stone steps and wide views over Split.',
    description:
      'Climb from the Varoš quarter towards the Vidilica viewpoint and on into the forest park that covers the peninsula.',
    category: 'nature',
    tags: ['nature', 'viewpoint'],
    durationMin: 90,
    costPerPerson: 0,
    costStatus: 'estimate',
    costNote: 'Assumed free to walk',
    coords: { lat: 43.5094, lng: 16.4296 },
    photo: PHOTOS.marjan,
    lastReviewed: AUDIT_DATE,
    facts: [
      unverified('Access', 'Free to walk (unverified)', [
        { label: 'Marjan Forest Park (public institution)', url: 'https://www.marjan-parksuma.hr/' },
      ]),
      estimate('Time on site', '1h 30m', VISIT_TIME_NOTE),
    ],
  },
  {
    id: 'bacvice',
    name: 'Bačvice Beach',
    short: 'Bačvice',
    area: 'Split',
    tagline: 'Shallow sandy bay and home of picigin.',
    description:
      'A sandy city beach a short walk from the centre, known for picigin — keeping a small ball in the air in the shallows.',
    category: 'beach',
    tags: ['beach'],
    durationMin: 90,
    costPerPerson: 0,
    costStatus: 'estimate',
    costNote: 'Assumed free public beach (sunbed hire extra)',
    coords: { lat: 43.5018, lng: 16.4462 },
    photo: PHOTOS.bacvice,
    lastReviewed: AUDIT_DATE,
    facts: [
      unverified('Access', 'Public beach, free (unverified)', [
        { label: 'Split Tourist Board', url: 'https://visitsplit.com/en/' },
      ]),
      estimate('Time on site', '1h 30m', VISIT_TIME_NOTE),
    ],
  },
  {
    id: 'salona',
    name: 'Salona',
    short: 'Salona',
    area: 'Solin',
    tagline: 'Ruins of the Roman provincial capital of Dalmatia.',
    description:
      'Walk among the amphitheatre, basilicas and city walls of the ancient city near today’s Solin, run by the Archaeological Museum in Split.',
    category: 'history',
    tags: ['history'],
    durationMin: 75,
    costPerPerson: 8,
    costStatus: 'verified',
    costNote: 'Official adult ticket, Archaeological Museum in Split / Salona',
    coords: { lat: 43.5392, lng: 16.4833 },
    photo: PHOTOS.salona,
    lastReviewed: AUDIT_DATE,
    facts: [
      verified(
        'Adult ticket',
        '€8 (combined ticket with the Archaeological Museum in Split: €10, valid 7 days)',
        {
          label: 'Archaeological Museum in Split — ticket prices',
          url: 'https://www.armus.hr/muzej/posjet/cijena-ulaznica-i-strucnog-vodstva',
        },
        'The page gives no year; prices as published on the verification date.',
      ),
      verified(
        'Opening hours (Tusculum / Salona site)',
        '1 Jun–30 Sep: daily 9:00–20:00 · 1 Oct–31 May: daily 9:00–18:00 · closed on public holidays',
        { label: 'Archaeological Museum in Split — opening hours', url: 'https://www.armus.hr/muzej/posjet' },
      ),
      verified('Public transport', 'Promet Split line 5A lists Solin on its route', PROMET_LINES,
        'Stop nearest the site and travel time not verified.'),
      estimate('Time on site', '1h 15m', VISIT_TIME_NOTE),
    ],
  },
  {
    id: 'klis',
    name: 'Klis Fortress',
    short: 'Klis',
    area: 'Klis',
    tagline: 'A clifftop stronghold guarding the pass to the coast.',
    description:
      'A fortress strung along a limestone ridge, with sweeping views over Split, the islands and the hinterland.',
    category: 'history',
    tags: ['history', 'viewpoint'],
    durationMin: 60,
    costPerPerson: 10,
    costStatus: 'estimate',
    costNote: 'Estimated fortress entry',
    coords: { lat: 43.5596, lng: 16.5236 },
    photo: PHOTOS.klis,
    lastReviewed: AUDIT_DATE,
    facts: [
      estimate('Entry', '≈ €10 per person', 'Game estimate; ticket price not verified.'),
      unverified('Ticket price & opening hours', 'Not verified', [
        { label: 'Klis Fortress (reported official site)', url: 'https://www.tvrdavaklis.com/' },
      ], 'Official site could not be reached from the audit environment.'),
      verified('Public transport', 'Promet Split line 22 runs Split – Klis', PROMET_LINES,
        'Travel time not verified.'),
      estimate('Time on site', '1h', VISIT_TIME_NOTE),
    ],
  },
  {
    id: 'trogir',
    name: 'Trogir',
    short: 'Trogir',
    area: 'Trogir',
    tagline: 'A medieval island town of stone lanes and loggias.',
    description:
      'Cross the bridge to a compact old town on a small island, then walk the waterfront to the Kamerlengo fortress.',
    category: 'culture',
    tags: ['culture', 'history'],
    durationMin: 90,
    costPerPerson: 6,
    costStatus: 'estimate',
    costNote: 'Estimated fortress entry',
    coords: { lat: 43.5167, lng: 16.2503 },
    photo: PHOTOS.trogir,
    lastReviewed: AUDIT_DATE,
    facts: [
      estimate('Kamerlengo entry', '≈ €6 per person', 'Game estimate; ticket price not verified.'),
      unverified('Kamerlengo ticket & hours', 'Not verified', [
        { label: 'Trogir Town Museum', url: 'https://www.muzej-grada-trogira.hr/' },
        { label: 'Trogir Tourist Board', url: 'https://www.visittrogir.hr/' },
      ]),
      unverified('UNESCO World Heritage status', 'Historic City of Trogir (unverified in this audit)', [
        { label: 'UNESCO World Heritage List', url: 'https://whc.unesco.org/en/list/810' },
      ], 'UNESCO’s site refused automated access during the audit.'),
      verified('Public transport', 'Promet Split line 37 runs Split – Airport – Trogir', PROMET_LINES,
        'Travel time not verified.'),
      estimate('Time on site', '1h 30m', VISIT_TIME_NOTE),
    ],
  },
  {
    id: 'omis',
    name: 'Omiš & Cetina',
    short: 'Omiš',
    area: 'Omiš',
    tagline: 'Where the Cetina river canyon meets the sea.',
    description:
      'Paddle into the dramatic Cetina canyon from the old town of Omiš. Trips are run by private operators.',
    category: 'adventure',
    tags: ['adventure', 'nature'],
    durationMin: 150,
    costPerPerson: 30,
    costStatus: 'estimate',
    costNote: 'Estimated guided kayak trip (private operators set prices)',
    coords: { lat: 43.4447, lng: 16.6886 },
    photo: PHOTOS.omis,
    lastReviewed: AUDIT_DATE,
    facts: [
      verified(
        'Activities',
        'The Omiš tourist board lists kayaking, rafting, canyoning and zipline in the Cetina canyon',
        { label: 'Omiš Tourist Board — Cetina river canyon', url: 'https://www.visitomis.hr/kanjon-rijeke-cetine' },
      ),
      estimate('Kayak trip price', '≈ €30 per person', 'Private operators set prices; not verified.'),
      verified('Public transport', 'Promet Split line 60 runs Split – Omiš – Ravnički most', PROMET_LINES,
        'Travel time not verified.'),
      estimate('Time on site', '2h 30m', VISIT_TIME_NOTE),
    ],
  },
  {
    id: 'krka',
    name: 'Krka National Park',
    short: 'Krka',
    area: 'Skradin',
    tagline: 'Travertine terraces and roaring waterfalls.',
    description:
      'Boardwalks loop around Skradinski buk, a cascade of travertine pools and falls inside the national park.',
    category: 'nature',
    tags: ['nature'],
    durationMin: 180,
    costPerPerson: 30,
    costStatus: 'estimate',
    costNote: 'Estimated park entry (official prices vary by season)',
    coords: { lat: 43.8169, lng: 15.9225 },
    photo: PHOTOS.krka,
    lastReviewed: AUDIT_DATE,
    facts: [
      estimate('Park entry', '≈ €30 per person', 'Game estimate. Official prices are seasonal and were not verified.'),
      unverified('Ticket prices & opening hours', 'Not verified', [
        { label: 'Krka National Park (np-krka.hr now redirects here)', url: 'https://npkrka.hr/' },
      ], 'The official site could not be read from the audit environment.'),
      unverified('Public transport from Split', 'Not verified', [
        { label: 'Krka National Park', url: 'https://npkrka.hr/' },
      ], 'Not served by Promet Split’s suburban network.'),
      estimate('Time on site', '3h', VISIT_TIME_NOTE),
    ],
  },
];

export const LOCATIONS_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));

export function getLocation(id) {
  const loc = LOCATIONS_BY_ID[id];
  if (!loc) throw new Error(`Unknown location: ${id}`);
  return loc;
}
