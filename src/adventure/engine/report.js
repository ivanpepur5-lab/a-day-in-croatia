import { ENDINGS, DESTINATIONS, ACTIVITIES } from '../data/story.js';

/** Past-tense diary lines for quiet days (falls back to the activity label). */
const DID = {
  palace: 'Explored Diocletian’s Palace (and someone’s laundry)',
  picigin: 'Played picigin at Bačvice, with style rather than skill',
  marjan: 'Hiked up Marjan for the view',
  'salona-ruins': 'Gave a speech to the lizards in Salona’s amphitheatre',
  'pazar-morning': 'Tasted four kinds of figs at the Pazar market',
  kamerlengo: 'Climbed Kamerlengo Fortress',
  'trogir-lanes': 'Got lost in Trogir’s lanes (a cat led you out)',
  'trogir-marenda': 'Ate fish stew for marenda with dockworkers and a priest',
  kayak: 'Kayaked up the Cetina canyon',
  mirabela: 'Stormed the Mirabela fortress',
  soparnik: 'Ate soparnik, then a second soparnik',
  skradinski: 'Took 212 photos of the same waterfall',
  'skradin-boat': 'Arrived at Krka by boat, like in a film',
  'krka-picnic': 'Shared a picnic with an opinionated lizard',
  fortica: 'Watched the sunset from the Spanish Fortress',
  'pakleni-taxi': 'Snorkelled in the Pakleni islands',
  lavender: 'Bought lavender oil and was given a fig',
  'stari-grad': 'Cycled the ancient Stari Grad Plain on a squeaky bike',
  'zlatni-rat': 'Swam at Zlatni rat (a child buried your sandals)',
  'vidova-gora': 'Climbed Vidova Gora, the highest island peak',
  pucisca: 'Carved some very modern gravel in Pučišća',
  'brac-konoba': 'Spent three hours at a hillside konoba',
  'walls-early': 'Walked Dubrovnik’s walls at opening time',
  'walls-midday': 'Walked Dubrovnik’s walls at noon',
  lokrum: 'Escaped to Lokrum and met the peacocks',
};
const ACTIVITY_LABEL = Object.fromEntries(Object.values(ACTIVITIES).flat().map((a) => [a.id, DID[a.id] ?? a.label]));

/** When a day has no memorable moment, Duje still has something to say about the place. */
const QUIET_DAY = {
  split: 'wandered the palace, ate well, said “pomalo” at least once',
  trogir: 'got lost in a town you can cross in fifteen minutes',
  omis: 'stared up at pirate fortresses, kept both feet dry',
  krka: 'took 212 photos of the same waterfall',
  hvar: 'smelled of lavender, avoided the yachts',
  brac: 'swam, ate olives, greeted at least one goat',
  dubrovnik: 'climbed stairs you recognised from television',
};

/** A title when nothing in the run had a headline of its own. */
const FALLBACK_TITLE = {
  disaster: 'Five Days of Questionable Decisions',
  legend: 'The Perfect Dalmatian Week',
  adopted: 'The Family I Didn’t Plan',
  fish: 'The Three-Kilo Fish',
  hostage: 'Hostage of the Wind',
  island: 'My Blood Type Is Ferry',
  insider: 'Like a Local',
  budget: 'Rich in Figs',
  fjaka: 'Five Days of Fjaka',
  happy: 'Sunburn and Sunshine',
};

const byRank = (a, b) => b.rank - a.rank || a.day - b.day;

/**
 * The holiday report card: the funniest, most specific things that happened
 * in this run, ranked, plus a title and a five-line diary. Built only from
 * the player's own choices, so every run tells a different story.
 */
export function reportCard(state) {
  const ending = ENDINGS.find((e) => e.id === state.ending);
  const moments = [...(state.moments ?? [])].sort(byRank);
  const highlights = moments.slice(0, 3).map((m) => m.text);
  const titled = moments.find((m) => m.headline);
  const title = titled?.headline ?? FALLBACK_TITLE[ending.id] ?? 'Five Days in Dalmatia';

  // one line per day: the best moment of that day, or a quiet-day line for the place
  const diary = state.route.map((place, i) => {
    const day = i + 1;
    const best = moments.find((m) => m.day === day);
    const name = DESTINATIONS[place]?.name.replace(' National Park', '') ?? place;
    const did = state.choices?.find((c) => c.day === day && c.phase === 'activity' && ACTIVITY_LABEL[c.id]);
    const text = best ? best.text : did ? ACTIVITY_LABEL[did.id] : QUIET_DAY[place] ?? 'a day of sun and sea';
    return { day, place: name, text: best ? text : text.charAt(0).toUpperCase() + text.slice(1) };
  });

  const f = (k) => state.flags[k] ?? 0;
  const stats = [
    { icon: '☕', label: 'hours spent on coffee', value: f('coffeeHours') },
    { icon: '🥃', label: 'rakija toasts', value: f('rakija') },
    { icon: '🍷', label: 'konobas', value: f('konoba') },
    { icon: '🔎', label: 'hidden places', value: f('hidden') },
    { icon: '🤝', label: 'run-ins with Ante', value: f('ante') },
    { icon: '📇', label: 'local tips learned', value: state.tipsFound.length },
    { icon: '🗣️', label: 'times speaking Croatian', value: f('phrases') },
  ].filter((x) => x.value > 0);

  // A run with no memorable moments still deserves a story.
  if (highlights.length === 0) highlights.push('Survived five days without a single disaster (suspicious)');

  return { ending, title, verdict: ending.verdict, highlights, diary, stats, secrets: state.secrets ?? [] };
}
