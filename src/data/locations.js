/**
 * Location data for the Split & Dalmatia region.
 *
 * ⚠️ ILLUSTRATIVE SAMPLE DATA — NOT VERIFIED.
 * Coordinates are approximate public geographic positions. Visit durations
 * and per-person costs are illustrative game values chosen for balance; they
 * are NOT live prices, ticket tariffs or opening hours. Every value marked
 * `verified: false` must be checked against official sources before this
 * game presents it as real travel advice.
 */

export const DATA_STATUS = {
  verified: false,
  label: 'Illustrative sample data',
  note:
    'Durations, costs and travel times are illustrative estimates for gameplay. ' +
    'They are not live prices, opening hours or public transport schedules. ' +
    'Always check official sources before travelling.',
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

/**
 * @typedef {Object} Location
 * @property {string} id
 * @property {string} name
 * @property {string} short       Compact name for tight UI and share text.
 * @property {string} area        Town / area label.
 * @property {string} tagline
 * @property {string} description
 * @property {string} category    Primary category id (drives card colour & emoji).
 * @property {string[]} tags      All category ids this experience satisfies.
 * @property {number} durationMin Illustrative time on site, in minutes.
 * @property {number} costPerPerson Illustrative cost per person, in EUR.
 * @property {string} costNote    What the illustrative cost represents.
 * @property {{lat:number,lng:number}} coords
 * @property {{src:string, credit:string, license:string}|null} photo
 *           Optional licensed photo in /public/images. Falls back to illustrated art.
 * @property {boolean} verified
 */

/** @type {Location[]} */
export const LOCATIONS = [
  {
    id: 'diocletians-palace',
    name: "Diocletian's Palace",
    short: 'Palace',
    area: 'Split old town',
    tagline: 'A Roman emperor’s retirement home, still lived in today.',
    description:
      'Wander the Peristyle, the substructures and the narrow lanes of a 4th-century palace that became a city.',
    category: 'history',
    tags: ['history', 'culture'],
    durationMin: 90,
    costPerPerson: 12,
    costNote: 'Illustrative combined sights ticket',
    coords: { lat: 43.5083, lng: 16.4402 },
    photo: null,
    verified: false,
  },
  {
    id: 'marjan',
    name: 'Marjan Hill',
    short: 'Marjan',
    area: 'Split peninsula',
    tagline: 'Pine forest, stone steps and the best view over Split.',
    description:
      'Climb from the Varoš quarter to the Vidilica viewpoint and on into the forest park that crowns the peninsula.',
    category: 'nature',
    tags: ['nature', 'viewpoint'],
    durationMin: 90,
    costPerPerson: 0,
    costNote: 'Free to walk',
    coords: { lat: 43.5094, lng: 16.4296 },
    photo: null,
    verified: false,
  },
  {
    id: 'bacvice',
    name: 'Bačvice Beach',
    short: 'Bačvice',
    area: 'Split',
    tagline: 'Shallow sandy bay and home of picigin.',
    description:
      'A sandy city beach minutes from the centre, famous for picigin — the local game of keeping a small ball airborne in the shallows.',
    category: 'beach',
    tags: ['beach'],
    durationMin: 90,
    costPerPerson: 0,
    costNote: 'Free public beach',
    coords: { lat: 43.5018, lng: 16.4462 },
    photo: null,
    verified: false,
  },
  {
    id: 'salona',
    name: 'Salona',
    short: 'Salona',
    area: 'Solin',
    tagline: 'Ruins of the Roman provincial capital of Dalmatia.',
    description:
      'Walk among the amphitheatre, basilicas and city walls of the ancient city that preceded Split.',
    category: 'history',
    tags: ['history'],
    durationMin: 75,
    costPerPerson: 8,
    costNote: 'Illustrative site entry',
    coords: { lat: 43.5392, lng: 16.4833 },
    photo: null,
    verified: false,
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
    costNote: 'Illustrative fortress entry',
    coords: { lat: 43.5596, lng: 16.5236 },
    photo: null,
    verified: false,
  },
  {
    id: 'trogir',
    name: 'Trogir',
    short: 'Trogir',
    area: 'Trogir',
    tagline: 'A medieval island town of stone lanes and loggias.',
    description:
      'Cross the bridge to a compact UNESCO-listed old town, then walk the waterfront to the Kamerlengo fortress.',
    category: 'culture',
    tags: ['culture', 'history'],
    durationMin: 90,
    costPerPerson: 6,
    costNote: 'Illustrative fortress entry',
    coords: { lat: 43.5167, lng: 16.2503 },
    photo: null,
    verified: false,
  },
  {
    id: 'omis',
    name: 'Omiš & Cetina',
    short: 'Omiš',
    area: 'Omiš',
    tagline: 'Where the Cetina river canyon meets the sea.',
    description:
      'Paddle into the dramatic Cetina gorge from the old pirate town of Omiš.',
    category: 'adventure',
    tags: ['adventure', 'nature'],
    durationMin: 150,
    costPerPerson: 30,
    costNote: 'Illustrative guided kayak trip',
    coords: { lat: 43.4447, lng: 16.6886 },
    photo: null,
    verified: false,
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
    costNote: 'Illustrative park entry',
    coords: { lat: 43.8169, lng: 15.9225 },
    photo: null,
    verified: false,
  },
];

export const LOCATIONS_BY_ID = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));

export function getLocation(id) {
  const loc = LOCATIONS_BY_ID[id];
  if (!loc) throw new Error(`Unknown location: ${id}`);
  return loc;
}
