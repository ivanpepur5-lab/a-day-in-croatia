/**
 * PLACE EVENTS — moments that only make sense in one destination (fiction,
 * built around real places and traditions; the facts live on the tip cards).
 */
export const PLACE_EVENTS = [
  // ───────────────────────── Split
  {
    id: 'peskarija',
    slot: 'day',
    where: ['split'],
    weight: 2,
    title: 'The Fish Market',
    story:
      'Peškarija, Split’s fish market: stone counters, ice, silver fish and fishmongers calling out like auctioneers. You notice something strange. There are no flies. Not one. A fishmonger winks: “Sulphur springs. The flies hate it.”',
    choices: [
      {
        id: 'buy-sardines',
        label: 'Buy sardines for a grill picnic',
        effects: { money: -6, happiness: 7, local: 2 },
        flags: { market: 1 },
        result: 'A paper parcel of sardines and three contradictory grilling tips, each delivered with total certainty. That evening you grill them on a borrowed barbecue and nobody dies. Success.',
        duje: 'Is it really the sulphur? Locals say yes. Scientists say “hmm”. I say: no flies, no problem.',
        tip: 'peskarija',
      },
      {
        id: 'watch-nonna',
        label: 'Just watch the theatre',
        effects: { happiness: 5, energy: 2, local: 1 },
        result: 'A nonna inspects a fish’s eyes with the focus of a surgeon, rejects it, inspects another and talks the price down with a smile. You learn more about negotiation in ten minutes than in years of meetings.',
        duje: 'Clear eyes, red gills. That’s how grandmothers choose fish. And sons-in-law.',
        tip: 'peskarija',
      },
    ],
  },
  {
    id: 'grgur-toe',
    slot: 'day',
    where: ['split'],
    weight: 2,
    title: 'The Lucky Toe',
    story:
      'By the Golden Gate stands a giant bronze bishop, Grgur Ninski, with one big toe polished gold by millions of hands. A queue of tourists waits to rub it. Duje rolls his eyes, then quietly rubs it himself when he thinks you aren’t looking.',
    choices: [
      {
        id: 'rub-toe',
        rel: { duje: 1 },
        label: 'Rub the toe and make a wish',
        effects: { happiness: 6, local: 1 },
        flags: { luckyToe: true },
        result: 'You rub the toe and make a wish. Duje asks what you wished for. You refuse to say. He respects that, then guesses correctly. (Your luck may come in handy later.)',
        duje: 'Everyone rubs the toe. Exams, love, Hajduk. Mostly Hajduk.',
        tip: 'grgur-toe',
      },
      {
        id: 'refuse-toe',
        label: 'Refuse: superstition is for tourists',
        effects: { happiness: 2, energy: 3 },
        result: 'You walk past with great dignity. Three minutes later you trip over a perfectly flat stone. Coincidence? Duje says no.',
        duje: 'Never insult the toe. The toe remembers.',
        tip: 'grgur-toe',
      },
    ],
  },
  {
    id: 'bacvice-night',
    slot: 'evening',
    where: ['split'],
    weight: 2,
    title: 'Bačvice After Dark',
    story:
      'After dinner, Bačvice fills up again: students, couples, one man still playing picigin alone in the dark. Music drifts down from the bars. The sea is warm, black and full of reflected light.',
    choices: [
      {
        id: 'night-swim',
        label: 'Go for a night swim',
        effects: { energy: -4, happiness: 10, adventure: 2 },
        result: 'You float in warm black water while music plays on the shore and the city lights shimmer around you. Someone nearby sighs “ajme, lijepo” — oh, beautiful — to nobody in particular. Exactly.',
        duje: 'Night swim at Bačvice. If you didn’t do this, you didn’t do Split.',
      },
      {
        id: 'bar-dance',
        label: 'Dance at the beach bars until dawn',
        effects: { money: -20, energy: -14, happiness: 9, adventure: 2 },
        result: 'You dance until the sky turns pale. On the way home a bakery is just opening its doors, the most beautiful sight of the night. Burek at dawn.',
        duje: 'Burek at dawn. The circle of life in Split.',
        tip: 'pekara',
      },
      {
        id: 'wall-view',
        label: 'Sit on the warm wall and watch',
        effects: { happiness: 6, energy: 6 },
        result: 'You sit on the warm wall and watch the city have fun: couples, friends, a grandfather in swimming trunks. Nobody is in a hurry. Neither are you.',
        duje: 'People-watching is our national sport. Picigin is second.',
      },
    ],
  },

  // ───────────────────────── Trogir
  {
    id: 'radovan-portal',
    slot: 'day',
    where: ['trogir'],
    weight: 3,
    title: 'Adam, Eve and Two Tour Guides',
    story:
      'In front of Trogir’s cathedral, two tour guides are having a polite but intense disagreement about the carved portal: which saints, which lions, and why Adam looks so worried. Their groups are getting restless.',
    choices: [
      {
        id: 'study-portal',
        label: 'Ignore them and look properly',
        effects: { happiness: 7, local: 1, energy: 2 },
        result: 'Up close the carvings are astonishing: saints, monsters, peasants doing the work of each month, and Adam and Eve looking exactly as awkward as you’d expect after the apple.',
        duje: 'Master Radovan carved that eight centuries ago. I can’t carve a watermelon.',
        tip: 'radovan-portal',
      },
      {
        id: 'funny-guide',
        label: 'Join whichever guide is funnier',
        effects: { happiness: 8, energy: -3 },
        result: 'The funnier guide wins. He does a voice for every apostle. The other group slowly defects. By the end one guide has forty people and the other has one loyal grandmother.',
        duje: 'In Dalmatia, history is half facts and half performance. Pick the performer.',
        tip: 'radovan-portal',
      },
    ],
  },
  {
    id: 'evening-dir',
    slot: 'evening',
    where: ['trogir', 'omis', 'hvar', 'brac', 'split'],
    weight: 2,
    title: 'The Evening Đir',
    story:
      'As the heat fades, the whole town comes out to walk the waterfront: slowly, in pairs and families, dressed up, ice cream in hand. Nobody is going anywhere. Everybody is going there together.',
    choices: [
      {
        id: 'do-dir',
        label: 'Join the đir',
        effects: { happiness: 8, energy: 2, local: 2 },
        result: 'You walk the waterfront three times. The third time, people start nodding at you. The fourth time, a grandmother tells you your shirt is nice. You are part of the town’s evening now.',
        duje: 'The đir. You walk, you look, you get looked at. Instagram, but with legs.',
        tip: 'dir',
      },
      {
        id: 'cafe-watch',
        label: 'Watch it all from a café table',
        effects: { money: -5, energy: 5, happiness: 7 },
        result: 'From a café table you watch the town parade past: babies, teenagers in love, couples who have done this walk for fifty years. The best show in town, and it only costs a coffee.',
        duje: 'Café, view, people. Three of the four Dalmatian food groups.',
        tip: 'dir',
      },
    ],
  },

  // ───────────────────────── Omiš
  {
    id: 'zipline-omis',
    slot: 'day',
    where: ['omis'],
    weight: 3,
    title: 'Flying Over the Canyon',
    story:
      'High above the Cetina, cables stretch from cliff to cliff, and people are flying along them screaming in many languages. A guide hands you a helmet and harness and says the most frightening words in tourism: “Is very safe.”',
    choices: [
      {
        id: 'zip',
        label: 'Clip in and go',
        effects: { money: -40, energy: -10, happiness: 12, adventure: 6 },
        result: 'You step off the platform and scream something you will later deny. Then the canyon opens up below, green and enormous, and the screaming turns into laughing.',
        duje: 'I’ve never done it. I’m Dalmatian. We don’t rush. Not even on wires.',
        tip: 'cetina-canyon',
        moment: { id: 'zipline', text: 'Screamed across the Cetina canyon on a zipline (denies it)', rank: 5 },
      },
      {
        id: 'zip-watch',
        label: 'Watch from a terrace with a cold drink',
        effects: { money: -4, energy: 5, happiness: 5 },
        result: 'From below, the zipliners look like brave, shrieking birds. You award points for screaming style. The winner yodels.',
        duje: 'Watching other people be brave is a perfectly respectable hobby.',
      },
    ],
  },
  {
    id: 'pirate-battle',
    slot: 'evening',
    where: ['omis'],
    weight: 3,
    title: 'The Pirates Are Back',
    story: (s) =>
      `On the riverbank, locals in costume are staging a pirate battle: wooden swords, a lot of shouting and one very committed man playing a Venetian officer. The crowd chooses sides by cheering.${
        s.flags.grandpa ? ' In the front row, the old man from the bench is booing the Venetians personally.' : ''
      }`,
    choices: [
      {
        id: 'cheer-pirates',
        label: 'Cheer for the pirates',
        effects: { happiness: 8, local: 2 },
        result: 'Of course you cheer for the pirates. Everybody in Omiš cheers for the pirates. The pirates win, as they apparently always do, and one of them gives you his wooden sword.',
        duje: 'Never cheer for Venice in Omiš. People have moved towns for less.',
        tip: 'omis-pirate-history',
      },
      {
        id: 'cheer-venice',
        label: 'Cheer for the Venetians, for balance',
        effects: { happiness: 6, adventure: 2 },
        flags: { teamVenice: '@day' },
        result: 'You are the only one. The whole crowd turns around. The actor playing the Venetian salutes you with tears in his eyes — nobody has ever cheered for him before. He buys you a drink afterwards.',
        duje: 'You made a grown man in tights cry with happiness. That’s a good evening.',
        moment: { id: 'venice', text: 'Was the only person in Omiš to cheer for the Venetians', rank: 5, headline: 'Team Venice' },
      },
    ],
  },

  // ───────────────────────── Krka
  {
    id: 'krka-swim',
    slot: 'day',
    where: ['krka'],
    weight: 3,
    title: 'Not That Kind of Waterfall',
    story:
      'Below the biggest waterfall, a man in swimming trunks is preparing to jump in, goggles on, right beside a sign with a crossed-out swimmer. A ranger is walking towards him at ranger speed.',
    choices: [
      {
        id: 'warn-swimmer',
        label: 'Point at the sign before the ranger arrives',
        effects: { happiness: 6, local: 1 },
        result: 'He reads the sign, laughs and puts his shirt back on. The ranger arrives, finds nothing to do, and thanks you. You feel like a deputy ranger.',
        duje: 'Swimming at the falls used to be allowed. Not any more. The waterfalls deserve a rest. So do the rangers.',
        tip: 'krka-no-swim',
      },
      {
        id: 'watch-swimmer',
        label: 'Watch what happens',
        effects: { happiness: 4, energy: 2 },
        result: 'The ranger reaches him one step before the jump. There is a short conversation, a lot of pointing at the sign, and a man walking back to his towel with the energy of a scolded Labrador.',
        duje: 'The sign has a crossed-out swimmer on it. It is not abstract art.',
        tip: 'krka-no-swim',
      },
    ],
  },
  {
    id: 'skradin-risotto',
    slot: 'evening',
    where: ['krka'],
    weight: 3,
    title: 'The Risotto That Takes All Day',
    story: 'In Skradin, by the river, a chalkboard says only: “Skradinski rižot — order in the morning.” It is evening. The waiter shrugs: “The risotto starts when the day starts. You are a little late. About ten hours.”',
    choices: [
      {
        id: 'eat-ready',
        label: 'Eat whatever is ready',
        effects: { money: -18, energy: 8, happiness: 7 },
        result: 'Grilled fish, chard, a jug of wine and a river view. Somewhere in the kitchen, a risotto ordered this morning is almost done. You can smell it. It is not yours.',
        duje: (s) => (s.flags.pekaOrdered ? 'Same lesson as the peka. You know this one already. Dalmatian food runs on patience.' : 'Same lesson as peka: Dalmatian food runs on patience. Yours, mostly.'),
        tip: 'skradin-risotto',
      },
      {
        id: 'beg-risotto',
        label: 'Ask whether anyone ordered too much',
        chance: {
          p: 0.4,
          success: {
            effects: { money: -15, happiness: 12, local: 2 },
            result: 'A family celebrating a christening ordered for twenty, and only fifteen came. You are handed a plate, a glass and, briefly, the baby.',
            moment: { id: 'christening', text: 'Crashed a christening in Skradin for the risotto (held the baby)', rank: 7 },
          },
          fail: { effects: { money: -15, happiness: 4 }, result: 'No spare risotto. The waiter brings you one spoonful “to taste”, which is somehow worse.' },
        },
        duje: 'Asking strangers for their risotto. Bold. It might work. It’s Dalmatia.',
        tip: 'skradin-risotto',
      },
    ],
  },

  // ───────────────────────── Hvar
  {
    id: 'hvar-yacht',
    slot: 'evening',
    where: ['hvar'],
    weight: 3,
    title: 'The Yacht Invitation',
    story:
      'In the harbour, a very tanned man on a very large yacht raises his glass at you. “You! Come aboard! We need one more person for… vibes.” Behind him: a DJ, a pool on a boat, and people who own several watches each.',
    choices: [
      {
        id: 'board-yacht',
        label: 'Go aboard',
        chance: {
          p: 0.5,
          success: { effects: { energy: -8, happiness: 10, adventure: 3 }, result: 'Champagne, a DJ, a sunset and a long conversation with a man who owns a football club somewhere you have never heard of. His business card is made of metal.' },
          fail: { effects: { money: -25, energy: -6, happiness: 2 }, result: 'It turns out “vibes” has an entry fee. And a minimum spend. You drink one very expensive water and leave with the dignity of a wet cat.' },
        },
        duje: 'On Hvar, nothing on a yacht is free. Not even the vibes.',
      },
      {
        id: 'backstreet-squid',
        label: 'Wave back, then go eat squid in a backstreet',
        effects: { money: -14, happiness: 7, local: 1 },
        result: 'In a backstreet konoba the squid is perfect, the wine is local and the yacht’s DJ is only a faint thump. You raise a glass to the yacht. The yacht does not notice.',
        duje: 'Backstreet squid beats yacht champagne. I have no data. I have a heart.',
        tip: 'photo-menus',
      },
    ],
  },
  {
    id: 'hvar-theatre',
    slot: 'day',
    where: ['hvar'],
    weight: 2,
    title: 'Four Hundred Years of Drama',
    story:
      'Above the old arsenal on Hvar’s main square is a theatre that has been entertaining the island for more than four centuries. Today a local school is rehearsing something with a lot of swords and one very confused donkey costume.',
    choices: [
      {
        id: 'watch-rehearsal',
        label: 'Slip in and watch',
        effects: { happiness: 8, local: 1 },
        result: 'Halfway through, the donkey loses its head. The teacher does not stop the scene. The audience of one (you) gives a standing ovation. The donkey bows.',
        duje: 'Four hundred years of theatre on Hvar and the donkey still steals the show.',
        tip: 'hvar-theatre',
        moment: { id: 'donkey', text: 'Gave a standing ovation to a headless donkey in a four-hundred-year-old theatre', rank: 4 },
      },
      {
        id: 'arsenal-steps',
        label: 'Sit on the steps outside and people-watch',
        effects: { happiness: 5, energy: 6 },
        result: 'From the steps you watch yachts, grandmothers, backpackers and one man walking a cat on a lead. Through the windows behind you, a donkey shouts its lines.',
        duje: 'The square is a theatre too. Free tickets. Strange actors.',
        tip: 'hvar-theatre',
      },
    ],
  },

  // ───────────────────────── Brač
  {
    id: 'white-house-stone',
    slot: 'day',
    where: ['brac'],
    weight: 3,
    title: 'The White House Question',
    story:
      'At a stone workshop, a man pats a block of white limestone. “Brač stone. Same as the White House in Washington.” His colleague nods. Everyone on the island nods. It is the most repeated sentence on Brač.',
    choices: [
      {
        id: 'believe-it',
        label: 'Believe every word',
        effects: { happiness: 6, local: 1 },
        result: 'You nod with deep respect. He gives you a small offcut “from the same quarry”. It now has pride of place in your pocket.',
        duje: 'Every person on Brač will tell you this. Historians are less sure. Brač people are completely sure. I know who I’d rather argue with.',
        tip: 'pucisca-stone',
      },
      {
        id: 'ask-proof',
        label: 'Ask politely for proof',
        effects: { happiness: 7, local: 2, adventure: 1 },
        result: 'He counts on his fingers: Diocletian’s Palace — absolutely, Brač stone. Churches and palaces all along the coast — yes. The White House? “Some of it. Maybe. Probably. Look, it’s a good story.” You like him more for admitting it.',
        duje: 'Fact: the palace in Split. Legend: Washington. Both: excellent for business.',
      },
    ],
  },

  // ───────────────────────── Dubrovnik
  {
    id: 'maskeron',
    slot: 'day',
    where: ['dubrovnik'],
    weight: 3,
    title: 'The Stone Head Challenge',
    story:
      'Near the Franciscan monastery, a small stone head sticks out of the wall just above the pavement. Tourists take turns trying to balance on it, facing the wall, while pulling their T-shirt off over their head. Almost everyone falls. A small crowd has gathered to enjoy this.',
    choices: [
      {
        id: 'try-maskeron',
        label: 'Try it',
        chance: {
          p: 0.15,
          success: {
            effects: { happiness: 12, adventure: 4 },
            result: 'You balance. You take the T-shirt off. You HOLD it. The crowd erupts. A local man shakes your hand and says he has seen this done three times in his life.',
            moment: { id: 'maskeron-win', text: 'Conquered Dubrovnik’s stone-head challenge (witnesses available)', rank: 9, headline: 'The Stone Head Miracle' },
          },
          fail: {
            effects: { happiness: 6, adventure: 2, energy: -4 },
            result: 'You step up, wobble, grab at the wall and slide off like a cat off a fridge. The crowd applauds anyway. Everyone falls. That’s the point.',
            moment: { id: 'maskeron-fail', text: 'Fell off the Dubrovnik stone head like a cat off a fridge', rank: 5 },
          },
        },
        duje: 'Nobody does it. My uncle says he did it in 1974. Nobody saw. Nobody believes him.',
        tip: 'maskeron',
      },
      {
        id: 'judge-maskeron',
        label: 'Watch and score the falls',
        effects: { happiness: 6, energy: 3 },
        result: 'You award a 9.0 to a grandfather in socks and sandals for an elegant slide and a 2.5 to a teenager for excessive drama. The crowd adopts your scoring system.',
        duje: 'A judge. Picigin training pays off.',
        tip: 'maskeron',
      },
    ],
  },
];

