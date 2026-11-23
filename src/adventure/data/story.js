/**
 * CROATIA ADVENTURE — story content.
 *
 * Everything in this file is FICTION: the narrator Duje, all characters,
 * situations, dialogue and the in-game money amounts
 * (simplified game values, NOT real prices). Real-world knowledge lives only in ./tips.js
 * and is shown on separate, clearly labelled Local Insider cards.
 *
 * Text fields (story, prompt, label, result, duje) may be a string or a
 * function of the current state — that is how the story remembers you.
 *
 * Effects:  money (€, game value) · energy · happiness · adventure · local
 * Flags:    counters/booleans for branching, callbacks, endings.
 *           Special values: '@day' stores the current day, '@here' the location.
 * moment:   { id, text, rank } — memorable things for the holiday report card.
 */

export const START = { money: 500, energy: 100, happiness: 50, adventure: 0, local: 0, days: 5 };

export const NARRATOR = {
  name: 'Duje',
  role: 'your local friend from Split',
  // Duje is named after Sveti Duje (St Domnius), Split's patron saint — a real, very common Split name.
  intro:
    'Bok! I’m Duje. Your cousin is my friend, which by Dalmatian law makes you family, which means I am now responsible for keeping you alive for five days. No pressure. Mostly on me.',
};

export const DESTINATIONS = {
  split: { id: 'split', name: 'Split', photo: 'split-hero', kind: 'city' },
  trogir: { id: 'trogir', name: 'Trogir', photo: 'trogir', kind: 'town' },
  omis: { id: 'omis', name: 'Omiš', photo: 'omis', kind: 'town' },
  krka: { id: 'krka', name: 'Krka National Park', photo: 'krka', kind: 'nature' },
  hvar: { id: 'hvar', name: 'Hvar', photo: 'hvar', kind: 'island' },
  brac: { id: 'brac', name: 'Brač', photo: 'brac', kind: 'island' },
  dubrovnik: { id: 'dubrovnik', name: 'Dubrovnik', photo: 'dubrovnik', kind: 'city' },
};

export const ISLANDS = ['hvar', 'brac'];
export const MAINLAND_DAY_TRIPS = ['trogir', 'omis', 'krka'];

const f = (s, k) => s.flags[k] ?? 0;
const was = (s, place) => s.visited.includes(place);
const BASE_FRIEND = { hostel: 'Luka from the hostel', apartment: 'Marija next door', boutique: 'Igor the concierge' };

/* ───────────────────────────────────────────── NARRATOR LINES ── */
/** Duje's opening line for an activity, per destination — first visit and return visit. */
export const ARRIVAL = {
  split: {
    first: 'Split. A Roman emperor retired here about 1,700 years ago and, honestly, who can blame him. Today it’s yours. Don’t embarrass me.',
    again: (s) =>
      f(s, 'bigFish')
        ? 'Back in Split. The waiters on the Riva have been warned about you. Kidding. Mostly.'
        : 'Back in Split for the last day. You walk differently now. Slower. Like a local. I’m proud. Don’t tell anyone.',
  },
  trogir: {
    first: 'Trogir: a whole medieval town squeezed onto a tiny island. You can cross it in fifteen minutes and still get lost. It’s a skill.',
    again: 'Trogir again. The cats remember you.',
  },
  omis: {
    first: 'Omiš. Pirates once ran this town, and frankly they had excellent taste in real estate: canyon behind, sea in front.',
    again: 'Omiš again. The pirates would approve of your persistence.',
  },
  krka: {
    first: 'Krka. Waterfalls, boardwalks, and approximately everyone you have ever met. Stay close and don’t feed the selfie sticks.',
    again: 'Krka again. The waterfalls are still falling. Reliable, unlike buses.',
  },
  hvar: {
    first: 'Hvar. Lavender, yachts, and people who say “we’re on island time” while checking three phones. You’ll fit right in.',
    again: (s) => (s.flags.stranded ? 'Day two on Hvar, courtesy of the wind. You live here now. Congratulations.' : 'Another day on Hvar. Your tan is starting to look intentional.'),
  },
  brac: {
    first: 'Brač. White stone, olive groves, and Zlatni rat, a beach that moves when nobody is looking. Like my uncle at weddings.',
    again: (s) => (s.flags.stranded ? 'Still on Brač. The wind wanted you to stay. The olive trees agree.' : 'Brač, day two. You have started greeting goats. Normal.'),
  },
  dubrovnik: {
    first: 'Dubrovnik. Big walls, bigger crowds, and staircases you will recognise from television. Pace yourself — it’s the finale.',
    again: 'Dubrovnik. Still magnificent.',
  },
};

/** Duje’s goodnight line, chosen from how the day went. */
export function nightLine(s, night) {
  if (night.rough) {
    s.flags.benchNights = (s.flags.benchNights ?? 0) + 1;
    return s.flags.benchNights === 1
      ? 'You slept on a bench by the sea. Romantic for ten minutes, then a seagull filed a complaint. Tomorrow: budget.'
      : 'Bench again. The same seagull is back. You are on first-name terms now. His name is, apparently, Mate.';
  }
  if (night.tired) return 'You look like a dried fig. A happy dried fig, but still. Sleep.';
  if (f(s, 'partyBoat') && s.flags.partyBoatDay === s.day) return 'You are humming the party boat song in your sleep. All of it. Badly.';
  if (s.flags.pekaOrdered && !s.flags.pekaDone) return 'Go to sleep. Somewhere, a peka is waiting for you. Dream of rosemary.';
  if (s.flags.stranded && !s.flags.strandedNight) {
    s.flags.strandedNight = true;
    return 'The wind is singing to the shutters. It’s not a lullaby, it’s a threat. Sleep well anyway.';
  }
  if (s.flags.bigFish && s.day === 1) return 'You will dream of a fish. A very large, very expensive fish. It will look disappointed in you.';
  if (s.flags.wedding && !s.flags.weddingNight) {
    s.flags.weddingNight = true;
    return 'Your phone has 47 new messages from the wedding WhatsApp group. Mute it. You can’t. Nobody can.';
  }
  const byBase = {
    hostel: ['Luka is playing the same four chords downstairs. You will know them for the rest of your life.', 'Someone in bed 7 is snoring in perfect rhythm with Luka’s guitar. Laku noć.', 'The hostel fan rotates like a lighthouse. You drift off in its gentle, inadequate breeze.', 'Bed 3 has returned from the party. Bed 3 is narrating. Good night.'],
    apartment: ['Marija has left figs on your doorstep. Again. You have more figs than friends now.', 'Through the wall you hear Marija on the phone to a cousin. About you. Positively, you think.', 'The church bell next door counts the hours for you. All of them. Laku noć.', 'Marija knocks to ask if you ate. You did. She doesn’t believe you. Neither do the figs.'],
    boutique: ['Igor has left a chocolate on your pillow and a brochure for a “premium sunrise”. Ignore the brochure.', 'The sea view is real, the pillow menu is absurd, and you choose “medium firm”. Living the dream.', 'Room service asks if you need anything. You need nothing. You are a person with a sea view.', 'Igor slides a note under the door: “Tomorrow: yacht?” You pretend you can’t read.'],
  };
  const lines = byBase[s.base] ?? ['Laku noć. Tomorrow is another day, and the sea will still be there. It always is.'];
  return lines[(s.day - 1) % lines.length];
}

/* ─────────────────────────────────────────────────── BASES ── */
export const BASES = [
  {
    id: 'hostel',
    label: 'Party hostel',
    hint: 'Cheap. Comes with Luka and his guitar.',
    nightly: 25,
    recover: 20,
    effects: { happiness: 4 },
    flags: { hostel: true },
    result: 'Twelve beds, one fan, and Luka — a man who knows four guitar chords and plays all of them at 3 a.m. Your wallet sings. Luka sings louder.',
    duje: 'Luka is harmless. Unless you mention you “also play a bit”. Never mention you also play a bit.',
  },
  {
    id: 'apartment',
    label: 'Apartment with a nonna next door',
    hint: 'Mid-price. Comes with Marija.',
    nightly: 45,
    recover: 30,
    effects: { happiness: 6, local: 1 },
    flags: { marija: true },
    result: 'Your landlady Marija hands you the keys, a bag of figs and a list of “places tourists don’t know”. Every single one belongs to a cousin.',
    duje: 'Marija has cousins in every town in Dalmatia. This will matter. Trust me.',
    tip: 'pomalo',
  },
  {
    id: 'boutique',
    label: 'Boutique hotel with a sea view',
    hint: 'Expensive. Comes with Igor the concierge.',
    nightly: 80,
    recover: 40,
    effects: { happiness: 9 },
    flags: { boutique: true },
    result: 'Igor the concierge bows slightly, calls you “dear guest” and has already booked you a table you didn’t ask for. Luxury has a price. Igor knows it to the cent.',
    duje: 'Igor is very helpful. Igor is also on commission. Both can be true.',
  },
];

/* ───────────────────────────────────────────── TRAVEL (one per day) ── */
export const TRAVEL = {
  1: {
    title: 'Day 1 · Touchdown',
    prompt:
      'Welcome to Split Airport, which — fun fact — is not in Split. Your options: a taxi, the bus, or a rental car. I’ll be judging you either way.',
    choices: [
      {
        id: 'taxi',
        label: 'Grab a taxi',
        hint: 'Fast, air-conditioned, pricey',
        to: 'split',
        effects: { money: -45, energy: -3, happiness: 6 },
        result: 'Your driver plays klapa at full volume, explains every Hajduk Split season since you were born, and drops you at the Riva before you finish nodding.',
        duje: 'Expensive, but you now know more about Croatian football than most Croatians. Investment.',
        tip: 'airport-in-kastela',
      },
      {
        id: 'bus',
        label: 'Take the bus',
        hint: 'Cheap, slower, character-building',
        to: 'split',
        effects: { money: -6, energy: -10, happiness: 2, local: 1 },
        flags: { busPro: true },
        result: 'You buy your ticket before boarding like a pro, then watch a man in a Hawaiian shirt pay the driver double. Small victories. Big shirt.',
        duje: 'Ticket before boarding. You’re learning. I may cry.',
        tip: 'buy-ticket-before',
      },
      {
        id: 'car',
        label: 'Rent a car',
        hint: 'Freedom! Also: parking.',
        to: 'split',
        effects: { money: -70, energy: -6, happiness: 4, adventure: 2 },
        flags: { car: true },
        result: 'Freedom! The open road! The roundabout you have now circled four times while the satnav sighs in Croatian.',
        duje: 'A car in Split. Brave. You know the old town was built for Roman feet and donkeys, yes?',
        tip: 'old-town-on-foot',
      },
    ],
  },
  2: {
    title: 'Day 2 · Pick your day trip',
    prompt: (s) => {
      const friend = BASE_FRIEND[s.base] ?? 'Everyone';
      if (f(s, 'bigFish')) return `Good morning. Still digesting yesterday’s fish invoice? ${friend} suggests a day trip, “somewhere the fish is cheaper”. Where to?`;
      if (f(s, 'wedding')) return `Good morning, wedding guest. The aunts are asking about you. ${friend} says get out of town before they find you. Where to?`;
      return `Good morning. ${friend} has strong opinions about where you should go today. Everyone in Dalmatia has strong opinions. Where to?`;
    },
    choices: [
      {
        id: 'to-trogir',
        label: 'Trogir — the island town',
        hint: 'Short trip, big history',
        to: 'trogir',
        effects: { money: -6, energy: -6, happiness: 3 },
        result: 'The bus rolls through Kaštela, a string of old castle villages, drops you by a tiny bridge, and suddenly it’s the Middle Ages. Cats are in charge.',
        duje: 'Trogir. Good choice. Nobody has ever regretted Trogir. Except people who drove into it.',
        tip: 'kastela',
      },
      {
        id: 'to-omis',
        label: 'Omiš — pirates & canyon',
        hint: 'Adventure, river, fortresses',
        to: 'omis',
        effects: { money: -6, energy: -8, happiness: 3, adventure: 2 },
        result: 'The coast road twists like a soap-opera plot. Then a canyon appears out of nowhere, as if the mountains had a dramatic argument.',
        duje: 'Omiš. If anyone offers you a pirate hat, accept with dignity.',
      },
      {
        id: 'to-krka',
        label: 'Krka — the waterfalls',
        hint: 'Long day, very pretty, very popular',
        to: 'krka',
        effects: { money: -35, energy: -14, happiness: 4 },
        result: 'A long drive inland past dry stone walls and sleepy villages, and a growing suspicion that everyone else in Europe had the same idea.',
        duje: 'Krka. Wonderful. Also, half of Germany. Go early next time — I say this with love.',
        tip: 'krka-season',
      },
    ],
  },
  3: {
    title: 'Day 3 · Island fever',
    prompt: (s) =>
      f(s, 'sunburn')
        ? 'Island day! Your shoulders are still the colour of a ripe tomato, so maybe sit in the shade on the boat. The port is chaos. Choose.'
        : 'Island day. The port is full of boats, backpacks and people shouting destinations like auctioneers. Choose wisely — the sea has opinions too.',
    choices: [
      {
        id: 'cat-hvar',
        label: 'Catamaran to Hvar',
        hint: 'Fast and glamorous, pricier',
        to: 'hvar',
        effects: { money: -40, energy: -8, happiness: 7, adventure: 3 },
        flags: { island: 1 },
        result: 'The catamaran skims the sea like it’s late for a party. Which, on Hvar, it probably is.',
        duje: (s) => (s.flags.hostel ? 'Luka is on the same boat. With the guitar. I’m so sorry.' : 'Hvar. Please do not buy a captain’s hat. I will know.'),
        tip: 'ferry-vs-catamaran',
      },
      {
        id: 'ferry-brac',
        label: 'Car ferry to Brač',
        hint: 'Slower, cheaper, more seagulls',
        to: 'brac',
        effects: { money: -18, energy: -8, happiness: 6, adventure: 2, local: 1 },
        flags: { island: 1 },
        result: 'On deck, locals drink coffee with the serenity of people who have done this a thousand times, while a seagull eyes your sandwich like a professional.',
        duje: 'The ferry: where Dalmatians go to drink coffee in motion.',
        tip: 'island-cash',
      },
      {
        id: 'stay-mainland',
        label: 'Skip the islands, explore the mainland',
        hint: 'Buses don’t get seasick',
        to: '@next-mainland',
        effects: { money: -6, energy: -6, happiness: 1, local: 1 },
        result: 'Islands can wait. The mainland has secrets too, and buses that don’t care about waves.',
        duje: 'Skipping the islands. Bold. My mother would call this a crime, but she calls everything a crime.',
      },
    ],
  },
  4: {
    title: 'Day 4 · The plot thickens',
    prompt: (s) =>
      s.flags.stranded
        ? 'The wind is still sulking. Officially, sailings are “disrupted”. Unofficially, you live here now. What’s the plan?'
        : 'Day four. Your skin is a new colour, your phone is full of sunsets, and you know at least three Croatian words. What now?',
    choices: [],
  },
  5: {
    title: 'Day 5 · Grand finale',
    prompt: (s) =>
      s.money < 60
        ? 'Last day, and your wallet is making a sound I can only describe as “tragic violin”. Choose something gentle.'
        : 'Last day. One more chapter. Make it a good one — I’ve already told my mother how well you’re doing.',
    choices: [],
  },
};

/** Day-4 options (picked by situation in the engine). */
export const DAY4 = {
  stayIsland: {
    id: 'stay-island',
    label: 'Stay another day on the island',
    hint: 'Slow down, find the quiet side',
    effects: { money: -5, energy: -2, happiness: 5, local: 1 },
    flags: { island: 1 },
    result: 'You cancel exactly nothing, because you had no plans. That, my friend, is the island way.',
    duje: 'Look at you, practising fjaka. A natural.',
    tip: 'fjaka',
  },
  islandHop: {
    id: 'island-hop',
    label: 'Island-hop (via Split)',
    hint: 'Two islands in one holiday. Ambitious.',
    effects: { money: -45, energy: -14, happiness: 6, adventure: 4 },
    flags: { island: 1 },
    result: 'Boat, port, coffee, other boat. You are now a maritime professional. Possibly a pirate.',
    duje: 'Two islands in one week. My uncle has lived on one island for seventy years and visited the other twice.',
    tip: 'wind-cancellations',
  },
  backMainland: {
    id: 'back-mainland',
    label: 'Back to the mainland',
    hint: 'See a place you missed',
    effects: { money: -20, energy: -10, happiness: 2 },
    result: 'Back on solid ground, which feels suspiciously stable after all that sea.',
    duje: 'Solid ground. Your legs will keep swaying until Thursday. Normal.',
  },
  mainlandNext: {
    id: 'mainland-next',
    label: 'Another mainland day trip',
    hint: 'Collect another town',
    effects: { money: -8, energy: -8, happiness: 3 },
    result: 'Another bus, another postcard-perfect stone town. You are collecting them like fridge magnets.',
    duje: 'You and buses are friends now. I didn’t see that coming.',
  },
  stuck: {
    id: 'stuck-stay',
    label: 'Accept fate and stay',
    hint: 'The boats aren’t going anywhere',
    effects: { happiness: 3, local: 2 },
    flags: { island: 1, hostage: 1 },
    result: 'The harbour café becomes your office. By noon the waiter brings your coffee before you order it. By evening he introduces you to his mother.',
    duje: 'Welcome to island life. Population: you, the café, and the wind.',
    tip: 'pomalo',
    moment: { id: 'hostage', text: 'Was held hostage by the wind on an island (enjoyed it)', rank: 6 },
  },
  privateBoat: {
    id: 'private-boat',
    label: 'Pay a private boat to get out',
    hint: 'Very expensive. Very dramatic.',
    effects: { money: -120, energy: -12, happiness: -2, adventure: 4 },
    result: 'A man called Ante agrees to “maybe” take you across. The ride is bumpy. The price is not. You arrive greener than the olive oil.',
    duje: 'You paid Ante. Everybody pays Ante eventually.',
    moment: { id: 'ante', text: 'Paid a man called Ante to escape an island', rank: 7 },
  },
};

/** Day-5 options. */
export const DAY5 = {
  coachDubrovnik: {
    id: 'coach-dubrovnik',
    label: 'Coach down the coast to Dubrovnik',
    hint: 'Long ride, legendary finale',
    to: 'dubrovnik',
    effects: { money: -30, energy: -18, happiness: 7, adventure: 3 },
    result: 'Hours of coastline so blue it looks edited. Then the walls appear, and the whole bus goes quiet.',
    duje: 'Dubrovnik for the finale. Very cinematic. Very many stairs.',
    tip: 'peljesac-bridge',
  },
  islandToDubrovnik: {
    id: 'island-dubrovnik',
    label: 'Boat back, then coach to Dubrovnik',
    hint: 'Exhausting. Glorious.',
    to: 'dubrovnik',
    effects: { money: -50, energy: -28, happiness: 6, adventure: 5 },
    result: 'Boat, bus, nap, bus. You arrive in Dubrovnik slightly crumpled, but heroic.',
    duje: 'Island to Dubrovnik in one day. You are either a legend or very confused. Possibly both.',
    tip: 'peljesac-bridge',
  },
  farewellSplit: {
    id: 'farewell-split',
    label: 'A slow farewell day in Split',
    hint: 'Markets, coffee, sunset — the local way',
    to: 'split',
    effects: { money: -5, energy: 4, happiness: 6, local: 2 },
    result: 'No timetable, no rush. Just one more day of being a temporary Splićanin.',
    duje: 'A slow last day. Correct answer. Write it down.',
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
      result: 'You stand in the Peristyle where an emperor once stood. Above you, someone is hanging out socks. History is very much alive.',
      duje: 'People live inside the palace. Do not take photos through their kitchen windows. Yes, someone did that last week.',
      tip: 'palace-lived-in',
    },
    {
      id: 'picigin',
      label: 'Play picigin at Bačvice',
      hint: 'Splash, dive, look ridiculous',
      effects: { energy: -15, happiness: 11, adventure: 3, local: 1 },
      flags: { picigin: true },
      result: 'You dive for the ball, miss spectacularly, and three retired gentlemen in Speedos award you a 9.5 for artistic expression.',
      duje: 'Picigin has no points and no winners. Only style. You have… a style.',
      tip: 'picigin',
      moment: { id: 'picigin', text: 'Scored a 9.5 for a picigin dive that missed the ball completely', rank: 2 },
    },
    {
      id: 'marjan',
      label: 'Hike up Marjan hill',
      hint: 'Pine shade, big views, many steps',
      effects: { energy: -20, happiness: 9, adventure: 4 },
      result: (s) =>
        s.flags.urchin
          ? 'Every step reminds you of yesterday’s sea urchin. The view of Split and the islands is worth it. Your foot disagrees.'
          : 'Every step is a negotiation with your legs. At the top, the view of Split and the islands settles the argument.',
      duje: 'Locals jog up Marjan before work. Don’t look at me like that. I said locals, not me.',
      tip: 'tap-water',
    },
    {
      id: 'salona-ruins',
      label: 'Bus out to the Roman ruins of Salona',
      hint: 'An amphitheatre without the crowds',
      effects: { money: -12, energy: -12, happiness: 8, adventure: 3, local: 1 },
      flags: { hidden: 1 },
      result: 'An entire Roman city, a few lizards and almost nobody else. You give a short speech in the amphitheatre. The lizards are a tough crowd.',
      duje: 'Salona was here first. Split is the younger sibling who got all the attention.',
      tip: 'salona',
    },
    {
      id: 'pazar-morning',
      label: 'Morning at the Pazar market',
      hint: 'Figs, cheese, loud bargains',
      effects: { money: -8, energy: -5, happiness: 7, local: 2 },
      flags: { market: 1 },
      result: 'A vendor makes you taste three kinds of figs “for science” and adds a fourth “for your health”. You leave with a bag and a new aunt.',
      duje: 'Go early: the best figs leave before the tourists wake up. Like me.',
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
      duje: 'The best view in Trogir costs less than a cocktail. I checked. On the official page, not on the cocktail.',
      tip: 'kamerlengo',
    },
    {
      id: 'trogir-lanes',
      label: 'Get lost in the lanes',
      hint: 'Free, wonderful, mildly confusing',
      effects: { energy: -8, happiness: 7, local: 1 },
      flags: { hidden: 1 },
      result: 'You get gloriously lost three times in a town you can cross in fifteen minutes. A cat leads you out. You tip the cat.',
      duje: 'Getting lost in Trogir is the point. Getting lost in Krka is a different story.',
      tip: 'trogir-unesco',
    },
    {
      id: 'trogir-marenda',
      label: 'Hunt for a proper marenda',
      hint: 'Late-morning feast, local style',
      effects: { money: -12, energy: 10, happiness: 8, local: 2 },
      flags: { konoba: 1 },
      result: 'At 10:30 a.m. you eat fish stew next to two dockworkers and a priest. Nobody finds this strange. You feel reborn.',
      duje: 'Marenda: second breakfast for people who work. You don’t work this week, but we’ll allow it.',
      tip: 'marenda',
    },
  ],
  omis: [
    {
      id: 'kayak',
      label: 'Kayak up the Cetina canyon',
      hint: 'Paddles, cliffs, splash fights',
      effects: { money: -35, energy: -18, happiness: 12, adventure: 6 },
      flags: { kayak: true },
      result: 'Cliffs tower overhead, the water is impossibly green, and you lose a splash fight to a nine-year-old from Graz. She shows no mercy.',
      duje: 'Respect the nine-year-olds. They have nothing to lose.',
      tip: 'cetina-canyon',
      moment: { id: 'graz', text: 'Lost a splash fight to a nine-year-old from Graz', rank: 4 },
    },
    {
      id: 'mirabela',
      label: 'Storm the Mirabela fortress',
      hint: 'Short climb, pirate views',
      effects: { money: -5, energy: -10, happiness: 8, adventure: 3 },
      result: 'From the top you understand why pirates liked it here: you can see every boat coming. And every bakery.',
      duje: 'The pirates built it for the view. Same as every Airbnb owner today.',
      tip: 'omis-pirates',
    },
    {
      id: 'soparnik',
      label: 'Find real soparnik',
      hint: 'Ancient chard pie. Trust the process.',
      effects: { money: -8, energy: 6, happiness: 7, local: 2 },
      flags: { konoba: 1 },
      result: 'It’s chard, dough and olive oil. It shouldn’t be this good. It is this good. You buy a second piece “for later”. Later is four minutes.',
      duje: 'My grandmother would say yours is too thin. She says that about everyone’s soparnik. Including hers.',
      tip: 'soparnik',
    },
  ],
  krka: [
    {
      id: 'skradinski',
      label: 'Walk the Skradinski buk boardwalks',
      hint: 'Waterfalls everywhere',
      effects: { energy: -14, happiness: 10, adventure: 3 },
      result: 'Water tumbles over travertine terraces in every direction. You take 212 photos. All of them are of the same waterfall. All of them are perfect.',
      duje: 'You will show these photos to people. They will say “nice”. They will not understand. That’s fine.',
      tip: 'go-early',
    },
    {
      id: 'skradin-boat',
      label: 'Arrive by boat from Skradin',
      hint: 'River cruise into the park',
      effects: { money: -5, energy: -6, happiness: 9, adventure: 2 },
      result: 'The boat glides up the river past reeds and herons. Arriving by water feels like walking onto a film set, minus the director shouting.',
      duje: 'The boat is in the ticket in season. Free things taste better.',
      tip: 'krka-transfers',
    },
    {
      id: 'krka-picnic',
      label: 'Picnic away from the crowds',
      hint: 'Quiet corner, sandwiches, birdsong',
      effects: { money: -6, energy: 8, happiness: 7, local: 1 },
      flags: { hidden: 1 },
      result: 'Five minutes off the main path the crowds vanish. It’s just you, a sandwich and a lizard with strong opinions about the sandwich.',
      duje: 'The lizard will not stop staring. Neither would I. It’s a good sandwich.',
      tip: 'shoulder-season',
    },
  ],
  hvar: [
    {
      id: 'fortica',
      label: 'Sunset at the Spanish Fortress',
      hint: 'Uphill, unforgettable',
      effects: { money: -10, energy: -12, happiness: 11, adventure: 3 },
      result: 'The sun drops behind the Pakleni islands and the harbour turns gold. Even the yachts look humbled. Briefly.',
      duje: 'This is the view. You can stop taking photos now. No? Fine.',
      tip: 'hvar-fortress',
    },
    {
      id: 'pakleni-taxi',
      label: 'Taxi boat to the Pakleni islands',
      hint: 'Quiet coves, clear water',
      effects: { money: -25, energy: -10, happiness: 12, adventure: 5 },
      flags: { hidden: 1 },
      result: 'Ten minutes by boat and the party noise is gone. You snorkel over a seabed so clear you can count the sea urchins. Do not step on the sea urchins.',
      duje: 'Ten minutes from the party boats and you’re on a different planet. A quieter, better planet.',
      tip: 'pakleni',
    },
    {
      id: 'lavender',
      label: 'Wander the lavender villages',
      hint: 'Purple fields, sleepy stone hamlets',
      effects: { money: -12, energy: -8, happiness: 9, local: 2 },
      flags: { market: 1 },
      result: 'An old man sells you lavender oil from a table outside his house and refuses to let you leave without a fig. Dalmatian figs are a currency.',
      duje: 'Your suitcase will smell of Hvar until Christmas. You’re welcome.',
      tip: 'hvar-lavender',
    },
    {
      id: 'stari-grad',
      label: 'Cycle the Stari Grad Plain',
      hint: 'Ancient fields, very few tourists',
      effects: { money: -10, energy: -14, happiness: 8, adventure: 4 },
      flags: { hidden: 1 },
      result: 'Vineyards and stone walls laid out by ancient Greeks. Your rented bike squeaks in protest. The ancient Greeks would have fixed the bike.',
      duje: 'Fields older than most countries. Your bike is only slightly younger.',
      tip: 'stari-grad-plain',
    },
  ],
  brac: [
    {
      id: 'zlatni-rat',
      label: 'Swim at Zlatni rat',
      hint: 'The famous beach',
      effects: { energy: -10, happiness: 10, adventure: 2 },
      result: 'The pebble spit points into the sea like a golden finger. You float. You exist. Life is good. A child buries your sandals.',
      duje: 'The beach changes shape with the wind. Your sandals too, apparently.',
      tip: 'zlatni-rat',
    },
    {
      id: 'vidova-gora',
      label: 'Hike up Vidova Gora',
      hint: 'The highest island peak',
      effects: { energy: -22, happiness: 10, adventure: 6 },
      flags: { hidden: 1 },
      result: 'Sweaty, triumphant, and staring down at Zlatni rat from far above. The best photo of the famous beach is taken by people who suffered for it.',
      duje: 'You climbed the highest peak on the Adriatic islands. I drove up once. We are not the same.',
      tip: 'vidova-gora',
    },
    {
      id: 'pucisca',
      label: 'Visit the stonemasons of Pučišća',
      hint: 'White stone, quiet harbour',
      effects: { money: -5, energy: -8, happiness: 7, local: 2 },
      flags: { hidden: 1 },
      result: 'Students carve white stone with techniques older than your country’s postal service. You try for thirty seconds and produce “gravel”.',
      duje: 'Your gravel is very nice. Very modern. Very gravel.',
      tip: 'pucisca-stone',
    },
    {
      id: 'brac-konoba',
      label: 'Lunch at a hillside konoba',
      hint: 'Lamb, olive oil, long table',
      effects: { money: -28, energy: 10, happiness: 10, local: 2 },
      flags: { konoba: 1 },
      result: 'Three hours, four courses, one rakija you didn’t order. The owner calls you “prijatelju” — my friend — and means it.',
      duje: 'If grandma is in the kitchen, you chose correctly. Grandma was in the kitchen.',
      tip: 'konoba',
    },
  ],
  dubrovnik: [
    {
      id: 'walls-early',
      label: 'Walk the city walls at opening time',
      hint: 'Early alarm, empty walls',
      effects: { money: -35, energy: -14, happiness: 13, adventure: 3 },
      result: 'Just you, the walls, the sea and a cat who looks unimpressed. By the time the crowds arrive, you’re on your second coffee.',
      duje: 'Early walls. You listened to me. Nobody listens to me. I need a moment.',
      tip: 'go-early',
    },
    {
      id: 'walls-midday',
      label: 'Walk the walls whenever',
      hint: 'Sleep in, deal with it later',
      effects: { money: -35, energy: -24, happiness: 4, adventure: 2 },
      result: 'Noon. The stone is a grill. Three tour groups. A selfie stick nearly enters your ear. Still: magnificent. Sweaty, but magnificent.',
      duje: 'I told you to go early. I am not saying I told you. I am just saying it again.',
      tip: 'cruise-days',
      moment: { id: 'noon-walls', text: 'Walked Dubrovnik’s walls at noon, like a croissant in an oven', rank: 2 },
    },
    {
      id: 'lokrum',
      label: 'Escape to Lokrum island',
      hint: 'Shade, swimming, peacocks',
      effects: { money: -20, energy: -6, happiness: 11, adventure: 3 },
      flags: { hidden: 1, lokrum: true },
      result: 'Ten minutes by boat and the crowds disappear. A peacock fans its tail at you. You are not sure whether it is a greeting or a threat.',
      duje: 'The peacocks run Lokrum. You are a guest. Behave.',
      tip: 'lokrum',
    },
  ],
};

/* ──────────────────────────────────────────────────────── EVENTS ── */
/**
 * where: destination ids (or ['any']) · when(state) condition · weight
 * kind: 'callback' (pays off an earlier decision) · 'hidden' (rare discovery)
 * chance: seeded dice roll; p may be a function of state.
 */
export const EVENTS = [
  // ───────────────────────── everyday Dalmatia
  {
    id: 'fish-mystery',
    where: ['split', 'trogir', 'hvar'],
    weight: 3,
    broke: {
      result: 'You order bread and tap water and watch other people’s fish with the intensity of a cat at a window. The waiter, moved, brings you a few grilled sardines “because it’s sad”.',
      duje: 'Sympathy sardines. The lowest and most Dalmatian point of any holiday.',
      moment: { id: 'sardines', text: 'Was given sympathy sardines by a waiter', rank: 7 },
    },
    title: 'The Fish Price Mystery',
    story: 'A waiter on the waterfront presents a silver tray of glistening fish like a jeweller showing diamonds. The menu says only: “Fish — per kg.” Your stomach says yes. Your wallet asks for a lawyer.',
    choices: [
      {
        id: 'point-big',
        label: 'Point at the biggest, shiniest one',
        effects: { money: -95, happiness: 3 },
        flags: { bigFish: true },
        result: 'It was delicious. It was also, apparently, the weight of a toddler. The bill arrives with the solemnity of a court verdict.',
        duje: 'Three kilos. THREE. My cousin heard about it in Zagreb. This will follow you.',
        tip: 'fish-per-kilo',
        moment: { id: 'big-fish', text: 'Ordered a fish the size of a toddler without asking the price', rank: 10 },
      },
      {
        id: 'ask-weight',
        label: 'Ask the weight and the total first',
        effects: { money: -40, happiness: 7, local: 1 },
        result: 'The waiter weighs it, names the total, and nods with new respect. You pick a smaller fish and the legendary blitva on the side.',
        duje: 'Asked the weight. Ordered blitva. You are 40% Dalmatian now.',
        tip: 'blitva',
        moment: { id: 'ask-weight', text: 'Asked the fish weight before ordering, like a pro', rank: 2 },
      },
      {
        id: 'konoba-alley',
        label: 'Walk two streets back to a konoba',
        effects: { money: -30, happiness: 9, local: 2 },
        flags: { konoba: 1 },
        result: 'Handwritten menu, four tables, a grandmother in the kitchen. The pašticada rearranges your understanding of beef.',
        duje: 'Two streets back. The magic distance. Tourists never walk two streets back.',
        tip: 'pasticada',
      },
    ],
  },
  {
    id: 'three-hour-coffee',
    where: ['split', 'omis', 'trogir', 'brac'],
    weight: 2,
    title: 'The Three-Hour Coffee',
    story: (s) =>
      s.flags.marija
        ? 'You sit down for “a quick coffee”. At the next table: Marija, with four friends, who have clearly been briefed about you. One of them pulls out a chair.'
        : 'You sit down for “a quick coffee”. The locals at the next table have been here since your plane landed. One of them pulls out a chair for you.',
    choices: [
      {
        id: 'join',
        label: 'Join them (cancel your afternoon)',
        effects: { energy: 12, happiness: 8, local: 3, adventure: -2 },
        flags: { coffeeHours: 3 },
        result: 'Three hours later you know their children’s names, their football opinions and the location of a beach with no name. You have drunk one macchiato.',
        duje: 'One coffee, three hours. You’ve unlocked the real Dalmatia. The sightseeing can wait. It always waits.',
        tip: 'kava-ritual',
        moment: { id: 'coffee', text: 'Turned “a quick coffee” into a three-hour summit with strangers', rank: 4 },
      },
      {
        id: 'rush',
        label: 'Politely rush off to “see things”',
        effects: { energy: -6, happiness: 2, adventure: 3 },
        result: 'You see things. Lovely things. Behind you, a table of almost-friends shrugs and orders another round without you.',
        duje: '“Rush” and “coffee” in the same sentence. I’ll pretend I didn’t hear that.',
      },
    ],
  },
  {
    id: 'sunbed-economics',
    where: ['split', 'brac', 'hvar', 'trogir'],
    weight: 2,
    title: 'Sunbed Economics',
    story: 'The beach is lined with neat rows of sunbeds. A man with a clipboard approaches with the confidence of a tax inspector and the tan of a leather sofa.',
    choices: [
      {
        id: 'rent',
        label: 'Rent the full sunbed package',
        effects: { money: -30, energy: 10, happiness: 5 },
        result: 'Shade, a cushion and a cocktail menu. You feel like a minor celebrity. The man with the clipboard calls you “boss”.',
        duje: 'Comfortable. Expensive. Comfortable.',
      },
      {
        id: 'towel',
        label: 'Spread your towel on the free pebbles',
        effects: { energy: 3, happiness: 6, local: 1 },
        result: 'The pebbles massage your back in ways you did not request. Free sea, free sun, no clipboard. A nonna nearby nods approvingly.',
        duje: 'The sea is for everyone. The sunbed is for people with money. You are now people with sea.',
        tip: 'public-beaches',
        moment: { id: 'towel', text: 'Refused a sunbed on principle; lay on free pebbles like a local', rank: 2 },
      },
    ],
  },
  {
    id: 'parking-odyssey',
    where: ['split', 'trogir', 'dubrovnik'],
    when: (s) => s.flags.car && !s.flags.mirror && !s.flags.parkedWell,
    weight: 6,
    title: 'The Parking Odyssey',
    story: 'Your rental car has entered a street that narrows with every metre. A Roman wall approaches. So does a man with a very expressive face and a cigarette he has not lit in twenty minutes.',
    choices: [
      {
        id: 'push-on',
        label: 'Squeeze through, it’ll be fine',
        effects: { money: -15, energy: -10, happiness: -8 },
        flags: { mirror: true },
        result: 'It was not fine. The wing mirror is now modern art. The man’s face achieves a new level of expression. The wall is unharmed; it has seen worse since the 4th century.',
        duje: 'The wall wins. The wall always wins. I hope you took the full insurance. You didn’t, did you?',
        moment: { id: 'mirror', text: 'Lost a wing mirror to a 1,700-year-old wall', rank: 9 },
      },
      {
        id: 'park-outside',
        label: 'Reverse out, park outside the centre and walk',
        effects: { money: -12, energy: -6, happiness: 3, local: 1 },
        flags: { parkedWell: true },
        result: 'Ten minutes of walking, zero dead mirrors. The expressive man gives you a slow thumbs-up and finally lights the cigarette.',
        duje: 'Parked outside and walked. You are wiser than half of Munich.',
        tip: 'old-town-on-foot',
      },
    ],
  },
  {
    id: 'klapa-vestibule',
    where: ['split', 'dubrovnik', 'trogir'],
    weight: 2,
    title: 'Voices in the Stone',
    story: 'From a dark stone hall come harmonies: five men in white shirts singing without instruments. The acoustics do the rest. Your goosebumps get goosebumps.',
    choices: [
      {
        id: 'listen',
        label: 'Stop, listen, buy the CD',
        effects: { money: -10, happiness: 10, local: 1 },
        result: 'You buy their CD even though you no longer own anything that plays CDs. Some things you buy for the soul.',
        duje: 'Klapa. Now you understand why we cry at weddings. And funerals. And football.',
        tip: 'klapa',
      },
      {
        id: 'hum-along',
        label: 'Join in with confidence',
        chance: {
          p: (s) => (s.flags.phrases ? 0.5 : 0.25),
          success: {
            effects: { happiness: 12, adventure: 3, local: 2 },
            result: 'Against all odds you find the bass line. The tenor nods. A tourist films you. You are, for one verse, a Dalmatian man of the sea.',
          },
          fail: {
            effects: { happiness: 4, adventure: 2 },
            result: 'You hum confidently in a key that does not exist. The tenor raises one eyebrow, then kindly invites you to clap instead.',
          },
        },
        duje: 'Brave. Very brave. The tenor will tell this story at dinner.',
        tip: 'klapa',
        moment: { id: 'klapa', text: 'Sang along with a klapa (the tenor is still talking about it)', rank: 5 },
      },
    ],
  },
  {
    id: 'lost-in-translation',
    where: ['any'],
    weight: 2,
    title: 'Lost in Translation',
    story: 'At a bakery, the lady behind the counter asks you something in rapid Croatian. The whole queue turns to look at you. Somewhere, a burek waits.',
    choices: [
      {
        id: 'phrases',
        label: 'Deploy your Croatian: “Dobar dan! … Molim … Hvala!”',
        effects: { money: -3, happiness: 8, local: 2 },
        flags: { phrases: 1 },
        result: 'She beams, says “bravo!”, and slips an extra burek into the bag. The queue nods. You are, unofficially, a citizen.',
        duje: 'Three words, one free burek. The best exchange rate in Croatia.',
        tip: 'croatian-basics',
        moment: { id: 'burek', text: 'Got a free burek for speaking Croatian at a bakery', rank: 3 },
      },
      {
        id: 'point',
        label: 'Point at things and smile intensely',
        effects: { money: -6, happiness: 3, energy: 4 },
        result: 'You receive something round, warm and delicious. You will never know what it was. You will think about it for years.',
        duje: 'Pointing works. But next time, try “molim”. It means please, you’re welcome, pardon, and “what?”. It’s our Swiss army word.',
        tip: 'pekara',
      },
    ],
  },
  {
    id: 'urchin',
    where: ['split', 'brac', 'hvar', 'omis', 'trogir'],
    weight: 2,
    title: 'The Spiky Neighbours',
    story: 'The water is crystal clear. So are the little black spiky balls on the rocks, exactly where you were about to put your foot.',
    choices: [
      {
        id: 'barefoot',
        label: 'Tiptoe in barefoot, carefully',
        chance: {
          p: 0.5,
          success: { effects: { happiness: 6, adventure: 2 }, result: 'Ballet-level footwork. You reach the sea untouched and insufferably smug.' },
          fail: {
            effects: { energy: -12, happiness: -8 },
            flags: { urchin: true },
            result: 'Ouch. Ouch. OUCH. A grandmother appears from nowhere with olive oil, a needle and the calm of someone who has done this a hundred times.',
          },
        },
        duje: 'Water shoes. I said water shoes. Nobody listens to Duje.',
        tip: 'water-shoes',
        moment: { id: 'urchin', text: 'Stepped on a sea urchin (as predicted by Duje)', rank: 6 },
      },
      {
        id: 'buy-shoes',
        label: 'Buy water shoes at the kiosk',
        effects: { money: -12, happiness: 5 },
        flags: { waterShoes: true },
        result: 'You look like a scuba-diving duck. You also look like someone whose feet are fine.',
        duje: 'Ugly shoes, happy feet. The Dalmatian way.',
        tip: 'ljekarna',
      },
      {
        id: 'other-spot',
        label: 'Walk to the next cove',
        effects: { energy: -6, happiness: 7, adventure: 2 },
        flags: { hidden: 1 },
        result: 'The next cove is smaller, urchin-free and completely empty. Sometimes cowardice is just good scouting.',
        duje: 'Strategic retreat. Very French. The French were here too, you know — for a few years, two centuries ago.',
      },
    ],
  },
  {
    id: 'heatwave',
    where: ['any'],
    when: (s) => s.energy < 60,
    weight: 3,
    title: 'The Midday Sun Strikes Back',
    story: 'It’s the hottest hour of the day. The stones radiate heat, your water bottle is empty, and your enthusiasm is evaporating faster than the sea.',
    choices: [
      {
        id: 'fjaka',
        label: 'Surrender to fjaka in the shade',
        effects: { energy: 16, happiness: 6, local: 1, adventure: -2 },
        flags: { fjaka: 1 },
        result: 'You lie under a pine tree and do absolutely nothing, magnificently, for an hour. A local walks past and nods. You understand each other.',
        duje: 'That’s fjaka. It is not laziness. It is a cultural achievement.',
        tip: 'fjaka',
      },
      {
        id: 'push',
        label: 'Push on — sightseeing waits for no one',
        effects: { energy: -16, happiness: -4, adventure: 3 },
        flags: { sunburn: true },
        result: 'You see everything, through a shimmering haze, while slowly turning the colour of a Dalmatian tomato.',
        duje: 'The sightseeing waits for everyone, actually. That’s what makes it sightseeing.',
        tip: 'go-early',
        moment: { id: 'tomato', text: 'Turned the colour of a Dalmatian tomato', rank: 5 },
      },
      {
        id: 'refill',
        label: 'Refill at a fountain and find a gelato',
        effects: { energy: 9, happiness: 5, money: -3 },
        result: 'Cold water, a shady bench, a gelato the size of your head. Civilisation restored.',
        duje: 'Water and ice cream. The two pillars of Dalmatian summer medicine.',
        tip: 'tap-water',
      },
    ],
  },
  {
    id: 'rakija-welcome',
    where: ['any'],
    weight: 2,
    title: 'A Small Glass of Something',
    story: (s) =>
      `${s.flags.marija ? 'Marija’s cousin' : 'Your host'} appears with a bottle of something greenish and two tiny glasses. “Travarica! Domaća — home-made! For health!”`,
    choices: [
      {
        id: 'sip',
        label: 'Sip and say “Živjeli!”',
        effects: { happiness: 8, local: 2, energy: -6 },
        flags: { phrases: 1, rakija: 1 },
        result: 'It tastes like a herb garden that took up boxing. Your host is delighted. A second glass appears from nowhere. Then a third. The evening gets very philosophical.',
        duje: 'Sip, don’t shoot. And look people in the eye when you say živjeli. It’s the rule. I don’t make the rules. My grandfather made the rules.',
        tip: 'travarica',
        moment: { id: 'rakija', text: 'Accepted home-made rakija “for health” (three times)', rank: 4 },
      },
      {
        id: 'decline',
        label: 'Ask for something without alcohol',
        effects: { happiness: 4, energy: 6, local: 1 },
        result: 'Your host shrugs, pours you a home-made lemonade, and gives you a twenty-minute lecture on which herbs are in the bottle anyway.',
        duje: 'Saying no is fine. Saying no to the lemonade would have been a diplomatic incident.',
        tip: 'domace',
        moment: { id: 'lemonade', text: 'Declined rakija; received home-made lemonade and a herb lecture', rank: 3 },
      },
    ],
  },
  {
    id: 'market-haul',
    where: ['split', 'trogir', 'omis'],
    weight: 2,
    title: 'Market Morning',
    story: 'Stalls overflow with tomatoes, figs, cheese and lavender. A vendor waves a slice of melon at you like a hypnotist with a pendulum.',
    choices: [
      {
        id: 'picnic',
        label: 'Build a market picnic',
        effects: { money: -12, energy: 8, happiness: 8, local: 2 },
        flags: { market: 1 },
        result: 'Bread, cheese, figs and tomatoes on a bench by the sea. The best meal of the trip costs less than one cocktail on the Riva.',
        duje: 'This is how Dalmatians eat when no one is watching. Delicious and suspiciously cheap.',
        tip: 'pazar',
        moment: { id: 'picnic', text: 'Ate the best meal of the trip on a bench, for less than a cocktail', rank: 3 },
      },
      {
        id: 'souvenirs',
        label: 'Buy “authentic” souvenirs at the stand nearby',
        effects: { money: -25, happiness: 2 },
        flags: { magnets: 1 },
        result: 'Your fridge magnet says “CROATIA” in a font normally reserved for heavy-metal albums. It was made very far from Croatia.',
        duje: 'Check where the souvenir was made. Then buy olive oil instead. Olive oil doesn’t lie.',
        tip: 'photo-menus',
      },
    ],
  },
  {
    id: 'wedding-riva',
    where: ['trogir', 'split', 'omis'],
    weight: 2,
    title: 'The Wedding Procession',
    story: 'Car horns, flags, singing: a Dalmatian wedding procession sweeps along the waterfront and absorbs you like a friendly wave. An aunt makes eye contact. It’s too late.',
    choices: [
      {
        id: 'dance',
        label: 'Dance along for one song',
        effects: { energy: -12, happiness: 12, adventure: 3, local: 1 },
        flags: { wedding: true },
        result: 'One song becomes four. An aunt teaches you a step, an uncle hands you a drink, and you appear in the official wedding video, centre frame.',
        duje: 'You are in the wedding video. You are now in the family WhatsApp group. There is no leaving the family WhatsApp group.',
        moment: { id: 'wedding', text: 'Accidentally became a guest at a Dalmatian wedding', rank: 8 },
      },
      {
        id: 'watch',
        label: 'Film it from a safe distance',
        effects: { happiness: 5, energy: 2 },
        result: 'Your video gets 14 likes and one comment from your mother: “who are these people”. A fair question.',
        duje: 'Safe distance. Safe, sensible, and slightly sad. Next time, dance.',
      },
    ],
  },
  {
    id: 'pirate-grandpa',
    where: ['omis'],
    weight: 4,
    title: 'Grandpa of the Pirates',
    story: 'On a bench by the river, an old man tells anyone who will listen that his family once ruled these waters. “Pirates,” he says, tapping his nose. “Very good pirates.”',
    choices: [
      {
        id: 'listen',
        label: 'Listen to his stories',
        effects: { energy: 4, happiness: 8, local: 2 },
        flags: { grandpa: true },
        result: 'Two hours of sieges, sea battles and an alarmingly detailed octopus recipe. He draws you a map on a napkin and writes “NEPHEW — FERRY” on the back.',
        duje: 'Keep the napkin. In Dalmatia, a napkin with a nephew’s name on it is worth more than a credit card.',
        tip: 'omis-pirates',
        moment: { id: 'napkin-map', text: 'Was given a napkin map by the grandson of pirates', rank: 4 },
      },
      {
        id: 'challenge',
        label: 'Challenge him to a game of briškula',
        chance: {
          p: 0.35,
          success: {
            effects: { happiness: 12, local: 3, adventure: 2 },
            flags: { grandpa: true },
            result: 'Beginner’s luck! You win. He demands a rematch “tomorrow, same bench”, gives you his nephew’s number, and calls you a pirate.',
          },
          fail: {
            effects: { happiness: 5, local: 1, money: -5 },
            result: 'You lose spectacularly and pay for the coffees. He is gracious about it, the way pirates usually are after winning.',
          },
        },
        duje: 'Never play cards with a Dalmatian grandfather. They learned on the boats. In storms.',
        moment: { id: 'briskula', text: 'Played cards with the grandson of (alleged) pirates', rank: 5 },
      },
    ],
  },
  {
    id: 'canyon-sunburn',
    where: ['omis', 'krka'],
    when: (s) => !s.flags.sunburn,
    weight: 2,
    title: 'Too Much of a Good Thing',
    story: 'The day was perfect. Your shoulders, however, are now the colour of a Dalmatian sunset — and they hurt like one.',
    choices: [
      {
        id: 'pharmacy',
        label: 'Find a ljekarna for after-sun',
        effects: { money: -12, energy: 5, happiness: 2 },
        result: 'The pharmacist hands you a cream and a look that says “every summer, the same thing”. She is right. She is always right.',
        duje: 'Green cross, wise lady, cold cream. The holy trinity.',
        tip: 'ljekarna',
      },
      {
        id: 'ignore',
        label: 'Ignore it, you’re tough',
        effects: { energy: -10, happiness: -5 },
        flags: { sunburn: true },
        result: 'You are not tough. You are a lobster with a backpack.',
        duje: 'This will come back. Specifically: tomorrow, when you put your backpack on.',
        moment: { id: 'lobster', text: 'Ignored a sunburn and became a lobster with a backpack', rank: 6 },
      },
    ],
  },
  {
    id: 'krka-crowd',
    where: ['krka'],
    weight: 4,
    title: 'The Midday Stampede',
    story: 'Bus after bus arrives. The boardwalk becomes a slow-moving river of selfie sticks, sunhats and one man carrying a full-size tripod like a rifle.',
    choices: [
      {
        id: 'wait-it-out',
        label: 'Wait it out with an ice cream',
        effects: { money: -4, energy: 6, happiness: 4 },
        result: 'By the time your ice cream is gone, so is half the crowd. Patience: rewarded. Ice cream: also rewarded.',
        duje: 'Waiting with ice cream is the most Dalmatian strategy in existence.',
        tip: 'go-early',
      },
      {
        id: 'side-trail',
        label: 'Take a quieter side trail',
        effects: { energy: -8, happiness: 9, adventure: 3 },
        flags: { hidden: 1 },
        result: 'Birdsong, small cascades and a bench with nobody on it. You have found the part of Krka the brochures forgot.',
        duje: 'The side trail. The brochures don’t know. Now you know. Don’t tell the tripod man.',
        tip: 'shoulder-season',
      },
    ],
  },
  {
    id: 'krka-ticket-surprise',
    where: ['krka'],
    weight: 3,
    title: 'The Ticket Office Revelation',
    story: 'A couple ahead of you is arguing about the ticket price — apparently it depends heavily on the month. They turn to you as if you might be the referee.',
    choices: [
      {
        id: 'explain',
        label: 'Explain seasonal prices like a local',
        effects: { happiness: 6, local: 2 },
        result: 'You become, briefly, the most knowledgeable person in the queue. They buy you a coffee and ask if you’re a guide. You do not deny it.',
        duje: 'Look at you, quoting the official price list. I’ve created a monster.',
        tip: 'krka-season',
        moment: { id: 'guide', text: 'Was mistaken for a tour guide at Krka (did not correct anyone)', rank: 4 },
      },
      {
        id: 'stay-out',
        label: 'Stay out of it and board the boat',
        effects: { happiness: 3, energy: 4 },
        result: 'Wise. Very wise. They are still arguing as your boat pulls away. A heron watches them with visible judgement.',
        duje: 'Never get between a couple and a ticket office. Ancient Dalmatian wisdom.',
        tip: 'krka-transfers',
      },
    ],
  },
  {
    id: 'bura-cancel',
    where: ['hvar', 'brac'],
    weight: 3,
    title: 'The Bura Has Opinions',
    story: 'The wind howls down from the mountains. At the port, a handwritten sign appears: sailings disrupted. The sea looks like it is rehearsing for a disaster film.',
    choices: [
      {
        id: 'accept',
        label: 'Accept it: one more island night',
        effects: { money: -20, happiness: 5, local: 2 },
        flags: { stranded: true, ferrySurvivor: true },
        result: 'You find a tiny guesthouse, eat grilled squid with the other stranded travellers and form a support group. It becomes the best evening of the trip.',
        duje: 'The bura decides. We just drink coffee and wait. Welcome to the islands.',
        tip: 'wind-cancellations',
        moment: { id: 'bura', text: 'Got stranded on an island by the bura and formed a squid-based support group', rank: 7 },
      },
      {
        id: 'panic',
        label: 'Refresh the timetable 40 times',
        effects: { energy: -12, happiness: -6 },
        flags: { stranded: true, ferrySurvivor: true },
        result: 'The timetable does not change. Your blood pressure does. Eventually you also end up eating grilled squid, but angrier.',
        duje: 'The timetable can’t hear you. I checked.',
        tip: 'wind-cancellations',
      },
      {
        id: 'early-ferry',
        label: 'Gamble on the first ferry tomorrow',
        chance: {
          p: 0.5,
          success: { effects: { happiness: 6, adventure: 3 }, flags: { ferrySurvivor: true }, result: 'The wind drops overnight and the first ferry sails. You wave goodbye to the island like a returning hero.' },
          fail: { effects: { energy: -8, happiness: -3 }, flags: { stranded: true, ferrySurvivor: true }, result: 'No ferry. Just you, the harbour cat and a very long coffee. You are staying. The cat approves.' },
        },
        duje: 'Gambling against the wind. Bold. The wind has a perfect record.',
        tip: 'ferry-vs-catamaran',
      },
    ],
  },
  {
    id: 'party-boat',
    where: ['hvar'],
    weight: 3,
    title: 'The Party Boat',
    story: 'A boat thumping with music pulls into the harbour. A man in sunglasses the size of windows shouts: “Last two places! Unlimited fun! Fun is unlimited!”',
    choices: [
      {
        id: 'board',
        label: 'Jump aboard',
        effects: { money: -60, energy: -25, happiness: 10, adventure: 4 },
        flags: { partyBoat: true, partyBoatDay: '@day' },
        result: 'You dance, you swim, you lose a flip-flop to the Adriatic. Tomorrow-you will have strong feelings about today-you.',
        duje: 'Have fun. Drink water. I’ll see you tomorrow, when you won’t want to see anyone.',
        moment: { id: 'party', text: 'Lost a flip-flop to the Adriatic on a party boat', rank: 7 },
      },
      {
        id: 'sunset-wine',
        label: 'Watch it leave from a quiet wine bar',
        effects: { money: -15, energy: 4, happiness: 8, local: 1 },
        result: 'A glass of local plavac mali, a view of the harbour, and the satisfying sound of somebody else’s party fading into the distance.',
        duje: 'Plavac mali and a view. The grown-up party.',
        tip: 'plavac-mali',
      },
    ],
  },
  {
    id: 'zlatni-wind',
    where: ['brac'],
    weight: 3,
    title: 'Windsurf Wednesday',
    story: 'Zlatni rat is buzzing. The wind is up and the windsurf school offers a beginner lesson. The instructor looks you up and down, sceptically, like a tailor.',
    choices: [
      {
        id: 'lesson',
        label: 'Take the lesson',
        chance: {
          p: 0.4,
          success: { effects: { money: -40, energy: -15, happiness: 14, adventure: 6 }, result: 'You stand up! For eleven glorious seconds! The instructor actually claps! A seagull does not!' },
          fail: { effects: { money: -40, energy: -18, happiness: 6, adventure: 4 }, result: 'You fall off 47 times. The instructor stops counting at 30. You swallow a decent portion of the Adriatic. Weirdly, you loved it.' },
        },
        duje: 'Windsurfing. Even if you fall, you fall into the best sea in Europe. I am not biased.',
        moment: { id: 'windsurf', text: 'Fell off a windsurf board 47 times (stood up for 11 seconds, allegedly)', rank: 5 },
      },
      {
        id: 'watch-surfers',
        label: 'Watch from the beach with an ice cream',
        effects: { money: -4, energy: 4, happiness: 6 },
        result: 'Watching other people fall into the sea is an extremely relaxing spectator sport. You give them scores.',
        duje: 'Professional spectator. A respected Dalmatian career.',
        tip: 'zlatni-rat',
      },
    ],
  },
  {
    id: 'olive-grove',
    where: ['brac', 'hvar'],
    weight: 2,
    title: 'Olive Oil Diplomacy',
    story: 'A farmer at the roadside invites you to taste his olive oil, poured onto bread with the seriousness of a sommelier and the hands of someone who picked every olive.',
    choices: [
      {
        id: 'taste',
        label: 'Taste and buy a bottle',
        effects: { money: -15, happiness: 8, local: 2 },
        flags: { market: 1, oliveOil: true },
        result: 'Peppery, green and dangerously good. You now pour olive oil on things that do not need olive oil. Everything needs olive oil.',
        duje: 'Real domaće olive oil. Guard it with your life at airport security.',
        tip: 'domace',
      },
      {
        id: 'compliment',
        label: 'Taste, compliment, move on',
        effects: { happiness: 4, local: 1, energy: 2 },
        result: 'He nods, unoffended, and gives you a bit more bread anyway. A compliment from a tourist is still a compliment.',
        duje: 'He’ll tell his wife a tourist liked the oil. She’ll pretend not to care. She cares.',
      },
    ],
  },
  {
    id: 'lost-luggage-island',
    where: ['hvar', 'brac'],
    weight: 1,
    title: 'Where Is My Bag?',
    story: 'You step off the boat. Your bag does not. It waves goodbye from the deck as the ferry sails off towards the horizon.',
    choices: [
      {
        id: 'call',
        label: 'Call the port office and wait',
        effects: { energy: -8, happiness: -3, local: 1 },
        result: 'It comes back on the evening boat, smelling faintly of diesel and adventure. The port officer is now your hero.',
        duje: 'The port office knows every bag on every boat. They are the real intelligence service of Dalmatia.',
      },
      {
        id: 'buy-new',
        label: 'Buy a new swimsuit and stop worrying',
        effects: { money: -35, happiness: 5 },
        flags: { lemons: true },
        result: 'The only swimsuit in your size is covered in giant lemons. You wear it proudly. The bag turns up anyway.',
        duje: 'Lemons. Bold. Iconic. Photographed.',
        moment: { id: 'lemons', text: 'Wore a swimsuit covered in giant lemons (bag returned anyway)', rank: 6 },
      },
    ],
  },
  {
    id: 'got-guide',
    where: ['dubrovnik'],
    weight: 3,
    title: 'Winter Is Coming (in August)',
    story: 'A tour guide in a velvet cape offers a “Game of Thrones walking tour”. To demonstrate, he shouts “Shame!” at a pigeon. The pigeon is unbothered.',
    choices: [
      {
        id: 'join-tour',
        label: 'Join the tour',
        effects: { money: -25, energy: -10, happiness: 9, adventure: 2 },
        result: 'You climb the famous staircase, re-enact a famous scene, and appear in a group photo with forty strangers in matching T-shirts.',
        duje: 'Very touristy. Very fun. I won’t tell anyone. I will tell everyone.',
        tip: 'got-dubrovnik',
      },
      {
        id: 'real-history',
        label: 'Skip it and read about the real Republic of Ragusa',
        effects: { happiness: 6, local: 2, energy: 3 },
        result: 'Turns out the real history — a tiny republic of diplomats and merchants — is better than the show. Nobody shouts at pigeons.',
        duje: 'The real Dubrovnik out-negotiated empires. With paperwork. Respect the paperwork.',
      },
    ],
  },
  {
    id: 'cruise-wave',
    where: ['dubrovnik'],
    weight: 4,
    title: 'The Cruise-Ship Wave',
    story: 'Three enormous ships have docked. The main street fills like a bathtub. A tide of lanyards approaches at walking pace.',
    choices: [
      {
        id: 'dive-in',
        label: 'Dive into the crowd anyway',
        effects: { energy: -14, happiness: -2, adventure: 1 },
        result: 'You move at the speed of a glacier. On the bright side, you have memorised the back of a Hawaiian shirt in great detail.',
        duje: 'You have now seen Dubrovnik’s main street. And forty thousand shoulders.',
        tip: 'cruise-days',
      },
      {
        id: 'side-streets',
        label: 'Escape up the steep side streets',
        effects: { energy: -8, happiness: 9, local: 1 },
        flags: { hidden: 1 },
        result: 'Two hundred steps up: laundry lines, cats and silence. The real Dubrovnik was hiding upstairs the whole time.',
        duje: 'Up the stairs is where the city keeps its secrets. And its grandmothers.',
        tip: 'cruise-days',
        moment: { id: 'stairs', text: 'Escaped a cruise-ship crowd by climbing 200 steps', rank: 3 },
      },
      {
        id: 'evening',
        label: 'Swim now, see the old town in the evening',
        effects: { energy: 6, happiness: 9 },
        result: 'By sunset the ships have sailed and the stone glows gold. You have the main street almost to yourself.',
        duje: 'Evening Dubrovnik. The one I would show my own mother.',
        tip: 'go-early',
      },
    ],
  },
  {
    id: 'peacock-heist',
    where: ['dubrovnik'],
    when: (s) => s.flags.lokrum,
    weight: 6,
    title: 'The Peacock Heist',
    story: 'On Lokrum you unwrap a sandwich on a shady bench. A peacock appears. It looks at the sandwich. It looks at you. It has done this before.',
    choices: [
      {
        id: 'defend',
        label: 'Defend your sandwich',
        chance: {
          p: 0.3,
          success: { effects: { happiness: 9, adventure: 2 }, result: 'Victory! The peacock retreats with wounded dignity. You eat your sandwich like a champion.' },
          fail: { effects: { happiness: 3, money: -8 }, flags: { peacockLost: true }, result: 'The peacock wins. It always wins. You buy another sandwich and a little more respect for birds.' },
        },
        duje: 'Never fight a peacock on its own island. Home advantage.',
        tip: 'lokrum',
        moment: { id: 'peacock', text: 'Fought a peacock for a sandwich on Lokrum', rank: 8 },
      },
      {
        id: 'share',
        label: 'Accept defeat gracefully',
        effects: { happiness: 7, money: -6 },
        result: 'You and the peacock reach an understanding. It gets the crust. You get a photo that will win every holiday-story contest for years.',
        duje: 'A peaceful solution. The UN should hire you.',
        tip: 'lokrum',
      },
    ],
  },
  {
    id: 'peka-order',
    where: ['split', 'brac', 'hvar', 'omis'],
    when: (s) => !s.flags.pekaOrdered,
    weight: 2,
    title: 'Peka, Please',
    story: 'You walk into a konoba starving and ask for the famous peka. The waiter looks at the clock, then at you, with the deep sympathy of a man delivering bad news.',
    choices: [
      {
        id: 'order-tomorrow',
        label: 'Order peka for tomorrow, eat grilled fish today',
        effects: { money: -30, happiness: 9, local: 2 },
        flags: { konoba: 1, pekaOrdered: true, pekaDay: '@day', pekaPlace: '@here' },
        result: 'Grilled fish tonight, peka reserved for tomorrow. The waiter shakes your hand. You have passed a test you didn’t know existed.',
        duje: 'You pre-ordered peka. Tomorrow will be a good day. Don’t make other plans. You will make other plans, won’t you.',
        tip: 'peka',
      },
      {
        id: 'demand-now',
        label: 'Insist: peka now!',
        effects: { money: -20, happiness: -3, energy: 4 },
        result: 'You get a pizza. A good pizza! But not peka. The table next to you gets their pre-ordered peka and you smell every second of it.',
        duje: 'Peka takes hours. The pizza took eight minutes. Life is about choices.',
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
    story: 'You suddenly remember you promised souvenirs to everyone. Everyone. Your boss. Your dentist. Your neighbour’s dog.',
    choices: [
      {
        id: 'local-goods',
        label: 'Olive oil, lavender and honey from a market',
        effects: { money: -30, happiness: 7, local: 2 },
        flags: { market: 1 },
        result: 'Real local products made by real people, wrapped in newspaper by a lady who calls you “dušo” — darling. Cash only. You came prepared.',
        duje: 'Your dentist will finally respect you.',
        tip: 'euro-and-cash',
      },
      {
        id: 'magnets',
        label: 'Buy 14 identical magnets',
        effects: { money: -20, happiness: 2, energy: 4 },
        flags: { magnets: 1 },
        result: 'Efficient. Soulless. The dog will not care either way, which makes the dog the wisest person on your list.',
        duje: 'Fourteen magnets. You have gifted fourteen people one identical disappointment.',
      },
    ],
  },
  {
    id: 'sunset-spot',
    where: ['any'],
    when: (s) => s.day === 5,
    weight: 3,
    title: 'The Last Sunset',
    story: 'Your final evening. The sun is sliding towards the sea. You get one chance to choose where to watch it.',
    choices: [
      {
        id: 'crowded-bar',
        label: 'The famous sunset bar',
        effects: { money: -25, happiness: 7, energy: 2 },
        result: 'A lovely sunset, framed by two hundred phones held up in perfect synchronisation. Yours is one of them. The bill includes a “kuver” you never noticed on the menu.',
        duje: 'Nice. Expensive. Nice. Read the small print next time — bread is not always a gift.',
        tip: 'kuver',
      },
      {
        id: 'rocks',
        label: 'A quiet rock by the sea, with a cold drink from the shop',
        effects: { money: -3, happiness: 11, local: 1 },
        result: 'Just you, the warm stone, the waves and a sky that tries every colour it owns. Pomalo.',
        duje: 'This is the one you’ll remember. Trust me. I’ve watched four thousand of them. Still not bored.',
        tip: 'pomalo',
        moment: { id: 'rock-sunset', text: 'Watched the last sunset from a warm rock, pomalo', rank: 2 },
      },
    ],
  },

  // ───────────────────────── callbacks: your earlier choices come back
  {
    id: 'fish-reunion',
    kind: 'callback',
    priority: true,
    where: ['any'],
    when: (s) => s.flags.bigFish && s.location !== 'split',
    weight: 9,
    title: 'Word Travels Fast in Dalmatia',
    story: (s) =>
      `In ${DESTINATIONS[s.location].name}, a waiter squints at you, then grins. “Wait. Are you the one who ate the three-kilo fish in Split? My cousin told me!” The whole terrace turns around.`,
    choices: [
      {
        id: 'own-it',
        label: 'Own it: “Yes. It was magnificent.”',
        effects: { happiness: 10, local: 2, adventure: 2 },
        flags: { fishLegend: true },
        result: 'Applause. Someone buys you a drink. A child asks for a selfie. You are a minor celebrity in a very specific, fish-related way.',
        duje: 'A legend is just a mistake told with confidence.',
        moment: { id: 'fish-legend', text: 'Became famous along the coast as “the three-kilo fish tourist”', rank: 11 },
      },
      {
        id: 'deny',
        label: 'Deny everything, order a salad',
        effects: { happiness: -2, money: -8, energy: 3 },
        result: 'Nobody believes you. The waiter brings your salad with a tiny fish-shaped garnish. Dalmatians never forget, but they do accessorise.',
        duje: 'Denial will not work. My cousin has a photo.',
      },
    ],
  },
  {
    id: 'mirror-inspection',
    kind: 'callback',
    priority: true,
    broke: {
      result: 'You explain that you will pay “when you get home”. There is a long silence. They agree, in the tone of people who have heard this from hundreds of tourists, and email you an invoice with three exclamation marks.',
      duje: 'You now owe money to a car rental company in another country. Very international. Very adult.',
      moment: { id: 'mirror-debt', text: 'Flew home owing a rental company for a mirror (invoice had three exclamation marks)', rank: 9 },
    },
    where: ['any'],
    when: (s) => s.flags.mirror && s.day >= 3,
    weight: 9,
    title: 'The Rental Company Has Questions',
    story: 'Your phone rings. It is the car rental company. They would like to talk about “the condition of the left mirror”. There is a long pause in which you hear a Roman wall laughing.',
    choices: [
      {
        id: 'pay',
        label: 'Apologise and pay for the repair',
        effects: { money: -80, happiness: -4, local: 1 },
        result: 'Expensive, honest, done. The clerk thanks you for not blaming “a goat”, which is apparently the most common excuse.',
        duje: 'Paid. Painful, but clean. Your soul is lighter. Your wallet is much lighter.',
      },
      {
        id: 'charm',
        label: 'Charm them in Croatian',
        chance: {
          p: (s) => (s.flags.phrases ? 0.6 : 0.2),
          success: { effects: { money: -20, happiness: 8, local: 2 }, result: 'Your “dobar dan… molim… hvala” is so heartfelt that the clerk laughs and charges you only the “sentimental value”.' },
          fail: { effects: { money: -80, happiness: -2 }, result: 'Your Croatian is charming. Your mirror is still broken. The clerk is charmed, and also invoices you in full.' },
        },
        duje: 'Croatian words can open doors. Repairing mirrors is a bigger ask.',
      },
      {
        id: 'goat',
        label: 'Blame a goat',
        effects: { money: -80, happiness: 3, adventure: 2 },
        result: '“A goat,” the clerk repeats slowly. “Of course.” He invoices you in full and adds your story to the office goat list. You are number 38.',
        duje: 'Number 38. You are not even the most creative goat story this month.',
        moment: { id: 'goat', text: 'Blamed a broken mirror on a goat (and was customer #38 to do so)', rank: 9 },
      },
    ],
  },
  {
    id: 'peka-ready',
    kind: 'callback',
    priority: true,
    broke: {
      result: 'You confess you can’t pay for the peka you ordered. The owner looks at you for a long moment, then wraps a portion in foil “for the road” and refuses your coins. Dalmatian hospitality wins again.',
      duje: 'They gave you the peka for free. Do you understand how rare that is? Send them a postcard. Send them ten.',
      moment: { id: 'free-peka', text: 'Confessed to being broke and got a pre-ordered peka wrapped in foil for free', rank: 8 },
    },
    where: ['any'],
    when: (s) => s.flags.pekaOrdered && s.flags.pekaDay < s.day && !s.flags.pekaDone,
    weight: 12,
    title: 'Your Peka Is Ready',
    story: (s) =>
      s.location === s.flags.pekaPlace
        ? 'The konoba calls: your peka has been slow-cooking under the embers since morning. The smell reaches you two streets away. Your stomach starts walking before you do.'
        : `The konoba in ${DESTINATIONS[s.flags.pekaPlace]?.name ?? 'the other town'} calls: “Your peka is ready!” You are in ${DESTINATIONS[s.location].name}. The peka is not.`,
    choices: [
      {
        id: 'feast',
        label: (s) => (s.location === s.flags.pekaPlace ? 'Feast' : 'Find a peka here instead, tonight'),
        effects: { money: -25, happiness: 13, energy: 12, local: 2 },
        flags: { pekaDone: true, konoba: 1 },
        result: (s) =>
          s.location === s.flags.pekaPlace
            ? 'They lift the iron bell and a cloud of rosemary, wine and slow-cooked heaven rolls across the table. You stop speaking for twenty minutes. So does everyone else.'
            : 'Against all odds, a konoba here has a spare peka for a cancelled table. Destiny smells like rosemary.',
        duje: 'This is why we wait. This is why we pre-order. This is Dalmatia.',
        moment: { id: 'peka', text: 'Pre-ordered a peka like a pro (and was rewarded)', rank: 4 },
      },
      {
        id: 'gift-peka',
        label: (s) => `Tell them to give it to ${s.flags.marija ? 'Marija' : 'the neighbours'}`,
        effects: { money: -20, happiness: 6, local: 3 },
        flags: { pekaDone: true },
        result: 'You pay for it anyway and tell them to give it to someone hungry. The story reaches three villages by evening. You are now “the generous one”.',
        duje: 'Generosity in Dalmatia is never forgotten. Neither is the fish, but that’s another matter.',
        moment: { id: 'gift-peka', text: 'Paid for a peka and gave it away (now known as “the generous one”)', rank: 5 },
      },
    ],
  },
  {
    id: 'wedding-aunt',
    kind: 'callback',
    priority: true,
    where: ['any'],
    when: (s) => s.flags.wedding && s.day >= 3,
    weight: 8,
    title: 'The Aunt From the Wedding',
    story: 'A voice calls your name across the square. It is the aunt from the wedding. She has your photo on her phone. She has forty photos on her phone. She is coming towards you with intent.',
    choices: [
      {
        id: 'sunday-lunch',
        label: 'Accept the invitation to “a small family lunch”',
        effects: { happiness: 12, energy: 10, local: 3, adventure: -2 },
        flags: { adopted: 1, konoba: 1 },
        result: 'The small family lunch has thirty-one people, four courses and two uncles arguing about football. You are fed until you cannot see. You are family now.',
        duje: 'A “small lunch” is a Dalmatian figure of speech. Like “five minutes” and “I’m on my way”.',
        moment: { id: 'family-lunch', text: 'Was adopted by a Dalmatian family at a “small lunch” for 31 people', rank: 9 },
      },
      {
        id: 'escape',
        label: 'Pretend you have a ferry to catch',
        effects: { happiness: -2, energy: -4, adventure: 2 },
        result: 'You escape. She waves happily, because she knows the ferry schedule better than you do. She will see you again. They always see you again.',
        duje: 'Running from an aunt. Never works. They have networks.',
      },
    ],
  },
  {
    id: 'morning-after',
    kind: 'callback',
    priority: true,
    where: ['any'],
    when: (s) => s.flags.partyBoat && s.flags.partyBoatDay === s.day - 1,
    weight: 12,
    title: 'The Morning After',
    story: 'You wake up with one flip-flop, glitter in places glitter should not be, and a headache with its own weather system. Today-you is meeting yesterday-you’s decisions.',
    choices: [
      {
        id: 'burek-cure',
        label: 'Bakery burek and a yoghurt, the local cure',
        effects: { money: -4, energy: 14, happiness: 5, local: 1 },
        result: 'Hot burek, cold yoghurt, a bench in the shade. Within twenty minutes you are a person again. Mostly.',
        duje: 'Burek and yoghurt: Balkan medicine. Doctors hate it. Doctors also eat it.',
        tip: 'pekara',
      },
      {
        id: 'sleep-in',
        label: 'Sleep until noon',
        effects: { energy: 18, happiness: 2, adventure: -3 },
        result: 'You sleep through breakfast, lunch and a small earthquake of activity in the hostel. You feel human. The day feels shorter.',
        duje: 'Noon. Good morning. Half the day is gone. The other half is also mostly gone.',
      },
    ],
  },
  {
    id: 'sunburn-revenge',
    kind: 'callback',
    priority: true,
    where: ['any'],
    when: (s) => s.flags.sunburn && !s.flags.sunburnDone,
    weight: 8,
    title: 'The Backpack Strap of Doom',
    story: 'You put on your backpack. Your sunburnt shoulders scream in a language you didn’t know they spoke.',
    choices: [
      {
        id: 'ljekarna-now',
        label: 'Go to a ljekarna (finally)',
        effects: { money: -12, energy: 6, happiness: 4 },
        flags: { sunburnDone: true },
        result: 'The pharmacist looks at your shoulders, sighs the sigh of a thousand summers, and hands you exactly the right cream.',
        duje: 'Pharmacists in Dalmatia have seen everything. EVERYTHING.',
        tip: 'ljekarna',
      },
      {
        id: 'towel-cape',
        label: 'Wear a beach towel as a cape',
        effects: { happiness: 3, adventure: 2, energy: -4 },
        flags: { sunburnDone: true },
        result: 'You walk through town in a towel cape like a minor superhero whose power is regret. Children point. A dog salutes.',
        duje: 'Captain Sunburn. Defender of the shade.',
        moment: { id: 'cape', text: 'Walked through town wearing a towel cape (sunburn-related)', rank: 6 },
      },
    ],
  },
  {
    id: 'pirate-nephew',
    kind: 'callback',
    priority: true,
    where: ['hvar', 'brac', 'dubrovnik'],
    when: (s) => s.flags.grandpa,
    weight: 9,
    title: 'The Nephew on the Napkin',
    story: 'A man in a ferry-company shirt sees the napkin map sticking out of your pocket. “Is that my grandfather’s handwriting? Did he tell you the octopus recipe?” He looks genuinely moved.',
    choices: [
      {
        id: 'nephew-cove',
        label: 'Ask him for the cove on the napkin',
        effects: { energy: -6, happiness: 13, adventure: 5, local: 2 },
        flags: { hidden: 1, secretCove: true },
        result: 'After his shift he takes you to a cove marked only “X — BEST” on the napkin. Turquoise water, no one else, and a fig tree. The pirates knew things.',
        duje: 'The napkin was worth more than a credit card. I told you.',
        moment: { id: 'napkin', text: 'Found a secret cove using a pirate grandpa’s napkin map', rank: 10 },
      },
      {
        id: 'nephew-coffee',
        label: 'Have a coffee and swap stories',
        effects: { happiness: 8, energy: 6, local: 2 },
        result: 'He buys the coffee, tells you three ferry stories involving goats, and promises to “say hello to Grandpa”. You feel strangely honoured.',
        duje: 'Goat stories. Every ferry worker has at least three.',
      },
    ],
  },
  {
    id: 'cousin-network',
    kind: 'callback',
    where: ['trogir', 'omis', 'krka', 'hvar', 'brac', 'dubrovnik'],
    when: (s) => s.flags.marija && s.day >= 2,
    weight: 4,
    title: 'Marija Called Ahead',
    story: 'You sit down in a konoba. The owner sees your face and says, “Ah! Marija’s guest!” Marija has, apparently, called ahead. Marija has called everyone.',
    choices: [
      {
        id: 'cousin-feast',
        label: 'Let the cousin choose for you',
        effects: { money: -12, happiness: 11, local: 3, energy: 6 },
        flags: { konoba: 1, adopted: 1 },
        result: 'Five dishes you didn’t order arrive, along with a bill that is suspiciously small and a message: “Marija says eat more.”',
        duje: 'The Marija network. Faster than 5G. More reliable than ferries.',
        moment: { id: 'marija', text: 'Got fed by Marija’s cousin network in another town', rank: 6 },
      },
      {
        id: 'cousin-decline',
        label: 'Insist on paying full price',
        effects: { money: -30, happiness: 4, local: 1 },
        result: 'The cousin looks offended, then amused, then charges you full price and adds a free dessert out of principle.',
        duje: 'You can try to pay full price in Dalmatia. You will fail, but you can try.',
      },
    ],
  },
  {
    id: 'luka-returns',
    kind: 'callback',
    where: ['hvar', 'brac', 'omis', 'trogir', 'dubrovnik'],
    when: (s) => s.flags.hostel && s.day >= 3,
    weight: 4,
    title: 'Luka Has Found You',
    story: 'From across the square, a familiar strum. It is Luka, from the hostel. He has followed you here with the guitar. He knows four chords and he wants you to sing.',
    choices: [
      {
        id: 'duet',
        label: 'Sing a duet in the square',
        effects: { happiness: 11, adventure: 3, money: 12 },
        result: 'You sing. Badly. Gloriously. A small crowd gathers, laughs, and throws coins into Luka’s guitar case. He splits the money with you like an honest pirate.',
        duje: 'You earned money singing in Dalmatia. Do not quit your job. But I’m impressed.',
        moment: { id: 'busking', text: 'Earned money busking with a man who knows four chords', rank: 8 },
      },
      {
        id: 'hide',
        label: 'Hide behind a lavender stall',
        effects: { happiness: 3, energy: 2 },
        result: 'Luka plays all four chords to an audience of one confused German couple. You hear it from behind the lavender. It is somehow beautiful.',
        duje: 'Hiding from Luka is a Dalmatian tradition older than the hostel.',
      },
    ],
  },
  {
    id: 'igor-upsell',
    kind: 'callback',
    where: ['any'],
    when: (s) => s.flags.boutique && s.day >= 2,
    weight: 4,
    title: 'Igor Has Arranged Something',
    story: 'A message from Igor the concierge: “Dear guest, I have taken the liberty of reserving an exclusive sunset experience with champagne, for only a small supplement.” The supplement is not small.',
    choices: [
      {
        id: 'igor-yes',
        label: 'Accept Igor’s exclusive experience',
        effects: { money: -70, happiness: 9, energy: 4 },
        result: 'Champagne, a boat, a sunset, and a photographer who calls you “darling” fourteen times. It is lovely. Igor sends a smiley face and an invoice.',
        duje: 'Igor is having a very good week. Thanks to you.',
      },
      {
        id: 'igor-no',
        label: 'Ask Igor where HE goes for sunset',
        effects: { money: -4, happiness: 10, local: 2 },
        flags: { hidden: 1 },
        result: 'Igor pauses, then whispers the name of a rocky point behind the church. No champagne, no boat, no photographer. The best sunset of your life.',
        duje: 'Always ask the concierge where the concierge goes. Golden rule.',
        tip: 'domace',
        moment: { id: 'igor-secret', text: 'Got the concierge to reveal his secret sunset spot', rank: 5 },
      },
    ],
  },
  {
    id: 'urchin-limp',
    kind: 'callback',
    priority: true,
    where: ['any'],
    when: (s) => s.flags.urchin && !s.flags.urchinDone,
    weight: 7,
    title: 'Step Carefully',
    story: 'Your foot, still haunted by yesterday’s sea urchin, reminds you of its existence with every step. A long staircase appears ahead. Of course it does.',
    choices: [
      {
        id: 'ljekarna-foot',
        label: 'Ask a pharmacist for help',
        effects: { money: -10, energy: 8, happiness: 3 },
        flags: { urchinDone: true },
        result: 'Ten minutes, one cream and one look that says “water shoes”, and you are walking normally again.',
        duje: 'Everyone gets the look. I got the look in 2009.',
        tip: 'ljekarna',
      },
      {
        id: 'limp-on',
        label: 'Limp heroically',
        effects: { energy: -10, happiness: -2, adventure: 2 },
        flags: { urchinDone: true },
        result: 'You limp up the stairs with the quiet dignity of a war veteran. Grandmothers overtake you. One of them is carrying a watermelon.',
        duje: 'Overtaken by a nonna with a watermelon. Character-building.',
      },
    ],
  },

  // ───────────────────────── hidden discoveries (rare)
  {
    id: 'beach-no-name',
    kind: 'hidden',
    where: ['any'],
    when: (s) => s.local >= 5 && s.location !== 'dubrovnik',
    weight: 2,
    title: 'The Beach With No Name',
    story: 'One of your new local friends leans in: “There’s a beach. No sign, no bar, no influencers. Want to see?”',
    choices: [
      {
        id: 'go',
        label: 'Absolutely',
        effects: { energy: -8, happiness: 14, adventure: 5, local: 1 },
        flags: { hidden: 1, secretCove: true },
        result: 'A goat path, a scramble, and then: turquoise water and nobody at all. You swear an oath of secrecy. You will keep it. Mostly.',
        duje: 'If you post the location, I will know. And the goats will know.',
        tip: 'public-beaches',
        moment: { id: 'no-name', text: 'Was shown a beach with no name (and swore to keep it secret)', rank: 7 },
      },
      {
        id: 'nap',
        label: 'Politely choose a nap instead',
        effects: { energy: 16, happiness: 2 },
        result: 'You sleep like a cat on a warm stone. Your friend sends photos of the beach. They are… extremely nice.',
        duje: 'You chose a nap over a secret beach. I respect it. I don’t understand it.',
      },
    ],
  },
  {
    id: 'hajduk-night',
    kind: 'hidden',
    where: ['split'],
    weight: 2,
    title: 'Match Night',
    story: 'The whole city has turned white and blue. Hajduk is playing tonight. Strangers are hugging. Duje has texted you nine times, in capital letters.',
    choices: [
      {
        id: 'watch-match',
        label: 'Watch the match in a packed bar with Duje',
        effects: { money: -8, energy: -8, happiness: 12, local: 2 },
        result: 'You understand nothing about the tactics and everything about the emotion. When the goal goes in, a man you have never met kisses you on both cheeks.',
        duje: 'Now you understand Split. Football here is not a sport. It is weather.',
        tip: 'hajduk',
        moment: { id: 'hajduk', text: 'Got kissed on both cheeks by a stranger when Hajduk scored', rank: 7 },
      },
      {
        id: 'quiet-walk',
        label: 'Take a quiet walk while the city watches',
        effects: { happiness: 6, energy: 4 },
        result: 'The streets are empty, the palace glows, and every few minutes the whole city roars at once. It is eerie and wonderful.',
        duje: 'Walking during a Hajduk match. My uncle would call the police. Out of concern.',
        tip: 'hajduk',
      },
    ],
  },
  {
    id: 'saint-duje',
    kind: 'hidden',
    where: ['split'],
    when: (s) => s.local >= 4,
    weight: 2,
    title: 'Meet the Other Duje',
    story: 'Duje insists on showing you “the original Duje”: the cathedral of Split’s patron saint. “I’m named after him,” he says proudly. “He’s more famous, but I’m funnier.”',
    choices: [
      {
        id: 'cathedral',
        label: 'Let Duje give you the tour',
        effects: { money: -10, happiness: 9, local: 2 },
        result: 'Duje tells you everything about the saint, the festival in May, and his own birthday, which he believes is equally important.',
        duje: 'Sveti Duje protects the city. I protect you. We are basically colleagues.',
        tip: 'sveti-duje',
        moment: { id: 'saint', text: 'Toured the patron saint’s cathedral with his namesake, Duje', rank: 3 },
      },
      {
        id: 'skip-tour',
        label: 'Tell Duje you’ve seen enough churches',
        effects: { happiness: 2, energy: 6 },
        result: 'Duje looks wounded, buys you an ice cream anyway, and tells you about the saint while you eat it. You get the tour regardless.',
        duje: 'You cannot escape a Dalmatian who wants to tell you something. It’s physically impossible.',
        tip: 'sveti-duje',
      },
    ],
  },
  {
    id: 'radman-mills',
    kind: 'hidden',
    where: ['omis'],
    weight: 2,
    title: 'The Old Mills',
    story: 'A boatman offers to take you further up the Cetina, “past where the kayaks stop”, to an old mill hidden among the trees.',
    choices: [
      {
        id: 'mills',
        label: 'Go upriver',
        effects: { money: -15, energy: -6, happiness: 11, adventure: 4 },
        flags: { hidden: 1 },
        result: 'The river narrows, the cliffs rise, and suddenly there is a stone mill, a waterfall and a picnic spot full of very relaxed locals.',
        duje: 'Upriver is where the Cetina keeps its best secrets. Downriver is where it keeps the tourists.',
        tip: 'radman-mills',
        moment: { id: 'mills', text: 'Went upriver past where the kayaks stop', rank: 4 },
      },
      {
        id: 'mills-no',
        label: 'Stay in town for an early dinner',
        effects: { money: -12, happiness: 5, energy: 6 },
        result: 'Fresh squid, cold wine, and a boatman who keeps waving from the river. You wave back. Maybe next time.',
        duje: 'Next time. Everyone says next time. Next time is how Dalmatia gets you back.',
        tip: 'radman-mills',
      },
    ],
  },
];

/* ───────────────────────────────────────────────── ACHIEVEMENTS ── */
export const ACHIEVEMENTS = [
  { id: 'konoba-expert', title: 'Konoba Expert', emoji: '🍷', description: 'Eat at two konobas or local family places.', test: (s) => f(s, 'konoba') >= 2 },
  { id: 'island-survivor', title: 'Island Survivor', emoji: '⛵', description: 'Survive a wind-cancelled sailing.', test: (s) => Boolean(s.flags.ferrySurvivor) },
  { id: 'local-explorer', title: 'Local Explorer', emoji: '🧭', description: 'Discover three hidden places away from the crowds.', test: (s) => f(s, 'hidden') >= 3 },
  { id: 'market-master', title: 'Market Master', emoji: '🧺', description: 'Shop like a local at two markets or farm stalls.', test: (s) => f(s, 'market') >= 2 },
  { id: 'budget-genius', title: 'Budget Genius', emoji: '💶', description: 'Finish with at least €200 left — and a smile.', test: (s) => s.ended && s.money >= 200 && s.happiness >= 55 },
  { id: 'croatian-legend', title: 'Croatian Legend', emoji: '👑', description: 'Reach the Croatia Legend ending.', test: (s) => s.ended && s.ending === 'legend' },
];

/* ───────────────────────────────────────────────────── ENDINGS ── */
/** Checked in order; the first match wins. `verdict` is Duje’s one-liner for the share card. */
export const ENDINGS = [
  {
    id: 'disaster',
    title: 'Tourist Disaster',
    emoji: '🫠',
    photo: 'bacvice',
    test: (s) => s.energy <= 0 || s.happiness <= 25 || (s.money < 15 && s.happiness < 50),
    verdict: 'Survived Croatia. Croatia also survived me. Barely.',
    epilogue:
      'Sunburnt, exhausted and poorer in ways you can’t fully explain, you board the plane home. Duje waves from the terminal holding a sign that says “WATER SHOES”. There will be a next time. There is always a next time.',
  },
  {
    id: 'legend',
    title: 'Croatia Legend',
    emoji: '👑',
    photo: 'dubrovnik',
    test: (s, x) => x.score >= 1000 && s.happiness >= 75 && s.visited.length >= 5 && s.tipsFound.length >= 12,
    verdict: 'Ate like a local, swam like a fish, said “hvala” with a perfect accent.',
    epilogue:
      'Five days, five chapters, zero regrets. You ate like a local, swam like a fish and navigated ferries like a sailor. Duje has told his mother about you. His mother has told the whole street. You are expected back by June.',
  },
  {
    id: 'adopted',
    title: 'Adopted by Dalmatia',
    emoji: '🍲',
    photo: 'diocletians-palace',
    test: (s) => f(s, 'adopted') >= 1 && f(s, 'konoba') >= 2 && s.happiness >= 55,
    verdict: 'Came for a holiday. Left with a Dalmatian family and a 31-person WhatsApp group.',
    epilogue:
      'Somewhere between the third konoba and the second “small family lunch”, it happened: you were adopted. You now receive voice messages from aunts you can’t understand, and Christmas parcels of figs. There is no unsubscribe button.',
  },
  {
    id: 'fish',
    title: 'The Three-Kilo Fish Legend',
    emoji: '🐟',
    photo: 'trogir',
    test: (s) => s.flags.fishLegend && s.happiness >= 40,
    verdict: 'Ordered one fish. Became a coastal legend. Would do it again.',
    epilogue:
      'History will forget the emperors. It will not forget the tourist who ordered the three-kilo fish without asking the price. Waiters from Split to Dubrovnik tell your story. In some versions the fish is now six kilos.',
  },
  {
    id: 'hostage',
    title: 'Professional Ferry Hostage',
    emoji: '⛴️',
    photo: 'brac',
    test: (s) => f(s, 'hostage') >= 1 && s.happiness >= 45,
    verdict: 'Got stranded on an island by the wind. Best thing that happened all week.',
    epilogue:
      'The bura kept you on the island, and the island kept your heart. You know the harbour cat by name, the waiter knows your order, and you still check the wind forecast every morning — at home, three countries away.',
  },
  {
    id: 'island',
    title: 'Island Explorer',
    emoji: '🏝️',
    photo: 'hvar',
    test: (s) => s.happiness >= 50 && ((was(s, 'hvar') && was(s, 'brac')) || (f(s, 'island') >= 2 && Boolean(s.flags.ferrySurvivor))),
    verdict: 'Mainland? Never heard of it. My blood type is now “ferry”.',
    epilogue:
      'You came for the mainland and left as an islander. Your heart now runs on ferry timetables, salty hair and grilled squid. You catch yourself saying “on the island we…” at dinner parties. Your friends are worried.',
  },
  {
    id: 'insider',
    title: 'Local Insider',
    emoji: '🗝️',
    photo: 'split-hero',
    test: (s) => s.local >= 13,
    verdict: 'Three-hour coffees, a secret beach, and a market vendor who calls me “dušo”.',
    epilogue:
      'Konobas, markets, three-hour coffees and a secret beach you will take to the grave. You didn’t visit Croatia — you briefly lived in it. Duje says you can come back any time, which from a Dalmatian is basically a marriage proposal.',
  },
  {
    id: 'budget',
    title: 'Budget Master',
    emoji: '💶',
    photo: 'trogir',
    test: (s) => s.money >= 200 && s.happiness >= 55,
    verdict: 'Bus tickets bought before boarding. Free beaches. Market picnics. Money left. Respect.',
    epilogue:
      'Free beaches, market picnics, tickets bought before boarding — and still enough money for a very respectable farewell dinner. Your bank sends you a thank-you note. Duje sends a voice message that just says “bravo” six times.',
  },
  {
    id: 'fjaka',
    title: 'Fjaka Champion',
    emoji: '😎',
    photo: 'brac',
    test: (s) => s.energy >= 70 && s.happiness >= 60,
    verdict: 'Mastered the ancient Dalmatian art of doing absolutely nothing.',
    epilogue:
      'You mastered the ancient Dalmatian art of doing nothing, gloriously. You return home rested, relaxed and annoyingly calm. When colleagues ask your secret, you just whisper: “pomalo”.',
  },
  {
    id: 'happy',
    title: 'Happy Holidaymaker',
    emoji: '🌞',
    photo: 'split-hero',
    test: () => true,
    verdict: 'A few triumphs, a few disasters, a lot of sunshine. Ten out of ten, would get sunburnt again.',
    epilogue:
      'Some triumphs, a few disasters, a lot of sunshine. A good holiday — and a list of things you’ll do differently next time. Duje has written the list for you. It starts with “water shoes”.',
  },
];
