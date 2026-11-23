/**
 * STORYLINES — multi-day threads (fiction). Each thread has a seed event and
 * one or more payoffs on a LATER day, so choices on day 1–3 come back on day 3–5.
 *
 *   Cousin Ante        ante-sunbeds → ante-taxi-boat → ante-souvenirs → ante-reveal (also: private boat, sunglasses stall)
 *   Brian (Hawaiian)   bus (day 1) / shirt-lost → shirt-fish → shirt-finale (day 5)
 *   Duje & Ivana       ivana-bakery (Split) → duje-plan → duje-date (day 5)
 *   Marija's container marija-posuda → posuda-return
 *   Boćanje            bocce-challenge → bocce-rematch (in another town)
 *   Pegica the dog     dalmatian-dog → dawn-fishing (+ the three-kilo fish)
 *   Sunglasses         sunglasses-sea → squint-photos (→ Ante)
 *   The goat           mirror "blame a goat" / rental car → real-goat
 *   The ham            village-festa (tombola) → prsut-problem → packing-panic (day 5)
 *   Luka               luka-guitar → luka-returns
 */
import { COAST, TOWNS, f, before, here } from '../world.js';

const lucky = (s, p) => Math.min(0.9, p + (s.flags.luckyToe ? 0.15 : 0));

export const STORYLINE_EVENTS = [
  // ───────────────────────── Cousin Ante: one man, every job on the coast
  {
    id: 'ante-sunbeds',
    slot: 'day',
    where: ['split', 'trogir', 'omis', 'hvar', 'brac'],
    when: (s) => !f(s, 'ante') && s.day <= 3,
    weight: 3,
    title: 'Special Price for Family',
    story:
      'A man with a clipboard, a gold chain and a tan like a well-oiled saddle strolls over. “Sunbed? I’m Ante. You’re Duje’s friend, no? Special price for family.” He has not asked your name. He already knows it.',
    choices: [
      {
        id: 'ante-special',
        rel: { ante: 1 },
        label: 'Take the “family price”',
        effects: { money: -18, energy: 10, happiness: 5 },
        flags: { ante: 1 },
        result: 'The family price turns out to be the normal price minus exactly one euro, plus a free lecture on why Hajduk will win the league. Ante shakes your hand like he’s closing a land deal.',
        duje: 'Ante is my cousin. Ante is everybody’s cousin. You’ll see him again. Everyone sees Ante again.',
      },
      {
        id: 'ante-towel',
        label: 'Say you brought a towel',
        effects: { energy: 3, happiness: 4, local: 1 },
        flags: { ante: 1 },
        result: 'Ante nods slowly, respects it, and gives you his card anyway: “ANTE — Sunbeds · Boats · Transfers · Souvenirs · Other.” The card is laminated. It has seen things.',
        duje: '“Other.” Don’t ask what “Other” is. I asked once. I was given a fish.',
        tip: 'public-beaches',
      },
    ],
  },
  {
    id: 'ante-taxi-boat',
    kind: 'callback',
    slot: 'day',
    where: ['trogir', 'hvar', 'brac', 'dubrovnik'],
    when: (s) => f(s, 'ante') >= 1 && !s.flags.anteBoat && !s.flags.anteReveal,
    weight: 8,
    title: 'Same Ante, Different Boat',
    story:
      'A taxi-boat skipper waves at you from the harbour. The gold chain is familiar. It’s Ante. Last time: sunbeds. Today: captain. “Secret cove? Very good price. We discuss the price after.”',
    choices: [
      {
        id: 'ante-agree',
        rel: { ante: 1, duje: 1 },
        label: 'Agree the price and the pick-up first',
        effects: { money: -20, energy: -4, happiness: 10, adventure: 3, local: 1 },
        flags: { ante: 1, anteBoat: true, hidden: 1 },
        result: 'You agree the price, the cove and the pick-up. Ante looks almost proud. The cove is perfect, and at exactly the agreed moment his boat appears around the rocks, horn playing a Hajduk chant.',
        duje: 'You negotiated with Ante and won. I have never won. My mother has never won.',
        tip: 'boat-price',
      },
      {
        id: 'ante-after',
        rel: { ante: 1 },
        label: 'Hop in and “discuss after”',
        effects: { money: -45, energy: -4, happiness: 7, adventure: 3 },
        flags: { ante: 1, anteBoat: true },
        result: 'The cove is lovely. Then “after” arrives. The price includes fuel, the view, the wind and “emotional value”. You pay. Ante gives you a lemon as a gift.',
        duje: '“We discuss after.” The three most expensive words on the Adriatic.',
        tip: 'boat-price',
        moment: { id: 'ante-after', text: 'Paid Ante for a boat ride that included “emotional value”', rank: 6, headline: 'The Emotional Value Incident' },
      },
      {
        id: 'ante-swim',
        rel: { ante: -1 },
        label: 'Decline and swim from the town beach',
        effects: { energy: 4, happiness: 4 },
        flags: { ante: 1, anteBoat: true },
        result: 'Ante shrugs and sells the same trip to a family of five in eleven seconds. You swim. He waves every time he passes. He passes a lot.',
        duje: 'Ante doesn’t lose customers. He reallocates them.',
      },
    ],
  },
  {
    id: 'ante-souvenirs',
    kind: 'callback',
    slot: 'evening',
    where: TOWNS,
    when: (s) => f(s, 'ante') >= 1 && !s.flags.anteShop && !s.flags.anteReveal,
    weight: 7,
    title: 'Ante’s Authentic Souvenirs',
    story:
      'Tonight, behind a stall of “hand-carved Brač stone”, stands a familiar gold chain. Ante. “Original! Handmade! By hand!” A small sticker under a stone dolphin politely disagrees.',
    choices: [
      {
        id: 'ante-dolphin',
        rel: { ante: 1 },
        label: 'Buy the dolphin anyway (for Ante)',
        effects: { money: -15, happiness: 5 },
        flags: { ante: 1, anteShop: true, anteDolphin: true },
        result: 'You buy the dolphin. Ante wraps it in yesterday’s newspaper and adds a magnet “free, because family”. The magnet also has a sticker.',
        duje: 'You bought an imported dolphin from my cousin. He will mention you at Christmas.',
        moment: { id: 'dolphin', text: 'Bought a “hand-carved” stone dolphin from Ante (sticker included)', rank: 5, headline: 'The Dolphin With a Sticker' },
      },
      {
        id: 'ante-real',
        rel: { ante: 1 },
        label: 'Ask him where the REAL stone comes from',
        effects: { happiness: 6, local: 2 },
        flags: { ante: 1, anteShop: true },
        result: 'Ante sighs, lowers his voice and tells you about the stonemasons of Pučišća on Brač. “Don’t tell anyone I sent you. Bad for business.” He gives you the dolphin for free, out of embarrassment.',
        duje: 'Ante sent you to the competition. That’s the nicest thing he has ever done. I need to sit down.',
        tip: 'pucisca-stone',
      },
    ],
  },
  {
    id: 'ante-reveal',
    kind: 'callback',
    priority: true,
    where: ['any'],
    when: (s) => (s.rel?.ante ?? 0) >= 2 && s.day >= 3 && !s.flags.anteReveal,
    weight: 6,
    title: 'The Ante Network',
    story:
      'A van pulls up beside you. Ante again, now driving “transfers”, in a new shirt with the same chain. He turns the radio down. “Sunbeds, boat, souvenirs, transfer… You are a good customer. Tonight I show you something. Family only.”',
    choices: [
      {
        id: 'ante-family',
        rel: { ante: 2 },
        label: 'Accept: “family only”',
        effects: { energy: -4, happiness: 12, adventure: 3, local: 3 },
        flags: { anteReveal: true, hidden: 1, adopted: 1, konoba: 1 },
        result: 'Ante drives you to a konoba with no sign on a rocky point, introduces you to his mother (who is also Duje’s aunt) and refuses to let you pay for anything. On the wall hangs a photo of Ante, aged six, already selling something.',
        duje: 'So now you know. Half the coast is Ante. The other half owes him money.',
        moment: { id: 'ante-empire', text: 'Was welcomed into the Ante Empire (sunbeds, boats, souvenirs, transfers, mother)', rank: 9, headline: 'The Ante Empire' },
      },
      {
        id: 'ante-refund',
        label: 'Ask for the “family price” on everything so far',
        chance: {
          p: 0.5,
          success: { effects: { money: 25, happiness: 6, local: 1 }, result: 'Ante laughs so hard he stalls the van. Then he hands you back some money “for your honesty” and calls you a businessman. From Ante, that is a knighthood.' },
          fail: { effects: { happiness: 3, adventure: 2 }, result: 'Ante laughs, says “nice try”, and offers you a business card for his cousin, who is a lawyer, who is also Ante.' },
        },
        duje: 'Asking Ante for money back. You are braver than the Romans.',
      },
    ],
  },

  // ───────────────────────── Brian, the man in the Hawaiian shirt
  {
    id: 'shirt-lost',
    slot: 'day',
    where: ['trogir', 'omis', 'krka', 'hvar', 'brac'],
    when: (s) => s.flags.shirtMet === undefined && s.day <= 4,
    weight: 3,
    title: 'The Man in the Hawaiian Shirt',
    story: (s) => {
      const who = f(s, 'shirt') ? 'It’s the man in the Hawaiian shirt from the airport bus — the one who paid double.' : 'A man in a loud Hawaiian shirt is studying a map with great confidence.';
      const problem = {
        trogir: 'He is looking for “the big walls from Game of Thrones”. He is in Trogir. The big walls are in Dubrovnik.',
        omis: 'He is asking everyone where the “pirate show” starts. It is a Tuesday. There is no pirate show.',
        krka: 'He has walked the boardwalk loop four times, looking for the exit. The exit has seen him go past four times.',
        hvar: 'He is looking for Zlatni rat. Zlatni rat is on Brač. He is on Hvar.',
        brac: 'He is looking for the lavender fields. He believes he is on Hvar. He is on Brač.',
      }[s.location] ?? 'He is looking for a beach that is, according to his map, in the sea.';
      return `${who} ${problem} He looks at you with hope.`;
    },
    choices: [
      {
        id: 'shirt-help',
        rel: { brian: 1 },
        label: 'Gently explain where he is',
        effects: { happiness: 7, local: 1 },
        flags: { shirt: 1, shirtMet: '@day', shirtHelped: 1 },
        result: 'He looks at the map, at you, at the sea. Then he laughs, a big honest laugh, and introduces himself: Brian. He shakes your hand for an uncomfortably long time and calls you “my guy”.',
        duje: 'You adopted a tourist. That’s how it starts. Next you’ll be explaining the kuver to strangers.',
      },
      {
        id: 'shirt-film',
        rel: { brian: -1 },
        label: 'Let him work it out (and film it)',
        effects: { happiness: 5, adventure: 1 },
        flags: { shirt: 1, shirtMet: '@day', shirtFilmed: true },
        result: 'Forty minutes later he works it out, takes it remarkably well and buys an ice cream. Your video has a lot of potential. You feel slightly bad. Slightly.',
        duje: 'Cruel. Funny, but cruel. My mother would not approve. My mother would watch it twice.',
      },
    ],
  },
  {
    id: 'shirt-fish',
    kind: 'callback',
    priority: true,
    slot: 'evening',
    where: ['split', 'trogir', 'omis', 'hvar', 'brac', 'dubrovnik'],
    when: (s) => s.flags.shirtMet !== undefined && !s.flags.shirtFish && s.day < 5,
    weight: 5,
    title: 'Brian Meets the Fish Tray',
    story: (s) =>
      s.flags.bigFish
        ? 'At the next table: Brian. The waiter is presenting the silver tray, and Brian is pointing at the biggest fish. You know that look. You WERE that look.'
        : 'At the next table: Brian, pointing at the biggest fish on the waiter’s silver tray. The menu says “per kg”. He hasn’t read the menu. He has never read a menu.',
    choices: [
      {
        id: 'brian-warn',
        rel: { brian: 1 },
        label: 'Lean over: “Ask the weight first”',
        effects: { happiness: 6, local: 1 },
        flags: { shirtFish: true, shirtHelped: 1 },
        result: 'Brian asks. The waiter names a weight and a total. Brian goes pale, orders the sardines and sends you a glass of wine. “You saved my holiday,” he says. He calls you his holiday mentor for the rest of the evening.',
        duje: 'Passing on the wisdom. Teacher of tourists. I’m emotional.',
        tip: 'fish-per-kilo',
      },
      {
        id: 'brian-watch',
        label: 'Say nothing. Witness history.',
        effects: { happiness: 8, adventure: 1 },
        flags: { shirtFish: true, brianFish: true },
        result: (s) =>
          s.flags.bigFish
            ? 'His fish is bigger than yours was. His bill is bigger than yours was. Along the coast, the waiters update the legend: there is a new three-kilo tourist. You feel relief, and a strange kind of grief.'
            : 'The fish arrives on two plates. The bill arrives in an envelope. Brian photographs it “for insurance”.',
        duje: (s) => (s.flags.bigFish ? 'You have been dethroned. Long live the new fish king. He’s crying a little.' : 'The fish tray claims another one. Respect the tray.'),
        moment: { id: 'brian-fish', text: 'Watched Brian in the Hawaiian shirt order a fish bigger than any fish should be', rank: 6, headline: 'Brian and the Fish' },
      },
    ],
  },
  {
    id: 'shirt-finale',
    kind: 'callback',
    priority: true,
    where: ['any'],
    when: (s) => s.day >= 4 && before(s, 'shirtMet') && Boolean(s.flags.shirtFish),
    weight: 6,
    title: 'The Student Becomes the Teacher',
    story: (s) =>
      `In ${here(s)}, a familiar voice is explaining Croatian etiquette to a group of new arrivals. It’s Brian, in a NEW Hawaiian shirt. This one has little fish on it.`,
    choices: [
      {
        id: 'brian-goodbye',
        label: 'Go and say goodbye',
        effects: { happiness: 11, local: 1 },
        flags: { brianShirt: true },
        result: (s) =>
          f(s, 'shirtHelped') >= 1
            ? '“THAT’S MY MENTOR!” Brian shouts, and tells the group how you saved him from the fish and the wrong town. They applaud. He gives you the fish shirt off his back. Literally. He’s wearing another one underneath.'
            : 'Brian tells the group about “the person who filmed me getting lost”. They laugh, he laughs: the video made him famous at home. He thanks you, sincerely, and gives you his shirt anyway.',
        duje: 'You came to Croatia and left with a Hawaiian shirt and a pen pal. Normal holiday.',
        moment: { id: 'brian-shirt', text: 'Was given a Hawaiian shirt by Brian, a tourist you met while he was lost', rank: 8, headline: 'The Hawaiian Shirt Inheritance' },
      },
      {
        id: 'brian-listen',
        label: 'Hide behind a pillar and listen',
        effects: { happiness: 6, energy: 4 },
        result: (s) => {
          const advice = ['“Ask the weight of the fish before it goes on the grill',
            s.flags.busPro && 'buy your bus ticket before you board',
            f(s, 'ante') && 'and never trust a sunbed man called Ante',
            !f(s, 'ante') && 'and never, ever walk into a town square without greeting the grandmothers on the bench'].filter(Boolean).join(', ');
          return `From behind a column you hear him: ${advice}.” ${f(s, 'shirtHelped') >= 1 ? 'He learned everything. Some of it from you.' : 'He learned everything. None of it from you, but quite a lot of it about you.'}`;
        },
        duje: (s) => (f(s, 'shirtHelped') >= 1 ? 'He’s quoting you. And me. Mostly me.' : 'You filmed him and he still turned into a tour guide. Brian is unstoppable.'),
      },
    ],
  },

  // ───────────────────────── Duje & Ivana from the bakery
  {
    id: 'ivana-bakery',
    slot: 'day',
    where: ['split'],
    when: (s) => s.day <= 2 && !s.flags.ivana,
    weight: 4,
    title: 'Duje Has a Problem',
    story:
      'Duje takes you to “the best bakery in Split”. At the counter, Ivana smiles at him. Duje, a man with an opinion on every subject in the world, forgets every word he knows and orders six bureks. He does not want six bureks.',
    choices: [
      {
        id: 'wingman',
        rel: { duje: 1 },
        label: 'Tell Ivana that Duje talks about her bakery a lot',
        effects: { happiness: 8, local: 1 },
        flags: { ivana: true, wingman: true },
        result: 'Ivana laughs. “Does he? He comes every morning. Every. Morning.” Duje turns the colour of a ripe tomato. Outside, he makes you swear never to do that again, then asks what you think she meant.',
        duje: 'I will never forgive you. What do you think she meant? Be honest. No, lie. No, be honest.',
        tip: 'pekara',
        moment: { id: 'wingman', text: 'Became Duje’s wingman at a bakery (he has not forgiven you)', rank: 4 },
      },
      {
        id: 'six-bureks',
        label: 'Help him eat six bureks',
        effects: { money: -3, energy: 10, happiness: 5 },
        flags: { ivana: true },
        result: 'You eat three bureks each on a bench by the Riva. Duje stares at the bakery door the entire time. “Tomorrow,” he says. He has been saying “tomorrow” since 2019.',
        duje: 'Six bureks is a normal amount. For a small family. Or one sad man.',
        tip: 'pekara',
      },
      {
        id: 'tease',
        rel: { duje: -1 },
        label: 'Tease Duje about it all day',
        effects: { happiness: 7 },
        flags: { ivana: true, ivanaTease: true },
        result: 'You hum wedding songs every time he mentions bread. By evening he has stopped mentioning bread. He is very hungry.',
        duje: 'Laugh, laugh. One day you’ll fall for a baker and I will hum.',
      },
    ],
  },
  {
    id: 'duje-plan',
    kind: 'callback',
    priority: true,
    slot: 'evening',
    where: ['any'],
    when: (s) => s.flags.wingman && !s.flags.dujePlan && s.day >= 2 && s.day <= 4,
    weight: 8,
    title: 'Duje Needs Advice',
    story:
      'Your phone buzzes late at night. Duje: “Hypothetically. If a man wanted to ask a baker to coffee. Hypothetically. How?” Then: “Asking for a cousin.” Then: “The cousin is me.”',
    choices: [
      {
        id: 'plan-coffee',
        label: '“Just ask her to coffee. It’s Split.”',
        effects: { happiness: 5, local: 1 },
        flags: { dujePlan: 'coffee' },
        result: 'Three dots appear and disappear eleven times. Then: “Coffee. Yes. Simple. Dalmatian. Why didn’t I think of that.” He thought of it in 2019.',
        duje: 'Coffee. Of course. I’ve only been preparing for five years.',
        tip: 'kava-ritual',
      },
      {
        id: 'plan-picigin',
        label: '“Invite her to picigin. Show off your dives.”',
        effects: { happiness: 6, adventure: 1 },
        flags: { dujePlan: 'picigin' },
        result: '“My dives are excellent,” Duje replies instantly. “Everyone says so. My mother says so.” He sends a video of a dive from 2014 as proof. It is… a dive.',
        duje: 'Picigin is how Split people show love. And dominance.',
      },
      {
        id: 'plan-song',
        label: '“Serenade her under the bakery window.”',
        effects: { happiness: 7 },
        flags: { dujePlan: 'song' },
        result: '“A serenade,” Duje types. “Bold. Romantic. Possibly a problem with the neighbours.” He’s in. He’s already practising. You can hear it from here.',
        duje: 'If this goes wrong I’m moving to Zagreb. Kidding. I would never move to Zagreb.',
      },
    ],
  },
  {
    id: 'duje-date',
    kind: 'callback',
    priority: true,
    slot: 'day',
    where: ['any'],
    when: (s) => s.day === 5 && Boolean(s.flags.dujePlan),
    weight: 10,
    title: 'Did It Work?',
    story: (s) => {
      const intro = s.location === 'split' ? 'Your last afternoon. Duje walks up to your café table' : `Your last afternoon, in ${here(s)}. Your phone buzzes: a video call from Duje, who is standing`;
      return {
        coffee: `${intro} glowing like a lighthouse. Next to him: Ivana from the bakery, holding two coffees.`,
        picigin: `${intro} soaking wet, a scrape on one knee and a grin on his face. Next to him, laughing: Ivana from the bakery.`,
        song: `${intro} with a borrowed guitar and a very complicated expression. Behind him, slightly embarrassed and clearly delighted: Ivana from the bakery.`,
      }[s.flags.dujePlan ?? 'coffee'];
    },
    choices: [
      {
        id: 'toast-duje',
        rel: { duje: 2 },
        label: 'Raise a glass to Duje',
        effects: { happiness: 12, local: 2 },
        flags: { dujeDate: true },
        result: (s) =>
          ({
            coffee: 'It worked. One coffee became three hours, which in Split means it is serious. Ivana tells you he practised the question on her cat. Duje denies everything. Duje is lying.',
            picigin: 'His dive missed the ball by a metre and hit a pensioner’s inflatable crocodile. Ivana laughed so much she agreed to dinner. “It was a strategic dive,” says Duje.',
            song: 'The neighbours threw water. Then they threw flowers. Then a grandmother shouted “just kiss her already!” from a balcony. Ivana said yes to dinner, mostly so he’d stop singing.',
          })[s.flags.dujePlan ?? 'coffee'],
        duje: 'I owe you. I will deny this in public. But I owe you. My mother says thank you. My mother already wants grandchildren.',
        moment: { id: 'duje-date', text: 'Got Duje a date with Ivana from the bakery', rank: 10, headline: 'Duje’s Love Story' },
      },
      {
        id: 'leave-them',
        rel: { duje: 2 },
        label: 'Find an urgent reason to look at the sea, far away',
        effects: { happiness: 10, local: 1 },
        flags: { dujeDate: true },
        result: 'You discover a sudden need to study the horizon. From a distance you see Duje talking with his hands, Ivana laughing, and six bureks on the table between them. Some things never change.',
        duje: 'You left at exactly the right moment. You have the timing of a Dalmatian aunt. That’s the highest compliment I know.',
        moment: { id: 'duje-date-left', text: 'Left Duje and Ivana alone at exactly the right moment', rank: 9, headline: 'Duje’s Love Story' },
      },
    ],
  },

  // ───────────────────────── Marija's container (apartment base)
  {
    id: 'marija-posuda',
    slot: 'evening',
    where: ['any'],
    when: (s) => s.flags.marija && s.day <= 3 && !s.flags.posuda,
    weight: 5,
    title: 'Marija’s Container',
    story:
      'Marija knocks with a warm container of stuffed peppers. “For you. You are too thin. And bring back the container.” She says the last part looking deep into your soul.',
    choices: [
      {
        id: 'eat-peppers',
        promise: 'container',
        label: 'Eat everything immediately',
        effects: { energy: 12, happiness: 7 },
        flags: { posuda: '@day' },
        result: 'The peppers are extraordinary. The container is now in your bag. You have accepted a sacred responsibility without reading the terms and conditions.',
        duje: 'The container. Never lose the container. I lost one in 2011. My mother still brings it up.',
      },
      {
        id: 'share-peppers',
        promise: 'container',
        rel: { marija: 1 },
        label: 'Share them with the neighbours on the stairs',
        effects: { happiness: 8, local: 2 },
        flags: { posuda: '@day' },
        result: 'You share the peppers with a fisherman, two students and a cat. By midnight you know the whole building, and the container has been licked clean. By the cat.',
        duje: 'Marija will hear you shared her peppers. She’ll be proud. She’ll still want the container.',
      },
    ],
  },
  {
    id: 'posuda-return',
    kind: 'callback',
    priority: true,
    where: ['any'],
    when: (s) => before(s, 'posuda') && !s.flags.posudaDone,
    weight: 8,
    title: 'Where Is the Container?',
    story: (s) =>
      `A message from Marija: “Hello dear, just checking 🙂 How is the container? 🙂” Two smiley faces. You know what two smiley faces mean. ${
        s.location === 'split' ? 'The container is somewhere in your room. Probably.' : `The container is in your bag, in ${here(s)}, smelling faintly of peppers and guilt.`
      }`,
    choices: [
      {
        id: 'posuda-full',
        keep: 'container',
        rel: { marija: 2 },
        label: 'Return it full of something sweet',
        effects: { money: -10, happiness: 9, local: 3 },
        flags: { posudaDone: true, adopted: 1 },
        result: 'You fill it with fritule from a bakery and give it back. Marija opens it, gasps, and hugs you like a soldier home from war. “You understand,” she whispers. You do now.',
        duje: 'You returned it full. You don’t need me any more. I’m so proud I could cry. I won’t. I’m Dalmatian. I will a little.',
        tip: 'posuda',
        moment: { id: 'posuda-full', text: 'Returned Marija’s container full, as tradition demands', rank: 7 },
      },
      {
        id: 'posuda-empty',
        keep: 'container',
        label: 'Wash it carefully and return it empty',
        effects: { happiness: 2, local: 1 },
        flags: { posudaDone: true },
        result: 'Marija takes the clean, empty container, smiles politely and says “thank you”. It is the coldest “thank you” you have ever heard. Then she gives you more peppers, in a new container. The cycle continues.',
        duje: 'Empty. Clean, but empty. She will forgive you by Christmas. Maybe Easter.',
        tip: 'posuda',
      },
      {
        id: 'posuda-lost',
        breaks: 'container',
        rel: { marija: -1 },
        label: 'Confess you lost it',
        effects: { happiness: -3, local: 1 },
        flags: { posudaDone: true },
        result: 'Silence. Then Marija laughs, waves a hand and says it was an old one anyway. Then she tells the whole building. Then the whole street. You are now “the one who lost the container”.',
        duje: 'Not the fish. Not the goat. The container. This is the one that will follow you.',
        tip: 'posuda',
        moment: { id: 'posuda-lost', text: 'Lost Marija’s container (the whole street knows)', rank: 7, headline: 'The Container Affair' },
      },
    ],
  },

  // ───────────────────────── Boćanje
  {
    id: 'bocce-challenge',
    slot: 'day',
    where: ['split', 'trogir', 'omis', 'hvar', 'brac'],
    when: (s) => s.day <= 3 && !s.flags.bocce,
    weight: 2,
    title: 'One Player Short',
    story:
      'Under a pine tree, four elderly men are playing boće on a gravel court. Well, three. The fourth went home for lunch “for five minutes” an hour ago. They look at you. They look at your shoes. They decide you’ll do.',
    choices: [
      {
        id: 'bocce-play',
        promise: 'bocce',
        label: 'Play (and try not to embarrass them)',
        chance: {
          p: (s) => lucky(s, s.flags.phrases ? 0.5 : 0.35),
          success: {
            effects: { happiness: 11, local: 3, adventure: 2 },
            flags: { bocce: '@day', bocceWin: true, boccePlace: '@here' },
            result: 'Your last ball rolls, slows, and kisses the jack. Silence. Then all three men shout at once, not at you but at each other, about who taught you. You are invited back. “Tomorrow. Same tree.”',
            moment: { id: 'bocce-win', text: 'Beat three Dalmatian pensioners at boće (they blame each other)', rank: 7, headline: 'The Boće Upset' },
          },
          fail: {
            effects: { happiness: 6, local: 2 },
            flags: { bocce: '@day', boccePlace: '@here' },
            result: 'Your first ball hits a tree, your second hits a dog’s water bowl, and your third is excellent but nobody is watching. They adopt you anyway, as a mascot.',
            moment: { id: 'bocce-bowl', text: 'Hit a dog’s water bowl during a game of boće', rank: 5 },
          },
        },
        duje: 'Boće is not a sport. It’s a parliament with balls. The arguing is the main event.',
        tip: 'bocanje',
      },
      {
        id: 'bocce-referee',
        promise: 'bocce',
        label: 'Offer to be the referee',
        effects: { happiness: 7, local: 2 },
        flags: { bocce: '@day', referee: true, boccePlace: '@here' },
        result: 'Every throw needs a measurement, and every measurement needs a debate. A man produces a tape measure from his sock. You rule in favour of the oldest player and are praised for your wisdom.',
        duje: 'Ruling for the oldest. Wise. You’d make a good judge in Split. Or a diplomat. Same job here.',
        tip: 'bocanje',
      },
    ],
  },
  {
    id: 'bocce-rematch',
    kind: 'callback',
    priority: true,
    slot: 'day',
    where: ['any'],
    when: (s) => before(s, 'bocce') && !s.flags.bocceDone,
    weight: 6,
    title: 'The Boćari Network',
    story: (s) =>
      `By a gravel court in ${here(s)}, an old man squints at you. “You! My brother-in-law told me about you. ${
        s.flags.bocceWin ? 'The one who beat Stipe.' : s.flags.referee ? 'The referee. The fair one.' : 'The one who hit the dog bowl.'
      }” The boćari network is faster than the internet.`,
    choices: [
      {
        id: 'bocce-match',
        keep: 'bocce',
        label: 'Accept the “international match”',
        effects: { energy: -6, happiness: 10, local: 3, adventure: 2 },
        flags: { bocceDone: true, adopted: 1 },
        result: 'The match lasts the afternoon. The result is disputed. The dispute lasts the evening. You are toasted, photographed and added to a WhatsApp group called “BOĆE 🔥”.',
        duje: 'You’re in a boće WhatsApp group. I’ve been trying to get into that group for years.',
        moment: { id: 'bocce-intl', text: 'Played an “international” boće match (the result is still disputed)', rank: 7, headline: 'The Disputed Boće Match' },
      },
      {
        id: 'bocce-heckle',
        keep: 'bocce',
        label: 'Watch with a coffee and heckle gently',
        effects: { happiness: 7, energy: 6, local: 2 },
        flags: { bocceDone: true, phrases: 1 },
        result: 'You shout “Ajme!” at all the right moments. The men approve. Heckling is half the game; the other half is pretending not to hear the heckling.',
        duje: '“Ajme” at the right moment is worth ten points in any Dalmatian conversation.',
      },
    ],
  },

  // ───────────────────────── Pegica, the Dalmatian in Dalmatia
  {
    id: 'dalmatian-dog',
    slot: 'day',
    where: COAST,
    when: (s) => s.day <= 4 && !s.flags.dog,
    weight: 2,
    title: 'A Dalmatian in Dalmatia',
    story:
      'A spotted dog falls into step beside you. It is, unmistakably, a Dalmatian. In Dalmatia. It looks at you as if this were all completely normal and it would like you to follow.',
    choices: [
      {
        id: 'follow-dog',
        promise: 'fishing',
        label: 'Follow the dog',
        effects: { energy: -5, happiness: 9, local: 2, adventure: 2 },
        flags: { dog: '@day', dogFriend: true },
        result: 'The dog leads you through three alleys to a fishing boat, where an old fisherman shouts “Pegica! Again?!” (Spotty). He thanks you with a bag of sardines and an invitation: “Tomorrow, dawn. We fish.”',
        duje: 'A Dalmatian dog led you to a Dalmatian fisherman. That’s the most Dalmatian sentence I’ve ever said.',
        tip: 'dalmatian-dog',
        moment: { id: 'pegica', text: 'Was led to a fisherman by a Dalmatian dog called Pegica', rank: 5 },
      },
      {
        id: 'photo-dog',
        label: 'Take forty photos and keep walking',
        effects: { happiness: 6, energy: 2 },
        flags: { dog: '@day' },
        result: 'Pegica poses like a professional, then trots off to her real job, which seems to be supervising the fish market. Your photos get more likes than the rest of your holiday combined.',
        duje: 'The dog has a better Instagram than you now. Accept it.',
        tip: 'dalmatian-dog',
      },
    ],
  },
  {
    id: 'dawn-fishing',
    kind: 'callback',
    priority: true,
    slot: 'day',
    where: COAST,
    when: (s) => s.flags.dogFriend && before(s, 'dog') && !s.flags.fished,
    weight: 8,
    title: 'Out on the Boat With Pegica',
    story:
      'Remember the fisherman with the Dalmatian? He meant it. Your phone buzzes: “Tomorrow we fish at dawn — so today you come and learn the nets. Boat. Now. Pegica is waiting.” Dalmatian fishermen don’t accept “no”, and neither do their dogs.',
    choices: [
      {
        id: 'go-fishing',
        keep: 'fishing',
        label: 'Get up and go',
        effects: { energy: -8, happiness: 13, adventure: 4, local: 3 },
        flags: { fished: true, konoba: 1 },
        result: (s) =>
          s.flags.bigFish
            ? 'You catch a fish. It is small. He grills it on the boat with olive oil and salt, and it is better than the three-kilo fish that wrecked your budget. It cost nothing. You learn something about life.'
            : 'Nets, coffee from a flask, a sea like glass, and Pegica standing on the bow like a figurehead. You catch one small fish. It is grilled on the boat and it is the best thing you have ever eaten.',
        duje: 'You went fishing. Voluntarily. With a dog. Who ARE you?',
        tip: 'blitva',
        moment: { id: 'fishing', text: 'Went fishing with an old fisherman and his Dalmatian, Pegica', rank: 8, headline: 'Out Fishing With Pegica' },
      },
      {
        id: 'snooze',
        breaks: 'fishing',
        label: 'Stay on your sunbed',
        effects: { energy: 12, happiness: 1 },
        flags: { fished: true },
        result: 'You stay on your sunbed. Later you receive a photo: the fisherman, the dog and a bucket of fish, all looking slightly disappointed in you.',
        duje: 'The dog is disappointed. The fish are relieved.',
      },
    ],
  },

  // ───────────────────────── Sunglasses → squinting → Ante
  {
    id: 'sunglasses-sea',
    slot: 'day',
    where: COAST,
    when: (s) => s.day <= 4 && !s.flags.sunglasses,
    weight: 2,
    title: 'Plop',
    story:
      'You lean over the harbour wall to look at a fish. Your sunglasses lean further. Plop. Through the clear water you can see them three metres down, resting on a rock like a tiny tourist.',
    choices: [
      {
        id: 'kid-diver',
        label: 'Accept a local kid’s offer: one ice cream, one dive',
        effects: { money: -3, happiness: 8, local: 1 },
        flags: { sunglasses: true },
        result: 'A ten-year-old dives, comes up with your sunglasses AND someone else’s watch, and negotiates a second ice cream for the watch. She will run this town one day.',
        duje: 'That kid will be mayor. Or Ante’s business partner.',
      },
      {
        id: 'dive-self',
        label: 'Dive in yourself, fully clothed',
        chance: {
          p: (s) => lucky(s, 0.5),
          success: { effects: { happiness: 9, adventure: 3 }, flags: { sunglasses: true }, result: 'You dive, grab them and surface like a triumphant seal. A small crowd applauds. Your shorts dry in only four hours.' },
          fail: {
            effects: { energy: -8, happiness: 2, adventure: 2 },
            flags: { sunglasses: true, noSunglasses: '@day' },
            result: 'You dive, miss, dive again, and come up with a sea cucumber, a bottle cap and no sunglasses. The crowd applauds anyway.',
          },
        },
        duje: 'Diving in your clothes. People do that at weddings here, so you’re in good company.',
      },
      {
        id: 'let-go',
        label: 'Let the sea keep them',
        effects: { happiness: -2, energy: 3 },
        flags: { sunglasses: true, noSunglasses: '@day' },
        result: 'Goodbye, sunglasses. You squint at the sun. The sun squints back. This will be a long holiday.',
        duje: 'Squinting for the rest of the week. In every photo you’ll look like you’re doing maths.',
      },
    ],
  },
  {
    id: 'squint-photos',
    kind: 'callback',
    priority: true,
    slot: 'day',
    where: ['any'],
    when: (s) => before(s, 'noSunglasses') && !s.flags.squintDone,
    weight: 6,
    title: 'Squint Mode',
    story: 'Without sunglasses, the Dalmatian sun is a searchlight. In every photo since yesterday you look like you’re trying to remember a password.',
    choices: [
      {
        id: 'stall-glasses',
        rel: { ante: 1 },
        label: 'Buy sunglasses at the first stall',
        effects: { money: -12, happiness: 5 },
        flags: { squintDone: true, ante: 1 },
        result: (s) =>
          f(s, 'ante')
            ? 'The stall belongs to Ante. Of course it does. “Family price.” One lens is slightly darker than the other. You now look permanently surprised from the left.'
            : 'The stallholder introduces himself: Ante. “Sunglasses, sunbeds, boats, transfers. Anything.” He gives you a laminated card. The glasses are fine. Mostly.',
        duje: 'Ante sells sunglasses too? Of course he does. He’d sell the sun if he could find the paperwork.',
      },
      {
        id: 'embrace-squint',
        label: 'Embrace the squint',
        effects: { happiness: 3, adventure: 1 },
        flags: { squintDone: true },
        result: 'You commit. By evening the squint has become a look. An Italian couple asks whether you’re a film director.',
        duje: 'The squint of a film director. Or of a man reading the kuver.',
        moment: { id: 'squint', text: 'Squinted through the whole holiday after donating sunglasses to the Adriatic', rank: 5, headline: 'The Great Squint' },
      },
    ],
  },

  // ───────────────────────── The goat
  {
    id: 'real-goat',
    slot: 'day',
    where: ['omis', 'krka', 'hvar', 'brac'],
    when: (s) => (s.flags.car || s.flags.goatExcuse) && !s.flags.realGoat,
    weight: 5,
    title: 'An Actual Goat',
    story: (s) =>
      s.flags.goatExcuse
        ? 'On a narrow road: a goat. An actual goat, standing on a stone wall, chewing slowly and staring at you. After all those lies, here is the truth. You reach for your phone.'
        : 'A goat is standing in the middle of the road, chewing, unbothered by your rental car, your horn or your existence. It has right of way. It has always had right of way.',
    choices: [
      {
        id: 'goat-evidence',
        label: (s) => (s.flags.goatExcuse ? 'Photograph it and send it to the rental company' : 'Wait patiently for the goat'),
        effects: { happiness: 8, adventure: 2, local: 1 },
        flags: { realGoat: true },
        result: (s) =>
          s.flags.goatExcuse
            ? 'The rental company replies within a minute: “Very nice goat. Invoice stands. This is goat photo number twelve this month.” But you know the truth. The goat knows.'
            : 'Eleven minutes later the goat finishes its thoughts and steps aside. A farmer in the field raises his hat, as if you have passed an exam.',
        duje: (s) => (s.flags.goatExcuse ? 'Evidence after the crime. A classic.' : 'In Dalmatia, goats have right of way. And opinions.'),
        moment: { id: 'real-goat', text: 'Finally met an actual goat on the road (it had right of way)', rank: 4 },
      },
      {
        id: 'goat-honk',
        label: 'Honk',
        chance: {
          p: 0.3,
          success: { effects: { happiness: 3, energy: 2 }, flags: { realGoat: true }, result: 'The goat moves. Slowly. Insultingly slowly. It looks back once, to make sure you understood.' },
          fail: {
            effects: { energy: -5, happiness: -3 },
            flags: { realGoat: true },
            result: 'The goat does not move. Three more goats appear. You are surrounded. You reverse two hundred metres and take another road.',
          },
        },
        duje: 'Never honk at a goat. Their union is very strong.',
      },
    ],
  },

  // ───────────────────────── The ham: fešta → tombola → pršut
  {
    id: 'village-festa',
    slot: 'evening',
    where: ['trogir', 'omis', 'hvar', 'brac'],
    when: (s) => s.day <= 4 && !s.flags.festa,
    weight: 4,
    title: 'Fešta!',
    story:
      'A brass band, fairy lights, grilled sardines, fritule frying in a giant pan, and a man on a stage reading out raffle numbers with the drama of a football commentator. The village is celebrating its saint, and you’ve been absorbed.',
    choices: [
      {
        id: 'tombola',
        label: 'Buy tombola tickets',
        chance: {
          p: (s) => lucky(s, 0.45),
          success: {
            effects: { money: -5, happiness: 12, adventure: 2 },
            flags: { festa: true, prsut: '@day' },
            result: 'Number 47! That’s you! You win the top prize: a whole pršut, an entire dry-cured leg of ham, about the size of a toddler. The village cheers. You now own a ham.',
            moment: { id: 'prsut-win', text: 'Won a whole pršut at a village tombola', rank: 6, headline: 'The Ham' },
          },
          fail: {
            effects: { money: -5, happiness: 6 },
            flags: { festa: true },
            result: 'You win nothing, but the lady beside you wins a bottle of olive oil and gives you a fritula out of sympathy. You suspect that was the better prize.',
          },
        },
        duje: 'The tombola is the most serious thing at any fešta. More serious than the saint.',
        tip: 'festa',
      },
      {
        id: 'fritule-dance',
        label: 'Eat fritule and dance',
        effects: { money: -4, energy: -4, happiness: 10, local: 2 },
        flags: { festa: true },
        result: 'Hot fritule dusted with sugar, a band playing songs everybody knows except you, and a grandfather who teaches you a dance with no steps, only spirit.',
        duje: 'A fešta is a whole village saying “we’re still here”. With doughnuts.',
        tip: 'festa',
      },
    ],
  },
  {
    id: 'prsut-problem',
    kind: 'callback',
    priority: true,
    slot: 'day',
    where: ['any'],
    when: (s) => before(s, 'prsut') && !s.flags.prsutDone,
    weight: 9,
    title: 'You Own a Ham',
    story: 'You woke up this morning next to a whole pršut, last night’s tombola prize, and you have been carrying it around ever since. People are starting to stare. You have a small backpack, several boats ahead of you and no plan.',
    choices: [
      {
        id: 'ham-share',
        label: (s) => (s.flags.hostel ? 'Feed the entire hostel' : s.flags.marija ? 'Give it to Marija' : 'Give it to the hotel staff'),
        effects: { happiness: 12, local: 3 },
        flags: { prsutDone: true },
        result: (s) =>
          s.flags.hostel
            ? 'Luka plays all four chords in its honour. Twelve backpackers eat ham at 3 a.m. For one night, you are a god.'
            : s.flags.marija
              ? 'Marija sees the ham, puts a hand on her heart and phones six relatives. By lunchtime you are guest of honour at a ham party where nobody else is under seventy.'
              : 'Igor accepts the ham as if it were a royal gift. That night every member of staff greets you by name, and the chef sends out a plate of it, sliced paper-thin, “with compliments from yourself”.',
        duje: 'Giving away a whole pršut. That’s not generosity. That’s sainthood.',
        moment: { id: 'ham-gift', text: 'Won a whole ham in a raffle and gave it away', rank: 8, headline: 'The Ham' },
      },
      {
        id: 'ham-carry',
        label: 'Carry it with you everywhere',
        effects: { energy: -8, happiness: 6, adventure: 3 },
        flags: { prsutDone: true, hamCarry: true },
        result: 'You strap it to your backpack. On the boat, people make room. In town, dogs follow you. A child asks whether it’s your pet. It sort of is now.',
        duje: 'You are the ham person now. I can’t be seen with you. I’ll walk two metres behind.',
        moment: { id: 'ham-carry', text: 'Carried a whole pršut around Dalmatia like a pet', rank: 9, headline: 'The Ham' },
      },
    ],
  },
  {
    id: 'packing-panic',
    slot: 'day',
    where: ['any'],
    when: (s) => s.day === 5 && ['hamCarry', 'oliveOil', 'anteDolphin', 'lemons', 'magnets', 'mamaJam'].some((k) => s.flags[k]),
    weight: 6,
    title: 'The Suitcase Has Concerns',
    story: (s) => {
      const items = [
        s.flags.hamCarry && 'a whole ham',
        s.flags.oliveOil && 'a bottle of domaće olive oil',
        s.flags.anteDolphin && 'Ante’s stone dolphin',
        s.flags.lemons && 'a swimsuit covered in lemons',
        s.flags.magnets && 'a bag of identical magnets',
        s.flags.mamaJam && 'a jar of fig jam from Duje’s mother',
      ].filter(Boolean);
      const list = items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items[0];
      return `Last day, packing time. On the bed: ${list}. In front of you: one suitcase. It has seen your plans and it disagrees.`;
    },
    choices: [
      {
        id: 'suitcase-tetris',
        label: 'Play suitcase Tetris',
        chance: {
          p: 0.5,
          success: { effects: { happiness: 8, energy: 2 }, result: 'Everything fits. You sit on the suitcase, it clicks shut, and you feel like an engineer.' },
          fail: { effects: { happiness: 3, energy: -6 }, result: 'The zip gives up with a sound like a sigh. Everything now travels in a supermarket bag and two pockets.' },
        },
        duje: 'Liquids in the checked bag, wrapped in socks. I don’t make the rules. Airports make the rules.',
        tip: 'pack-liquids',
      },
      {
        id: 'give-away',
        label: 'Give away whatever won’t fit',
        effects: { happiness: 9, local: 2 },
        result: 'You leave a trail of gifts across town: a waiter, a child, a nonna and one very interested seagull. The suitcase closes easily. Your heart is full.',
        duje: 'Travel light, leave a trail of happiness. And magnets.',
        tip: 'pack-liquids',
      },
    ],
  },

  // ───────────────────────── Luka (hostel base)
  {
    id: 'luka-guitar',
    slot: 'evening',
    where: ['any'],
    when: (s) => s.flags.hostel && s.day <= 2 && !s.flags.lukaGuitar,
    weight: 5,
    title: 'Hold This',
    story:
      'Luka hands you his guitar on the beach: “Hold this, I’m going for a swim. Five minutes.” It is a night swim. He does not come back for an hour. You are now a person holding a guitar on a beach at night, which in Dalmatia means people expect a song.',
    choices: [
      {
        id: 'play-song',
        rel: { luka: 1 },
        label: 'Play the only song you know',
        chance: {
          p: 0.4,
          success: { effects: { happiness: 10, local: 1, adventure: 2 }, flags: { lukaGuitar: true }, result: 'You play it, badly but with feeling. A group by the water sings along in Croatian, to a completely different song. It somehow works.' },
          fail: {
            effects: { happiness: 5, adventure: 1 },
            flags: { lukaGuitar: true },
            result: 'You play the first chord. A man nearby gently takes the guitar, plays something beautiful and hands it back. You say “hvala”. He says “nema problema”. You will never touch a guitar again.',
          },
        },
        duje: 'Every guitar on a Dalmatian beach becomes community property after midnight.',
      },
      {
        id: 'guard-guitar',
        rel: { luka: 1 },
        label: 'Guard it like treasure',
        effects: { happiness: 4, energy: 5 },
        flags: { lukaGuitar: true, lukaManager: true },
        result: 'You guard it with your life. Luka comes back, wet and grateful, and declares you his “manager”. You have no idea what this involves.',
        duje: 'Luka’s manager. Your first job: stop him playing at 3 a.m. Good luck.',
      },
    ],
  },
];

