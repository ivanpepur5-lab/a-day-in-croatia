/**
 * CROATIA ADVENTURE — story content.
 *
 * Everything in this file is FICTION: characters, situations, dialogue and
 * the in-game money amounts (simplified game values, NOT real prices).
 * Real-world knowledge lives only in ./tips.js and is shown on separate,
 * clearly labelled Local Insider cards.
 *
 * Effects:  money (€, game value) · energy · happiness · adventure · local
 * Flags:    counters/booleans used for branching, achievements and endings
 */

export const START = { money: 500, energy: 100, happiness: 50, adventure: 0, local: 0, days: 5 };

export const DESTINATIONS = {
  split: { id: 'split', name: 'Split', photo: 'split-hero', kind: 'city', blurb: 'Roman palace, palm-lined Riva, zero chill about football.' },
  trogir: { id: 'trogir', name: 'Trogir', photo: 'trogir', kind: 'town', blurb: 'A medieval town on an island the size of a large car park.' },
  omis: { id: 'omis', name: 'Omiš', photo: 'omis', kind: 'town', blurb: 'Pirate fortresses, a river canyon and the sea, all at once.' },
  krka: { id: 'krka', name: 'Krka National Park', photo: 'krka', kind: 'nature', blurb: 'Waterfalls so photogenic your phone gets tired.' },
  hvar: { id: 'hvar', name: 'Hvar', photo: 'hvar', kind: 'island', blurb: 'Lavender, yachts and a fortress keeping an eye on both.' },
  brac: { id: 'brac', name: 'Brač', photo: 'brac', kind: 'island', blurb: 'White stone, olive groves and a beach that changes shape.' },
  dubrovnik: { id: 'dubrovnik', name: 'Dubrovnik', photo: 'dubrovnik', kind: 'city', blurb: 'The walled city. Yes, those walls.' },
};

export const ISLANDS = ['hvar', 'brac'];
export const MAINLAND_DAY_TRIPS = ['trogir', 'omis', 'krka'];

/** Day-0 choice: where you sleep. Nightly cost and energy recovery (game values). */
export const BASES = [
  {
    id: 'hostel',
    label: 'Party hostel',
    hint: 'Cheap. Someone will play the guitar at 3 a.m.',
    nightly: 25,
    recover: 20,
    effects: { happiness: 3 },
    result: 'Twelve beds, one fan, infinite new best friends. Your wallet is delighted. Your sleep is negotiable.',
  },
  {
    id: 'apartment',
    label: 'Apartment with a nonna next door',
    hint: 'Mid-price. Comes with unsolicited figs.',
    nightly: 45,
    recover: 30,
    effects: { happiness: 5, local: 1 },
    result: 'Your landlady Marija hands you the keys, a bag of figs and a list of “places tourists don’t know”. Most are her cousins.',
    tip: 'pomalo',
  },
  {
    id: 'boutique',
    label: 'Boutique hotel with a sea view',
    hint: 'Expensive. The pillows have a menu.',
    nightly: 80,
    recover: 40,
    effects: { happiness: 8 },
    result: 'The receptionist calls you “gospodine/gospođo” and the shower has opinions about water pressure. Luxury.',
  },
];

/* ───────────────────────────────────────────── TRAVEL (one per day) ── */

export const TRAVEL = {
  1: {
    title: 'Day 1 · Touchdown',
    prompt: 'You land, blinking into the Dalmatian sun. Split is somewhere out there. So is your luggage, hopefully. How do you get into town?',
    choices: [
      {
        id: 'taxi',
        label: 'Grab a taxi',
        hint: 'Fast, air-conditioned, pricey',
        to: 'split',
        effects: { money: -45, energy: -3, happiness: 4 },
        result: 'Your driver plays klapa at full volume, explains Hajduk Split’s entire history and gets you there before you finish nodding.',
        tip: 'airport-in-kastela',
      },
      {
        id: 'bus',
        label: 'Take the bus',
        hint: 'Cheap, slower, character-building',
        to: 'split',
        effects: { money: -6, energy: -10, happiness: 1, local: 1 },
        result: 'You buy your ticket before boarding like a pro and watch smug latecomers pay double. Small victories.',
        tip: 'buy-ticket-before',
      },
      {
        id: 'car',
        label: 'Rent a car',
        hint: 'Freedom! Also: parking.',
        to: 'split',
        effects: { money: -70, energy: -6, happiness: 3, adventure: 2 },
        flags: { car: true },
        result: 'Freedom! The open road! The roundabout you have now circled four times!',
        tip: 'old-town-on-foot',
      },
    ],
  },
  2: {
    title: 'Day 2 · Choose your day trip',
    prompt: 'Marija/the hostel guitarist/the concierge has opinions about where you should go today. Everybody has opinions. Where to?',
    choices: [
      {
        id: 'to-trogir',
        label: 'Trogir — the island town',
        hint: 'Short trip, big history',
        to: 'trogir',
        effects: { money: -6, energy: -6, happiness: 3 },
        result: 'The bus drops you by a tiny bridge, and suddenly it’s 1450. Stone everywhere. Cats running the place.',
        tip: 'buy-ticket-before',
      },
      {
        id: 'to-omis',
        label: 'Omiš — pirates & canyon',
        hint: 'Adventure, river, fortresses',
        to: 'omis',
        effects: { money: -6, energy: -8, happiness: 3, adventure: 2 },
        result: 'The coast road twists like a plot. Then a canyon appears out of nowhere, as if the mountains had a dramatic argument.',
      },
      {
        id: 'to-krka',
        label: 'Krka — the waterfalls',
        hint: 'Long day, very pretty, very popular',
        to: 'krka',
        effects: { money: -35, energy: -14, happiness: 4 },
        result: 'A longer drive inland. Rolling hills, dry stone walls, and a growing suspicion that everyone else had the same idea.',
        tip: 'krka-season',
      },
    ],
  },
  3: {
    title: 'Day 3 · Island fever',
    prompt: 'Every postcard in Split shows an island. The port is full of boats and people shouting destinations. Time to decide.',
    choices: [
      {
        id: 'cat-hvar',
        label: 'Catamaran to Hvar',
        hint: 'Fast and glamorous, pricier',
        to: 'hvar',
        effects: { money: -40, energy: -8, happiness: 6, adventure: 3 },
        flags: { island: 1 },
        result: 'The catamaran skims the sea like it’s late for a party. Which, on Hvar, it probably is.',
        tip: 'ferry-vs-catamaran',
      },
      {
        id: 'ferry-brac',
        label: 'Car ferry to Brač',
        hint: 'Slower, cheaper, more seagulls',
        to: 'brac',
        effects: { money: -18, energy: -8, happiness: 5, adventure: 2, local: 1 },
        flags: { island: 1 },
        result: 'On the ferry deck, locals drink coffee with the serenity of people who have done this a thousand times.',
        tip: 'ferry-vs-catamaran',
      },
      {
        id: 'stay-mainland',
        label: 'Skip the islands, explore the mainland',
        hint: 'Avoid the boats, see another town',
        to: '@next-mainland',
        effects: { money: -6, energy: -6, happiness: 1, local: 1 },
        result: 'Islands can wait. The mainland has secrets too — and buses that don’t care about waves.',
      },
    ],
  },
  4: {
    title: 'Day 4 · The plot thickens',
    prompt: 'Day four. Your skin is a new colour, your phone is full of sunsets, and you know at least three Croatian words. What now?',
    // choices are generated by the engine from the current situation (see engine)
    choices: [],
  },
  5: {
    title: 'Day 5 · Grand finale',
    prompt: 'Last day. The holiday has one more chapter. Make it count.',
    choices: [],
  },
};

/** Day-4 options (filtered by situation in the engine). */
export const DAY4 = {
  stayIsland: {
    id: 'stay-island',
    label: 'Stay another day on the island',
    hint: 'Slow down, find the quiet side',
    effects: { money: -5, energy: -2, happiness: 4, local: 1 },
    flags: { island: 1 },
    result: 'You cancel exactly nothing, because you had no plans. That’s the island way.',
    tip: 'fjaka',
  },
  islandHop: {
    id: 'island-hop',
    label: 'Island-hop (via Split)',
    hint: 'Two islands in one holiday. Ambitious.',
    effects: { money: -45, energy: -14, happiness: 5, adventure: 4 },
    flags: { island: 1 },
    result: 'Boat, port, coffee, other boat. You are now a maritime professional. Possibly a pirate.',
    tip: 'wind-cancellations',
  },
  backMainland: {
    id: 'back-mainland',
    label: 'Back to the mainland',
    hint: 'See a place you missed',
    effects: { money: -20, energy: -10, happiness: 2 },
    result: 'Back on solid ground, which feels suspiciously stable after all that sea.',
  },
  mainlandNext: {
    id: 'mainland-next',
    label: 'Another mainland day trip',
    hint: 'Collect another town',
    effects: { money: -8, energy: -8, happiness: 3 },
    result: 'Another bus, another postcard-perfect stone town. You could get used to this.',
  },
  finallyIsland: {
    id: 'finally-island',
    label: 'Finally take a boat to an island',
    hint: 'It would be rude not to',
    effects: { money: -20, energy: -8, happiness: 6, adventure: 3 },
    flags: { island: 1 },
    result: 'The ferry horn sounds. Somewhere a seagull files a complaint. You are on your way.',
    tip: 'ferry-vs-catamaran',
  },
  stuck: {
    id: 'stuck-stay',
    label: 'Accept fate and stay',
    hint: 'The boats are not going anywhere',
    effects: { happiness: 2, local: 2 },
    flags: { island: 1 },
    result: 'The harbour café becomes your office. The waiter starts bringing your coffee before you order it.',
    tip: 'pomalo',
  },
  privateBoat: {
    id: 'private-boat',
    label: 'Pay a private boat to get out',
    hint: 'Very expensive. Very dramatic.',
    effects: { money: -120, energy: -10, happiness: -2, adventure: 4 },
    result: 'A man named Ante agrees to “maybe” take you across. The ride is bumpy, the price is not.',
  },
};

/** Day-5 options. */
export const DAY5 = {
  coachDubrovnik: {
    id: 'coach-dubrovnik',
    label: 'Coach down the coast to Dubrovnik',
    hint: 'Long ride, legendary finale',
    to: 'dubrovnik',
    effects: { money: -30, energy: -18, happiness: 6, adventure: 3 },
    result: 'Hours of coastline so blue it looks edited. Then the walls appear, and the whole bus goes quiet.',
    tip: 'peljesac-bridge',
  },
  islandToDubrovnik: {
    id: 'island-dubrovnik',
    label: 'Boat back, then coach to Dubrovnik',
    hint: 'Exhausting. Glorious.',
    to: 'dubrovnik',
    effects: { money: -50, energy: -28, happiness: 5, adventure: 5 },
    result: 'Boat, bus, nap, bus. You arrive in Dubrovnik slightly crumpled but heroic.',
    tip: 'peljesac-bridge',
  },
  farewellSplit: {
    id: 'farewell-split',
    label: 'A slow farewell day in Split',
    hint: 'Markets, coffee, sunset — the local way',
    to: 'split',
    effects: { money: -5, energy: 4, happiness: 5, local: 2 },
    result: 'No timetable, no rush. Just one more day of being a temporary Splićanin.',
    tip: 'kava-ritual',
  },
};

/* ───────────────────────────────────────── ACTIVITIES (per destination) ── */

export const ACTIVITIES = {
  split: [
    {
      id: 'palace',
      label: 'Explore Diocletian’s Palace',
      hint: 'Roman emperor, modern laundry lines',
      effects: { money: -10, energy: -10, happiness: 8, adventure: 2 },
      result: 'You stand in the Peristyle, where an emperor once stood. Above you, someone is hanging out their socks. History is alive.',
      tip: 'palace-lived-in',
    },
    {
      id: 'picigin',
      label: 'Play picigin at Bačvice',
      hint: 'Splash, dive, look ridiculous',
      effects: { energy: -15, happiness: 10, adventure: 3, local: 1 },
      result: 'You dive for the ball, miss spectacularly, and get a standing ovation from three retired gentlemen in Speedos.',
      tip: 'picigin',
    },
    {
      id: 'marjan',
      label: 'Hike up Marjan hill',
      hint: 'Pine shade, big views, many steps',
      effects: { energy: -20, happiness: 8, adventure: 4 },
      result: 'Every step is a negotiation with your legs. The view of Split and the islands settles the argument.',
      tip: 'tap-water',
    },
    {
      id: 'salona-ruins',
      label: 'Bus out to the Roman ruins of Salona',
      hint: 'An amphitheatre without the crowds',
      effects: { money: -12, energy: -12, happiness: 8, adventure: 3, local: 1 },
      flags: { hidden: 1 },
      result: 'An entire Roman city, a few lizards and almost nobody else. You sit in the amphitheatre and give a short speech to the lizards. They are a tough crowd.',
      tip: 'salona',
    },
    {
      id: 'pazar-morning',
      label: 'Morning at the Pazar market',
      hint: 'Figs, cheese, loud bargains',
      effects: { money: -8, energy: -5, happiness: 7, local: 2 },
      flags: { market: 1 },
      result: 'A vendor makes you taste three kinds of figs “for science”. You leave with a bag of them and a new best friend.',
      tip: 'pazar',
    },
  ],
  trogir: [
    {
      id: 'kamerlengo',
      label: 'Climb Kamerlengo Fortress',
      hint: 'Views over the whole old town',
      effects: { money: -14, energy: -10, happiness: 8, adventure: 2 },
      result: 'From the top, Trogir looks like someone arranged terracotta roofs very carefully and then added boats for decoration.',
      tip: 'kamerlengo',
    },
    {
      id: 'trogir-lanes',
      label: 'Get lost in the lanes',
      hint: 'Free, wonderful, mildly confusing',
      effects: { energy: -8, happiness: 7, local: 1 },
      flags: { hidden: 1 },
      result: 'You get gloriously lost three times in a town you can cross in fifteen minutes. A cat shows you the way out. Probably.',
      tip: 'trogir-unesco',
    },
    {
      id: 'trogir-marenda',
      label: 'Hunt for a proper marenda',
      hint: 'Late-morning feast, local style',
      effects: { money: -12, energy: 10, happiness: 8, local: 2 },
      flags: { konoba: 1 },
      result: 'At 10:30 a.m., you eat a plate of fish stew alongside dockworkers. Nobody finds this strange. You feel reborn.',
      tip: 'marenda',
    },
  ],
  omis: [
    {
      id: 'kayak',
      label: 'Kayak up the Cetina canyon',
      hint: 'Paddles, cliffs, the occasional splash fight',
      effects: { money: -35, energy: -18, happiness: 12, adventure: 6 },
      result: 'Cliffs tower overhead, the water is impossibly green, and you lose a splash fight to a nine-year-old from Graz.',
      tip: 'cetina-canyon',
    },
    {
      id: 'mirabela',
      label: 'Storm the Mirabela fortress',
      hint: 'Short climb, pirate views',
      effects: { money: -5, energy: -10, happiness: 8, adventure: 3 },
      result: 'You reach the top and immediately understand why pirates liked it here: you can see every boat coming. And every bakery.',
      tip: 'omis-pirates',
    },
    {
      id: 'soparnik',
      label: 'Find real soparnik',
      hint: 'Ancient chard pie. Trust the process.',
      effects: { money: -8, energy: 6, happiness: 7, local: 2 },
      flags: { konoba: 1 },
      result: 'It’s chard, dough and olive oil. It shouldn’t be this good. It is this good.',
      tip: 'soparnik',
    },
  ],
  krka: [
    {
      id: 'skradinski',
      label: 'Walk the Skradinski buk boardwalks',
      hint: 'Waterfalls everywhere',
      effects: { energy: -14, happiness: 10, adventure: 3 },
      result: 'Water falls over travertine terraces in every direction. You take 212 photos. All of them are of the same waterfall.',
      tip: 'go-early',
    },
    {
      id: 'skradin-boat',
      label: 'Arrive by boat from Skradin',
      hint: 'River cruise into the park',
      effects: { money: -5, energy: -6, happiness: 9, adventure: 2 },
      result: 'The boat glides up the river past reeds and herons. Arriving by water feels like entering a film set.',
      tip: 'krka-transfers',
    },
    {
      id: 'krka-picnic',
      label: 'Picnic away from the crowds',
      hint: 'Quiet corner, sandwiches, birdsong',
      effects: { money: -6, energy: 8, happiness: 7, local: 1 },
      flags: { hidden: 1 },
      result: 'Five minutes off the main path, the crowds vanish. It’s just you, a sandwich and a very nosy lizard.',
      tip: 'tap-water',
    },
  ],
  hvar: [
    {
      id: 'fortica',
      label: 'Sunset at the Spanish Fortress',
      hint: 'Uphill, unforgettable',
      effects: { money: -10, energy: -12, happiness: 11, adventure: 3 },
      result: 'The sun drops behind the Pakleni islands and the whole harbour turns gold. Even the yachts look humbled.',
      tip: 'hvar-fortress',
    },
    {
      id: 'pakleni-taxi',
      label: 'Taxi boat to the Pakleni islands',
      hint: 'Quiet coves, clear water',
      effects: { money: -25, energy: -10, happiness: 12, adventure: 5 },
      flags: { hidden: 1 },
      result: 'Ten minutes by boat and the party noise is gone. You snorkel over a seabed so clear it looks like glass.',
      tip: 'pakleni',
    },
    {
      id: 'lavender',
      label: 'Wander the lavender villages',
      hint: 'Purple fields, sleepy stone hamlets',
      effects: { money: -12, energy: -8, happiness: 9, local: 2 },
      flags: { market: 1 },
      result: 'An old man sells you lavender oil from a table outside his house and refuses to let you leave without a fig.',
      tip: 'hvar-lavender',
    },
    {
      id: 'stari-grad',
      label: 'Cycle the Stari Grad Plain',
      hint: 'Ancient fields, very few tourists',
      effects: { money: -10, energy: -14, happiness: 8, adventure: 4 },
      flags: { hidden: 1 },
      result: 'Olive groves, vineyards and stone walls laid out by ancient Greeks. Your bike squeaks in protest. The landscape does not care.',
      tip: 'stari-grad-plain',
    },
  ],
  brac: [
    {
      id: 'zlatni-rat',
      label: 'Swim at Zlatni rat',
      hint: 'The famous beach',
      effects: { energy: -10, happiness: 10, adventure: 2 },
      result: 'The pebble spit points into the sea like a golden finger. You float. You exist. Life is good.',
      tip: 'zlatni-rat',
    },
    {
      id: 'vidova-gora',
      label: 'Hike up Vidova Gora',
      hint: 'The highest island peak',
      effects: { energy: -22, happiness: 10, adventure: 6 },
      flags: { hidden: 1 },
      result: 'Sweaty, triumphant, and staring down at Zlatni rat from far above. Worth every drop of sweat. Most of them.',
      tip: 'vidova-gora',
    },
    {
      id: 'pucisca',
      label: 'Visit the stonemasons of Pučišća',
      hint: 'White stone, quiet harbour',
      effects: { money: -5, energy: -8, happiness: 7, local: 2 },
      flags: { hidden: 1 },
      result: 'Students chip away at blocks of white stone with centuries-old techniques. You try for 30 seconds and produce “gravel”.',
      tip: 'pucisca-stone',
    },
    {
      id: 'brac-konoba',
      label: 'Lunch at a hillside konoba',
      hint: 'Lamb, olive oil, long table',
      effects: { money: -28, energy: 10, happiness: 10, local: 2 },
      flags: { konoba: 1 },
      result: 'Three hours, four courses, one rakija you did not order. The owner calls you “prijatelju” — friend.',
      tip: 'konoba',
    },
  ],
  dubrovnik: [
    {
      id: 'walls-early',
      label: 'Walk the city walls at opening time',
      hint: 'Early alarm, empty walls',
      effects: { money: -35, energy: -14, happiness: 13, adventure: 3 },
      result: 'Just you, the walls, the sea and a cat who looks unimpressed. By the time the crowds arrive, you’re having coffee.',
      tip: 'go-early',
    },
    {
      id: 'walls-midday',
      label: 'Walk the walls whenever',
      hint: 'Sleep in, deal with it later',
      effects: { money: -35, energy: -24, happiness: 5, adventure: 2 },
      result: 'Noon. 34 degrees in your head. Three tour groups. Someone’s selfie stick nearly enters your ear. Still: magnificent.',
      tip: 'cruise-days',
    },
    {
      id: 'lokrum',
      label: 'Escape to Lokrum island',
      hint: 'Shade, swimming, peacocks',
      effects: { money: -20, energy: -6, happiness: 11, adventure: 3 },
      flags: { hidden: 1 },
      result: 'Ten minutes by boat and the crowds disappear. A peacock fans its tail at you. You are not sure if it is a greeting or a threat.',
      tip: 'lokrum',
    },
  ],
};

/* ──────────────────────────────────────────────────────── EVENTS ── */
/**
 * where: destination ids (or ['any'])  ·  when(state) optional condition
 * weight: relative chance  ·  choices: 2–3, each with effects/result/tip
 * chance: { p, success:{effects,result}, fail:{effects,result} } — rolled with
 *         the run's seeded RNG, so daily players get identical outcomes.
 */
export const EVENTS = [
  // ───── Split
  {
    id: 'fish-mystery',
    where: ['split', 'trogir', 'hvar'],
    weight: 3,
    title: 'The Fish Price Mystery',
    story: 'A waiter on the waterfront presents a silver tray of glistening fish. “Fresh today!” The menu says only: “Fish — per kg”. Your stomach says yes. Your wallet asks questions.',
    choices: [
      {
        id: 'point-big',
        label: 'Point at the biggest one',
        effects: { money: -95, happiness: 2 },
        result: 'It was delicious. It was also, apparently, the weight of a small child. The bill arrives with the gravity of a court verdict.',
        tip: 'fish-per-kilo',
      },
      {
        id: 'ask-weight',
        label: 'Ask the weight and total first',
        effects: { money: -40, happiness: 7, local: 1 },
        result: 'The waiter weighs it, names the total, and nods with new respect. You order a smaller fish and the legendary blitva.',
        tip: 'blitva',
      },
      {
        id: 'konoba-alley',
        label: 'Walk two streets back to a konoba',
        effects: { money: -30, happiness: 9, local: 2 },
        flags: { konoba: 1 },
        result: 'Handwritten menu, four tables, a grandmother in the kitchen. The pašticada changes your understanding of beef.',
        tip: 'pasticada',
      },
    ],
  },
  {
    id: 'three-hour-coffee',
    where: ['split', 'omis', 'trogir', 'brac'],
    weight: 2,
    title: 'The Three-Hour Coffee',
    story: 'You sit down for “a quick coffee”. The locals at the next table have been here since you landed. One of them invites you over.',
    choices: [
      {
        id: 'join',
        label: 'Join them',
        effects: { energy: 12, happiness: 8, local: 2 },
        result: 'Two hours later you know their kids’ names, their football opinions and a secret beach. You have drunk one macchiato.',
        tip: 'kava-ritual',
      },
      {
        id: 'rush',
        label: 'Politely rush off to “see things”',
        effects: { energy: -4, happiness: 1, adventure: 1 },
        result: 'You see things. Lovely things. But somewhere behind you, a table of new friends shrugs and orders another round.',
      },
    ],
  },
  {
    id: 'sunbed-economics',
    where: ['split', 'brac', 'hvar', 'trogir'],
    weight: 2,
    title: 'Sunbed Economics',
    story: 'The beach is lined with neat rows of sunbeds and umbrellas. A man with a clipboard approaches with the confidence of a tax inspector.',
    choices: [
      {
        id: 'rent',
        label: 'Rent the full sunbed package',
        effects: { money: -30, energy: 8, happiness: 5 },
        result: 'Shade, a cushion and a cocktail menu. You feel like a minor celebrity, briefly.',
      },
      {
        id: 'towel',
        label: 'Spread your towel on the free pebbles',
        effects: { energy: 3, happiness: 6, local: 1 },
        result: 'The pebbles massage your back in ways you did not request. Free sea, free sun, no clipboard.',
        tip: 'public-beaches',
      },
    ],
  },
  {
    id: 'parking-odyssey',
    where: ['split', 'trogir', 'dubrovnik'],
    when: (s) => s.flags.car,
    weight: 6,
    title: 'The Parking Odyssey',
    story: 'Your rental car and you have entered a street that narrows with every metre. A Roman wall approaches. So does a man with a very expressive face.',
    choices: [
      {
        id: 'push-on',
        label: 'Squeeze through, it’ll be fine',
        effects: { money: -60, energy: -10, happiness: -8 },
        result: 'It was not fine. The mirror is now a modern art piece. The man’s face has become even more expressive.',
      },
      {
        id: 'park-outside',
        label: 'Reverse out, park outside the centre and walk',
        effects: { money: -12, energy: -6, happiness: 3, local: 1 },
        result: 'Ten minutes of walking, zero scratched mirrors. The expressive man gives you a thumbs up. Respect earned.',
        tip: 'old-town-on-foot',
      },
    ],
  },
  {
    id: 'klapa-vestibule',
    where: ['split', 'dubrovnik', 'trogir'],
    weight: 2,
    title: 'Voices in the Stone',
    story: 'From a dark stone hall you hear harmonies — five men in white shirts singing without instruments. The acoustics do the rest.',
    choices: [
      {
        id: 'listen',
        label: 'Stop and listen',
        effects: { money: -5, happiness: 10, local: 1 },
        result: 'Goosebumps in thirty-degree heat. You buy their CD, even though you no longer own anything that plays CDs.',
        tip: 'klapa',
      },
      {
        id: 'hum-along',
        label: 'Try to sing along',
        effects: { happiness: 6, adventure: 2 },
        result: 'You hum confidently in the wrong key. The tenor raises an eyebrow, then generously invites you to clap instead.',
        tip: 'klapa',
      },
    ],
  },
  {
    id: 'lost-in-translation',
    where: ['any'],
    weight: 2,
    title: 'Lost in Translation',
    story: 'At a bakery, the lady behind the counter asks you something in rapid Croatian. Everyone in the queue turns to look at you.',
    choices: [
      {
        id: 'phrases',
        label: 'Deploy your Croatian: “Dobar dan! … Molim … Hvala!”',
        effects: { money: -3, happiness: 8, local: 2 },
        flags: { phrases: 1 },
        result: 'She beams, calls you “bravo”, and slips an extra burek into the bag. The queue nods approvingly. You are basically a citizen.',
        tip: 'croatian-basics',
      },
      {
        id: 'point',
        label: 'Point and smile intensely',
        effects: { money: -6, happiness: 3 },
        result: 'You receive something. It is round and delicious. You will never know what it was.',
      },
    ],
  },
  {
    id: 'urchin',
    where: ['split', 'brac', 'hvar', 'omis', 'trogir'],
    weight: 2,
    title: 'The Spiky Neighbour',
    story: 'The water is crystal clear. So are the small black spiky balls on the rocks right where you were about to step.',
    choices: [
      {
        id: 'barefoot',
        label: 'Tiptoe barefoot, carefully',
        chance: {
          p: 0.5,
          success: { effects: { happiness: 6, adventure: 2 }, result: 'Ballet-level footwork. You make it into the sea untouched and smug.' },
          fail: { effects: { energy: -12, happiness: -8 }, result: 'Ouch. Ouch. A local hands you olive oil and a needle with the calm of someone who has done this a lot.' },
        },
        tip: 'water-shoes',
      },
      {
        id: 'buy-shoes',
        label: 'Buy water shoes at the kiosk',
        effects: { money: -12, happiness: 5 },
        result: 'You look like a scuba-diving duck. You also look like someone whose feet are fine.',
        tip: 'water-shoes',
      },
      {
        id: 'other-spot',
        label: 'Walk to the next cove',
        effects: { energy: -6, happiness: 6, adventure: 2 },
        flags: { hidden: 1 },
        result: 'The next cove is smaller, urchin-free and completely empty. Sometimes cowardice is just good scouting.',
      },
    ],
  },
  {
    id: 'heatwave',
    where: ['any'],
    when: (s) => s.energy < 60,
    weight: 3,
    title: 'The Midday Sun Strikes Back',
    story: 'It’s the hottest part of the day. The stones are radiating heat, your water bottle is empty and your enthusiasm is evaporating.',
    choices: [
      {
        id: 'fjaka',
        label: 'Surrender to fjaka in the shade',
        effects: { energy: 15, happiness: 6, local: 1 },
        result: 'You lie under a pine tree and do nothing, magnificently, for an hour. A local walks past and nods: you understand.',
        tip: 'fjaka',
      },
      {
        id: 'push',
        label: 'Push on — sightseeing waits for no one',
        effects: { energy: -15, happiness: -4, adventure: 2 },
        result: 'You see everything, through a haze, while slowly turning the colour of a ripe tomato.',
        tip: 'go-early',
      },
      {
        id: 'refill',
        label: 'Refill at a public fountain and slow down',
        effects: { energy: 8, happiness: 4 },
        result: 'Cold water, a shady bench, a gelato. Civilisation restored.',
        tip: 'tap-water',
      },
    ],
  },
  {
    id: 'rakija-welcome',
    where: ['any'],
    weight: 2,
    title: 'A Small Glass of Something',
    story: 'Your host appears with a bottle of something greenish and two tiny glasses. “Travarica! Domaća — home-made!”',
    choices: [
      {
        id: 'sip',
        label: 'Sip and say “Živjeli!”',
        effects: { happiness: 8, local: 2, energy: -3 },
        flags: { phrases: 1 },
        result: 'It tastes like a herb garden that took up boxing. Your host is delighted. A second glass appears from nowhere.',
        tip: 'travarica',
      },
      {
        id: 'decline',
        label: 'Decline politely',
        effects: { happiness: 2 },
        result: 'Your host shrugs, drinks both glasses, and tells you about his cousin in Australia anyway.',
      },
    ],
  },
  {
    id: 'secret-beach',
    where: ['any'],
    when: (s) => s.local >= 3,
    weight: 3,
    title: 'The Beach With No Name',
    story: 'One of your new local friends leans in: “There’s a beach. No sign, no bar, no influencers. Want to see?”',
    choices: [
      {
        id: 'go',
        label: 'Absolutely',
        effects: { energy: -8, happiness: 14, adventure: 5, local: 1 },
        flags: { hidden: 1 },
        result: 'A goat path, a scramble, and then: turquoise water and nobody. You swear an oath of secrecy. You will keep it, mostly.',
        tip: 'public-beaches',
      },
      {
        id: 'nap',
        label: 'Politely choose a nap instead',
        effects: { energy: 15, happiness: 2 },
        result: 'You sleep like a cat on a warm stone. Your friend sends photos of the beach. They are… very nice.',
      },
    ],
  },
  {
    id: 'market-haul',
    where: ['split', 'trogir', 'omis'],
    weight: 2,
    title: 'Market Morning',
    story: 'Stalls overflow with tomatoes, figs, cheese and lavender. A vendor waves a slice of melon at you like a hypnotist.',
    choices: [
      {
        id: 'picnic',
        label: 'Build a market picnic',
        effects: { money: -12, energy: 8, happiness: 8, local: 2 },
        flags: { market: 1 },
        result: 'Bread, cheese, figs and tomatoes on a bench by the sea. The best meal of the trip cost less than a cocktail.',
        tip: 'pazar',
      },
      {
        id: 'souvenirs',
        label: 'Buy “authentic” souvenirs at the stand nearby',
        effects: { money: -25, happiness: 2 },
        result: 'Your fridge magnet says “Croatia” in a font usually reserved for heavy-metal albums.',
        tip: 'photo-menus',
      },
    ],
  },

  // ───── Trogir / Omiš / Krka
  {
    id: 'wedding-riva',
    where: ['trogir', 'split', 'omis'],
    weight: 2,
    title: 'The Wedding Procession',
    story: 'Car horns, flags, singing: a Dalmatian wedding procession sweeps along the waterfront and absorbs you like a friendly wave.',
    choices: [
      {
        id: 'dance',
        label: 'Dance along for a song',
        effects: { energy: -10, happiness: 12, adventure: 3, local: 1 },
        result: 'An aunt teaches you a step, an uncle hands you a drink, and somehow you appear in the wedding video. Congratulations to the couple!',
      },
      {
        id: 'watch',
        label: 'Cheer from the side',
        effects: { happiness: 6 },
        result: 'You clap, they wave. A beautiful moment, preserved forever in 34 of your photos.',
      },
    ],
  },
  {
    id: 'pirate-grandpa',
    where: ['omis'],
    weight: 4,
    title: 'Grandpa of the Pirates',
    story: 'On a bench by the river, an old man tells anyone who listens that his family once ruled these waters. “Pirates,” he says. “Very good pirates.”',
    choices: [
      {
        id: 'listen',
        label: 'Listen to his stories',
        effects: { energy: 4, happiness: 8, local: 2 },
        result: 'Two hours of sieges, sea battles and an alarmingly detailed recipe for octopus. You leave with a map drawn on a napkin.',
        tip: 'omis-pirates',
      },
      {
        id: 'challenge',
        label: 'Challenge him to a game of briškula',
        chance: {
          p: 0.35,
          success: { effects: { happiness: 12, local: 3, adventure: 2 }, result: 'Beginner’s luck! You win. He demands a rematch “tomorrow, same time”. You have been adopted.' },
          fail: { effects: { happiness: 5, local: 1, money: -5 }, result: 'You lose spectacularly and pay for the coffees. He is very gracious about it. Pirates usually are, after winning.' },
        },
      },
    ],
  },
  {
    id: 'canyon-sunburn',
    where: ['omis', 'krka'],
    weight: 2,
    title: 'Too Much of a Good Thing',
    story: 'The day was perfect. Your shoulders, however, are now the colour of a Dalmatian sunset. And they hurt like one.',
    choices: [
      {
        id: 'pharmacy',
        label: 'Visit a pharmacy for after-sun',
        effects: { money: -12, energy: 5, happiness: 2 },
        result: 'The pharmacist hands you a cream and a look that says “every summer, the same thing”.',
      },
      {
        id: 'ignore',
        label: 'Ignore it, you’re tough',
        effects: { energy: -12, happiness: -6 },
        result: 'You are not tough. You are a lobster with a backpack.',
        tip: 'go-early',
      },
    ],
  },
  {
    id: 'krka-crowd',
    where: ['krka'],
    weight: 4,
    title: 'The Midday Stampede',
    story: 'Bus after bus arrives at the entrance. The boardwalk becomes a slow-moving river of selfie sticks.',
    choices: [
      {
        id: 'wait-it-out',
        label: 'Wait it out with an ice cream',
        effects: { money: -4, energy: 6, happiness: 4 },
        result: 'By the time your ice cream is gone, so is half the crowd. Patience: rewarded.',
        tip: 'go-early',
      },
      {
        id: 'side-trail',
        label: 'Take a quieter side trail',
        effects: { energy: -8, happiness: 9, adventure: 3 },
        flags: { hidden: 1 },
        result: 'Birdsong, small cascades and a bench with nobody on it. You have found the part of Krka the brochures forgot.',
      },
    ],
  },
  {
    id: 'krka-ticket-surprise',
    where: ['krka'],
    weight: 3,
    title: 'The Ticket Office Revelation',
    story: 'A couple in front of you is arguing about the ticket price — apparently it depends heavily on the month. They look at you as if you might be the tiebreaker.',
    choices: [
      {
        id: 'explain',
        label: 'Explain seasonal prices like a local',
        effects: { happiness: 6, local: 2 },
        result: 'You become, briefly, the most knowledgeable person in the queue. They buy you a coffee for the trouble.',
        tip: 'krka-season',
      },
      {
        id: 'stay-out',
        label: 'Stay out of it',
        effects: { happiness: 1 },
        result: 'Wise. Very wise. They are still arguing as you board the boat.',
        tip: 'krka-transfers',
      },
    ],
  },

  // ───── Islands
  {
    id: 'bura-cancel',
    where: ['hvar', 'brac'],
    weight: 3,
    once: true,
    title: 'The Bura Has Opinions',
    story: 'The wind howls in from the mountains. At the port, a hand-written sign appears: sailings disrupted. The sea looks like it’s practising for a disaster film.',
    choices: [
      {
        id: 'accept',
        label: 'Accept it: one more island night',
        effects: { money: -20, happiness: 4, local: 2 },
        flags: { stranded: true, ferrySurvivor: true },
        result: 'You check in to a tiny guesthouse, eat grilled squid with the other stranded travellers and form a support group. It’s the best evening of the trip.',
        tip: 'wind-cancellations',
      },
      {
        id: 'panic',
        label: 'Panic and refresh the timetable 40 times',
        effects: { energy: -12, happiness: -6 },
        flags: { stranded: true, ferrySurvivor: true },
        result: 'The timetable does not change. Your blood pressure does. Eventually you also end up eating grilled squid.',
        tip: 'wind-cancellations',
      },
      {
        id: 'early-ferry',
        label: 'Gamble on the first ferry tomorrow',
        chance: {
          p: 0.5,
          success: { effects: { happiness: 6, adventure: 3 }, flags: { ferrySurvivor: true }, result: 'The wind drops overnight and the first ferry sails. You wave goodbye to the island like a returning hero.' },
          fail: { effects: { energy: -8, happiness: -3 }, flags: { stranded: true, ferrySurvivor: true }, result: 'No ferry. Just you, the harbour cat and a very long coffee. You are staying.' },
        },
        tip: 'ferry-vs-catamaran',
      },
    ],
  },
  {
    id: 'party-boat',
    where: ['hvar'],
    weight: 3,
    title: 'The Party Boat',
    story: 'A boat thumping with music pulls into the harbour. A man in sunglasses the size of windows shouts: “Last two places! Unlimited fun!”',
    choices: [
      {
        id: 'board',
        label: 'Jump aboard',
        effects: { money: -60, energy: -25, happiness: 10, adventure: 4 },
        result: 'You dance, you swim, you lose a flip-flop to the Adriatic. Tomorrow-you will have thoughts about this.',
      },
      {
        id: 'sunset-wine',
        label: 'Watch it leave from a quiet wine bar',
        effects: { money: -15, energy: 4, happiness: 8, local: 1 },
        result: 'Local plavac mali, a view of the harbour, and the satisfying sound of someone else’s party fading into the distance.',
      },
    ],
  },
  {
    id: 'zlatni-wind',
    where: ['brac'],
    weight: 3,
    title: 'Windsurf Wednesday',
    story: 'Zlatni rat is buzzing. The wind is up and the windsurf school is offering a beginner lesson. The instructor looks you up and down, sceptically.',
    choices: [
      {
        id: 'lesson',
        label: 'Take the lesson',
        chance: {
          p: 0.4,
          success: { effects: { money: -40, energy: -15, happiness: 14, adventure: 6 }, result: 'You stand up! For eleven glorious seconds! The instructor actually claps!' },
          fail: { effects: { money: -40, energy: -18, happiness: 6, adventure: 4 }, result: 'You fall off 47 times. The instructor stops counting at 30. Still, it was weirdly fun.' },
        },
      },
      {
        id: 'watch-surfers',
        label: 'Watch from the beach with an ice cream',
        effects: { money: -4, energy: 4, happiness: 6 },
        result: 'Watching other people fall into the sea is a very relaxing spectator sport.',
        tip: 'zlatni-rat',
      },
    ],
  },
  {
    id: 'olive-grove',
    where: ['brac', 'hvar'],
    weight: 2,
    title: 'Olive Oil Diplomacy',
    story: 'A farmer at the roadside invites you to taste his olive oil, poured onto bread with the seriousness of a sommelier.',
    choices: [
      {
        id: 'taste',
        label: 'Taste and buy a bottle',
        effects: { money: -15, happiness: 8, local: 2 },
        flags: { market: 1 },
        result: 'Peppery, green and dangerously good. You now pour olive oil on things that do not need olive oil.',
      },
      {
        id: 'compliment',
        label: 'Taste, compliment, move on',
        effects: { happiness: 4, local: 1 },
        result: 'He nods, unoffended. A compliment from a tourist is still a compliment.',
      },
    ],
  },
  {
    id: 'lost-luggage-island',
    where: ['hvar', 'brac'],
    weight: 1,
    title: 'Where Is My Bag?',
    story: 'You step off the boat. Your bag does not. It waves goodbye from the deck as the ferry sails on.',
    choices: [
      {
        id: 'call',
        label: 'Call the port office and wait',
        effects: { energy: -8, happiness: -3, local: 1 },
        result: 'It comes back on the evening boat, smelling faintly of diesel and adventure. The port officer is your new hero.',
      },
      {
        id: 'buy-new',
        label: 'Buy a new swimsuit and stop worrying',
        effects: { money: -35, happiness: 4 },
        result: 'The only swimsuit in your size has lemons on it. You wear it proudly. The bag turns up anyway.',
      },
    ],
  },

  // ───── Dubrovnik
  {
    id: 'got-guide',
    where: ['dubrovnik'],
    weight: 3,
    title: 'Winter Is Coming (In August)',
    story: 'A tour guide in a cape offers a “Game of Thrones walking tour”. He shouts “Shame!” at a pigeon to demonstrate.',
    choices: [
      {
        id: 'join-tour',
        label: 'Join the tour',
        effects: { money: -25, energy: -10, happiness: 9, adventure: 2 },
        result: 'You climb the famous staircase, recreate a famous scene, and get a group photo with 40 strangers in matching T-shirts.',
        tip: 'got-dubrovnik',
      },
      {
        id: 'real-history',
        label: 'Skip it and read about the real Republic of Ragusa',
        effects: { happiness: 6, local: 1 },
        result: 'Turns out the real history — a tiny republic of diplomats and merchants — is even better than the show. And nobody shouts at pigeons.',
      },
    ],
  },
  {
    id: 'cruise-wave',
    where: ['dubrovnik'],
    weight: 4,
    title: 'The Cruise-Ship Wave',
    story: 'Three enormous ships have docked. The main street fills up like a bathtub. A tide of lanyards approaches.',
    choices: [
      {
        id: 'dive-in',
        label: 'Dive into the crowd anyway',
        effects: { energy: -14, happiness: -2, adventure: 1 },
        result: 'You move at the speed of a glacier. On the bright side, you’ve memorised the back of a man’s Hawaiian shirt.',
        tip: 'cruise-days',
      },
      {
        id: 'side-streets',
        label: 'Escape to the steep side streets',
        effects: { energy: -6, happiness: 8, local: 1 },
        flags: { hidden: 1 },
        result: 'Two hundred steps up, laundry lines, cats and silence. The real Dubrovnik was hiding upstairs all along.',
        tip: 'cruise-days',
      },
      {
        id: 'evening',
        label: 'Swim now, see the old town in the evening',
        effects: { energy: 6, happiness: 9 },
        result: 'By sunset the ships have sailed and the stone glows gold. You have the main street almost to yourself.',
        tip: 'go-early',
      },
    ],
  },
  {
    id: 'peacock-heist',
    where: ['dubrovnik'],
    weight: 2,
    title: 'The Peacock Heist',
    story: 'You unwrap a sandwich on a shady bench. A peacock appears. It looks at the sandwich. It looks at you. It has done this before.',
    choices: [
      {
        id: 'defend',
        label: 'Defend your sandwich',
        chance: {
          p: 0.3,
          success: { effects: { happiness: 8, adventure: 2 }, result: 'Victory! The peacock retreats with wounded dignity. You eat your sandwich like a champion.' },
          fail: { effects: { happiness: 3, money: -8 }, result: 'The peacock wins. It always wins. You buy another sandwich and a little more respect for birds.' },
        },
        tip: 'lokrum',
      },
      {
        id: 'share',
        label: 'Accept defeat gracefully',
        effects: { happiness: 6, money: -6 },
        result: 'You and the peacock reach an understanding. It gets the crust. You get a photo that will win you every holiday-story contest.',
        tip: 'lokrum',
      },
    ],
  },

  // ───── Farewell Split / generic finale
  {
    id: 'peka-order',
    where: ['split', 'brac', 'hvar', 'omis'],
    weight: 2,
    title: 'Peka, Please',
    story: 'You walk into a konoba starving and ask for the famous peka. The waiter looks at the clock, then at you, with deep sympathy.',
    choices: [
      {
        id: 'order-tomorrow',
        label: 'Order peka for tomorrow, eat grilled fish today',
        effects: { money: -30, happiness: 9, local: 2 },
        flags: { konoba: 1 },
        result: 'Grilled fish tonight, peka reserved for tomorrow. The waiter shakes your hand. You have passed the test.',
        tip: 'peka',
      },
      {
        id: 'demand-now',
        label: 'Insist: peka now!',
        effects: { money: -20, happiness: -3 },
        result: 'You get… a pizza. A good pizza! But not peka. The table next to you gets their pre-ordered peka and you can smell every second of it.',
        tip: 'peka',
      },
    ],
  },
  {
    id: 'souvenir-chaos',
    where: ['any'],
    when: (s) => s.day >= 4,
    weight: 2,
    title: 'The Souvenir Panic',
    story: 'You suddenly remember you promised souvenirs to everyone. Everyone. Including your boss. And your neighbour’s dog.',
    choices: [
      {
        id: 'local-goods',
        label: 'Buy olive oil, lavender and local honey at a market',
        effects: { money: -30, happiness: 7, local: 2 },
        flags: { market: 1 },
        result: 'Real local products, made by real people, wrapped in newspaper by a lady who calls you “dušo” — darling. She only takes cash. You came prepared.',
        tip: 'euro-and-cash',
      },
      {
        id: 'magnets',
        label: 'Buy 14 identical magnets',
        effects: { money: -20, happiness: 2 },
        result: 'Efficient. Soulless. The dog will not care either way.',
      },
    ],
  },
  {
    id: 'sunset-spot',
    where: ['any'],
    when: (s) => s.day === 5,
    weight: 3,
    title: 'The Last Sunset',
    story: 'Your final evening. The sun is sliding towards the sea. You have one chance to choose where to watch it.',
    choices: [
      {
        id: 'crowded-bar',
        label: 'The famous sunset bar',
        effects: { money: -25, happiness: 7 },
        result: 'Lovely sunset, framed by 200 phones held up in perfect synchronisation. You are one of them.',
      },
      {
        id: 'rocks',
        label: 'A quiet rock by the sea, with a cold drink from the shop',
        effects: { money: -3, happiness: 11, local: 1 },
        result: 'Just you, the warm stone, the sound of the waves and a sky turning every colour. Pomalo.',
        tip: 'pomalo',
      },
    ],
  },
];

/* ───────────────────────────────────────────────── ACHIEVEMENTS ── */

export const ACHIEVEMENTS = [
  {
    id: 'konoba-expert',
    title: 'Konoba Expert',
    emoji: '🍷',
    description: 'Eat at two konobas or local family places.',
    test: (s) => (s.flags.konoba ?? 0) >= 2,
  },
  {
    id: 'island-survivor',
    title: 'Island Survivor',
    emoji: '⛵',
    description: 'Survive a wind-cancelled sailing.',
    test: (s) => Boolean(s.flags.ferrySurvivor),
  },
  {
    id: 'local-explorer',
    title: 'Local Explorer',
    emoji: '🧭',
    description: 'Discover three hidden places away from the crowds.',
    test: (s) => (s.flags.hidden ?? 0) >= 3,
  },
  {
    id: 'market-master',
    title: 'Market Master',
    emoji: '🧺',
    description: 'Shop like a local at two markets or farm stalls.',
    test: (s) => (s.flags.market ?? 0) >= 2,
  },
  {
    id: 'budget-genius',
    title: 'Budget Genius',
    emoji: '💶',
    description: 'Finish the holiday with at least €200 left — and a smile.',
    test: (s) => s.ended && s.money >= 200 && s.happiness >= 55,
  },
  {
    id: 'croatian-legend',
    title: 'Croatian Legend',
    emoji: '👑',
    description: 'Reach the Croatia Legend ending.',
    test: (s) => s.ended && s.ending === 'legend',
  },
];

/* ───────────────────────────────────────────────────── ENDINGS ── */
/** Checked in order; the first match wins. */
export const ENDINGS = [
  {
    id: 'disaster',
    title: 'Tourist Disaster',
    emoji: '🫠',
    photo: 'bacvice',
    test: (s) => s.energy <= 0 || s.happiness <= 25 || (s.money < 15 && s.happiness < 50),
    epilogue:
      'Sunburnt, exhausted and slightly poorer in ways you can’t fully explain, you board the plane home. Next time: water shoes, water bottle, and asking about the fish weight. There will be a next time.',
  },
  {
    id: 'legend',
    title: 'Croatia Legend',
    emoji: '👑',
    photo: 'dubrovnik',
    test: (s, x) => x.score >= 1000 && s.happiness >= 75 && s.visited.length >= 5 && s.tipsFound.length >= 12,
    epilogue:
      'Five days, five chapters, zero regrets. You ate like a local, swam like a fish, navigated ferries like a sailor and said “hvala” with a perfect accent. Marija has already texted to ask when you’re coming back.',
  },
  {
    id: 'island',
    title: 'Island Explorer',
    emoji: '🏝️',
    photo: 'hvar',
    test: (s) => s.happiness >= 50 && ((s.visited.includes('hvar') && s.visited.includes('brac')) || ((s.flags.island ?? 0) >= 2 && Boolean(s.flags.ferrySurvivor))),
    epilogue:
      'You came for the mainland and left as an islander. Your heart now runs on ferry timetables, salty hair and grilled squid. The harbour cat on Brač still asks about you.',
  },
  {
    id: 'insider',
    title: 'Local Insider',
    emoji: '🗝️',
    photo: 'diocletians-palace',
    test: (s) => s.local >= 13,
    epilogue:
      'Konobas, markets, three-hour coffees and a secret beach you will never reveal. You didn’t visit Croatia — you briefly lived in it. Somebody’s grandmother now considers you family.',
  },
  {
    id: 'budget',
    title: 'Budget Master',
    emoji: '💶',
    photo: 'trogir',
    test: (s) => s.money >= 200 && s.happiness >= 55,
    epilogue:
      'Free beaches, market picnics, tickets bought before boarding — and still enough money left for a very respectable farewell dinner. Your bank thanks you. So does your future self.',
  },
  {
    id: 'fjaka',
    title: 'Fjaka Champion',
    emoji: '😎',
    photo: 'brac',
    test: (s) => s.energy >= 70 && s.happiness >= 60,
    epilogue:
      'You mastered the ancient Dalmatian art of doing nothing, gloriously. You return home rested, relaxed and annoyingly calm. Colleagues ask what your secret is. You just say: “pomalo”.',
  },
  {
    id: 'happy',
    title: 'Happy Holidaymaker',
    emoji: '🌞',
    photo: 'split-hero',
    test: () => true,
    epilogue:
      'Some triumphs, a few disasters, a lot of sunshine. A good holiday — and a list of things you’ll do differently next time. Which is exactly what makes it a good story.',
  },
];
