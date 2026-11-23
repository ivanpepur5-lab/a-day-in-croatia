import { PHOTOS } from './photos.js';
import { FARE_SOURCE, PROMET_FARES } from './fares.js';

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

const fareFact = (key, label) => {
  const f = PROMET_FARES[key];
  return {
    field: 'Bus fare from Split',
    value: `€${f.online.toFixed(2)} per person online / at a ticket office, €${f.driver.toFixed(2)} from the driver (${label}, ticket valid ${f.validityMin} min)`,
    status: 'verified',
    source: { label: FARE_SOURCE.label, url: FARE_SOURCE.url },
    verifiedOn: FARE_SOURCE.verifiedOn,
    note: 'Prices valid from 1 Jun 2026. The game uses the online / ticket-office fare.',
  };
};

const KRKA_PRICES = {
  label: 'Krka National Park — entrance ticket prices for 2026 (PDF)',
  url: 'https://www.np-krka.hr/wp-content/uploads/CJENIK-2026.-ENG.pdf',
};
const LINE_22 = {
  label: 'Promet Split — line 22 Split – Klis timetable (valid from 7 Sep 2026)',
  url: 'https://www.promet-split.hr/vozni-red/urbano-podrucje/linijaid/61877',
};
const LINE_12 = {
  label: 'Promet Split — line 12 Sv. Frane – Bene timetable (valid from 27 Oct 2026)',
  url: 'https://www.promet-split.hr/vozni-red/split/linijaid/61864',
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
      unverified('Cathedral & substructure tickets and hours', 'Not verified', [
        { label: 'Split Tourist Board — Diocletian Palace', url: 'https://visitsplit.com/en/448/diocletian-palace' },
      ], 'mgst.net, previously used for the Split City Museum, now hosts an unofficial travel blog and was not used.'),
      unverified('UNESCO World Heritage status', 'Historical Complex of Split with the Palace of Diocletian (unverified in this audit)', [
        { label: 'UNESCO World Heritage List', url: 'https://whc.unesco.org/en/list/97' },
      ], 'UNESCO’s site refused automated access during the audit.'),
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
      unverified('Access rules', 'Free to walk (unverified); park rules not verified', [
        { label: 'Marjan Forest Park (public institution)', url: 'https://www.marjan-parksuma.hr/' },
        { label: 'Split Tourist Board — notice on visitor access to Marjan', url: 'https://visitsplit.com/hr/7391/important-notice-visitor-access-in-marjan-forest-park' },
      ], 'The Split Tourist Board has published a visitor-access notice for Marjan; its content could not be read (bot check).'),
      unverified('Parking', 'Not verified', [
        { label: 'Marjan Forest Park (public institution)', url: 'https://www.marjan-parksuma.hr/' },
      ]),
      verified(
        'Public transport',
        'Promet Split line 12: Sv. Frane – Obala kneza Branimira – Šetalište Ivana Meštrovića (Kaštelet and Kašjuni beaches) – Mediteranski institut – Bene',
        LINE_12,
        'In the game you reach Marjan on foot from the Riva. Whether line 12 suits the Vidilica walk was not verified.',
      ),
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
      ], 'The tourist board site uses a bot check that this audit did not bypass.'),
      unverified('Facilities & sunbed hire', 'Not verified', [{ label: 'Split Tourist Board', url: 'https://visitsplit.com/en/' }]),
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
      verified(
        'Getting there',
        'A few minutes on foot from the Hotel Salona Palace bus stop (bus line 1)',
        { label: 'Archaeological Museum in Split — how to reach us', url: 'https://www.armus.hr/muzej/posjet/kako-do-muzeja-zbirki' },
        'Travel time not verified; the game uses an estimate.',
      ),
      fareFact('Solin|Split', 'Split – Solin'),
      verified(
        'Highlights',
        'Amphitheatre (built in the second half of the 2nd century) and the early-Christian complex at Manastirine',
        {
          label: 'Archaeological Museum in Split — Salona sites',
          url: 'https://www.armus.hr/muzej/povijest-muzeja/prirucna-zbirka-i-lokalitet-salona/lokaliteti-salona',
        },
      ),
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
      unverified('Ticket price', 'Not verified', [
        { label: 'Klis Fortress (reported official site)', url: 'https://www.tvrdavaklis.com/' },
      ], 'The official site could not be reached from the audit environment.'),
      unverified('Opening hours', 'Not verified', [
        { label: 'Klis Fortress (reported official site)', url: 'https://www.tvrdavaklis.com/' },
      ]),
      verified(
        'Public transport',
        'Promet Split line 22: Terminal Sukoišan – Ul. Domovinskog rata – ZNG – Solin – Đurini – Gornja Rupotina – Megdan – Klis; departure times are given from HNK',
        LINE_22,
        'The line starts from the HNK/Sukoišan area, not the Riva. Which stop is nearest the fortress and the ride time were not verified.',
      ),
      fareFact('Klis|Split', 'Split – Klis'),
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
      'Cross the bridge to a compact, UNESCO-listed old town on a small island, then walk the waterfront to the Kamerlengo fortress.',
    category: 'culture',
    tags: ['culture', 'history'],
    durationMin: 90,
    costPerPerson: 7,
    costStatus: 'verified',
    costNote: 'Official adult ticket, Kamerlengo Fortress (Trogir Tourist Board)',
    coords: { lat: 43.5167, lng: 16.2503 },
    photo: PHOTOS.trogir,
    lastReviewed: AUDIT_DATE,
    facts: [
      verified(
        'Kamerlengo adult ticket',
        '€7 (students / children 5–16: €3; under 5 free)',
        { label: 'Trogir Tourist Board — Kamerlengo Fortress', url: 'https://www.visittrogir.hr/en/tourist/attractions/kamerlengo-fortress' },
        'Published as an image on the official page; it states no year (uploaded March 2025). Check before travelling.',
      ),
      verified(
        'Kamerlengo opening hours',
        'Apr 10:00–18:00 · May 9:00–20:00 · Jun–Aug 9:00–22:00 · Sep 9:00–20:00 · Oct–Nov 10:00–18:00 (daily)',
        { label: 'Trogir Tourist Board — Kamerlengo Fortress', url: 'https://www.visittrogir.hr/en/tourist/attractions/kamerlengo-fortress' },
        'No hours are listed for December–March. Same image as the ticket price (no year stated).',
      ),
      verified(
        'UNESCO World Heritage status',
        'Trogir was inscribed on UNESCO’s World Heritage List in 1997',
        { label: 'Trogir Tourist Board — FAQ', url: 'https://www.visittrogir.hr/en/tourist/faq' },
        'Confirmed on the official tourist board; UNESCO’s own site refused automated access.',
      ),
      verified('Public transport', 'Promet Split line 37 runs Split – Airport – Trogir', PROMET_LINES,
        'Travel time not verified.'),
      fareFact('Split|Trogir', 'Split – Trogir'),
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
      verified(
        'Location & buses',
        'Omiš is 25 km south-east of Split; from Split’s main bus station a direct line to Omiš leaves on average every half hour',
        { label: 'Omiš Tourist Board — useful information', url: 'https://www.visitomis.hr/korisne-informacije' },
        'Average frequency as stated by the tourist board; it is not a timetable.',
      ),
      verified(
        'Highlight',
        'The 14th-century Mirabela fortress, about 5 minutes’ walk from the central square, overlooks Omiš and the island of Brač',
        { label: 'Omiš Tourist Board — Omiš in 1 day', url: 'https://www.visitomis.hr/omis-u-1-3-ili-7-dana/omis-u-1-dan' },
      ),
      verified('Public transport', 'Promet Split line 60 runs Split – Omiš – Ravnički most', PROMET_LINES,
        'Travel time not verified.'),
      fareFact('Omiš|Split', 'Split – Omiš'),
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
    costNote: 'Game estimate — official 2026 adult entry is €7–€40 depending on the month (seasons are not modelled)',
    coords: { lat: 43.8169, lng: 15.9225 },
    photo: PHOTOS.krka,
    lastReviewed: AUDIT_DATE,
    facts: [
      verified(
        'Adult entrance 2026 (all land sites)',
        'Jan–Mar & Nov–Dec €7 · Apr, May & Oct €20 · Jun–Sep €40 (€30 after 15:00)',
        KRKA_PRICES,
        'Price list created 16 Nov 2026; a 2027 list is also published. The park reserves the right to change prices.',
      ),
      verified(
        'Children 7–18, 2026 (all land sites)',
        'Jan–Mar & Nov–Dec €4 · Apr, May & Oct €12 · Jun–Sep €15 (€11.25 after 15:00) · under 7 free',
        KRKA_PRICES,
      ),
      verified(
        'Included in the ticket',
        'Boat Skradin – Skradinski buk – Skradin and bus Lozovac – Skradinski buk – Lozovac (both 1 Apr – 31 Oct)',
        KRKA_PRICES,
      ),
      estimate(
        'Game cost',
        '≈ €30 per person',
        'The game has no seasons, so it keeps one estimated price. Official 2026 adult prices are listed above.',
      ),
      unverified('Opening hours', 'Not verified', [{ label: 'Krka National Park', url: 'https://npkrka.hr/' }],
        'Opening hours are not in the price list, and the park’s web pages could not be read from the audit environment.'),
      unverified('Public transport from Split', 'Not verified', [{ label: 'Krka National Park', url: 'https://npkrka.hr/' }],
        'No Promet Split line serves Skradin or Lozovac (checked against the official line list).'),
      unverified('Recommended visit duration', 'Not verified', [{ label: 'Krka National Park', url: 'https://npkrka.hr/' }],
        'The game uses 3h as an estimate.'),
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
