/**
 * EVERYDAY DALMATIA — situations that can happen almost anywhere (fiction).
 * Each one is built around a real habit, rule or piece of etiquette, and the
 * real part lives on the linked Local Insider tip card.
 */
import { COAST, TOWNS, ISLANDS, f } from '../world.js';

const lucky = (s, p) => Math.min(0.9, p + (s.flags.luckyToe ? 0.15 : 0));

export const EVERYDAY_EVENTS = [
  {
    id: 'jugo-day',
    slot: 'day',
    where: ['any'],
    weight: 2,
    title: 'Jugo',
    story:
      'The wind is warm, wet and heavy. The sky is grey, the sea is sulking, and everyone you meet has a headache. A text from Duje: “Jugo today. Make no decisions. Sign nothing. Love no one.”',
    choices: [
      {
        id: 'jugo-surrender',
        label: 'Surrender: long lunch, no plans',
        effects: { money: -12, energy: 12, happiness: 6, local: 1 },
        flags: { fjaka: 1 },
        result: 'You eat slowly, talk slowly and agree with everyone. The waiter says he and his wife never argue during jugo: they wait until it passes. “More efficient,” he says.',
        duje: 'Jugo is the only weather in Dalmatia with its own excuse system.',
        tip: 'jugo',
      },
      {
        id: 'jugo-fight',
        label: 'Ignore it and stick to your plans',
        effects: { energy: -10, happiness: -3, adventure: 3 },
        result: 'Everyone you need is in a mood. A shopkeeper sighs at you. A bus driver sighs at you. A cat sighs at you. You see everything and enjoy almost none of it.',
        duje: 'You fought the jugo. The jugo didn’t notice.',
        tip: 'jugo',
      },
    ],
  },
  {
    id: 'fkk-beach',
    slot: 'day',
    where: ['omis', 'hvar', 'brac', 'dubrovnik'],
    weight: 2,
    title: 'The Beach Bar Called FKK',
    story: 'You follow a sign marked “FKK” down a pine path, hoping for a beach bar. There is no bar. There is a beach. There are people. There are no swimsuits.',
    choices: [
      {
        id: 'fkk-stay',
        label: 'When in Rome… (well, Dalmatia)',
        effects: { happiness: 9, adventure: 4 },
        result: 'You swim in the most freeing, slightly terrifying way possible. A retired couple wishes you a good afternoon with complete normality. You have never been so relaxed or so carefully sunscreened.',
        duje: 'Sunscreen. Everywhere. EVERYWHERE.',
        tip: 'fkk',
        moment: { id: 'fkk', text: 'Mistook a naturist beach for a beach bar (and stayed)', rank: 6, headline: 'The FKK Misunderstanding' },
      },
      {
        id: 'fkk-leave',
        label: 'Turn around with dignity and great speed',
        effects: { energy: -5, happiness: 3 },
        result: 'You walk back up the path studying the pine trees intensely. A man wearing only a hat says “dobar dan” as you pass. You say “dobar dan” to a pine tree.',
        duje: 'FKK is not a bar. It’s a lifestyle. Now you know.',
        tip: 'fkk',
      },
    ],
  },
  {
    id: 'asked-directions',
    slot: 'day',
    where: ['any'],
    when: (s) => f(s, 'phrases') >= 2,
    weight: 4,
    title: 'Mistaken for a Local',
    story:
      'A family with a map stops you: “Excuse me, do you speak English? Where is the old town?” They think you’re local. Your tan, your slow walk and your bag of market figs have given you away as one of them.',
    choices: [
      {
        id: 'direct-confident',
        label: 'Give directions with total confidence',
        chance: {
          p: (s) => lucky(s, 0.6),
          success: { effects: { happiness: 9, local: 2 }, result: 'You send them the right way, with a café recommendation. They thank you in slow, careful English. You reply “nema problema” and walk away taller.' },
          fail: { effects: { happiness: 5, adventure: 1 }, result: 'You confidently send them the wrong way. Ten minutes later you see them again, still smiling, still lost. You hide behind a fig stall.' },
        },
        duje: 'Mistaken for a local. My work here is done. Unless you sent them the wrong way. Did you?',
        moment: { id: 'local-directions', text: 'Was asked for directions by tourists who thought you were local', rank: 5 },
      },
      {
        id: 'direct-croatian',
        label: 'Answer in Croatian first: “Ravno pa lijevo!”',
        effects: { happiness: 8, local: 3 },
        flags: { phrases: 1 },
        result: '“Ravno pa lijevo,” you say — straight on, then left — and then you translate. They look at you as if you were a wizard. You feel like one.',
        duje: 'Ravno pa lijevo. That’s how every Dalmatian gives directions. Even when it’s right.',
        tip: 'croatian-basics',
      },
    ],
  },
  {
    id: 'water-cold',
    slot: 'day',
    where: COAST,
    weight: 2,
    title: 'Is the Water Cold?',
    story:
      'You stand in the sea up to your knees, arms raised, making small noises. A grandmother swims past in a calm breaststroke, wearing a sun hat, chatting with her friend. She has been in for an hour. From the shore Duje shouts: “Don’t ask if it’s cold. Never ask.”',
    choices: [
      {
        id: 'dive-in',
        label: 'Dive in all at once',
        effects: { happiness: 9, energy: 6, adventure: 1 },
        result: 'Shock, then bliss. The sea is perfect. It was always perfect. The grandmother gives you a small nod, which in beach language is a medal.',
        duje: 'That’s how it’s done. In Split we swim from May and complain from May.',
      },
      {
        id: 'inch-in',
        label: 'Inch in, splashing your wrists and neck first',
        effects: { happiness: 5, energy: 3, local: 1 },
        result: 'You perform the full ritual: wrists, neck, a little splash on the back of the head “for the heart”. The grandmothers approve of your technique, if not your speed.',
        duje: 'Wrists and neck first. Is it science? It’s grandmother science. It’s stronger than science.',
        moment: { id: 'grandma-ritual', text: 'Entered the sea using the full grandmother splash ritual', rank: 3 },
      },
    ],
  },
  {
    id: 'swimwear-rule',
    slot: 'day',
    where: ['hvar'],
    weight: 3,
    title: 'From Beach to Town',
    story:
      'You stroll off the beach and into town in your swimsuit, still dripping, feeling free. A sign at the edge of the square shows a crossed-out figure in swimwear. A waiter looks at you the way a teacher looks at unfinished homework.',
    choices: [
      {
        id: 'cover-up',
        label: 'Put on a shirt and shorts',
        effects: { happiness: 5, local: 1 },
        result: 'Shirt on, shorts on. The waiter nods, the sign is satisfied, and you get a table with a view instead of a lecture.',
        duje: 'Beach clothes for the beach, town clothes for the town. We are simple people.',
        tip: 'swimwear-rule',
      },
      {
        id: 'ignore-sign',
        label: 'Ignore it, you’re on holiday',
        chance: {
          p: 0.5,
          success: { effects: { happiness: 3 }, result: 'Nobody stops you. But everybody looks. Somehow the looking is worse.' },
          fail: { effects: { money: -20, happiness: -5 }, result: 'A polite municipal officer stops you and explains the local rules. You leave the conversation with a shirt on and fewer euros.' },
        },
        duje: 'The sign has a crossed-out swimsuit on it. It was not a fashion suggestion.',
        tip: 'swimwear-rule',
      },
    ],
  },
  {
    id: 'sunday-shop',
    slot: 'day',
    where: ['any'],
    weight: 2,
    title: 'It’s Sunday',
    story: 'You need sunscreen, water and something for breakfast. The supermarket is dark, shutters down. It’s Sunday. A sign says something long in Croatian that clearly means “no”.',
    choices: [
      {
        id: 'bakery-port',
        label: 'Try the bakery and the kiosk',
        effects: { money: -6, energy: 6, happiness: 5, local: 1 },
        result: 'The bakery is open, the kiosk by the port has sunscreen, and the man behind the counter wishes you “dobro jutro” like a blessing.',
        duje: 'Sunday is for family, Mass and coffee. Shopping is for Monday. Plan ahead or eat burek.',
        tip: 'sunday-shops',
      },
      {
        id: 'ask-neighbour',
        label: (s) => (s.flags.marija ? 'Knock on Marija’s door' : 'Ask the neighbours for help'),
        effects: { energy: 4, happiness: 7, local: 2 },
        result: (s) =>
          s.flags.marija
            ? 'Marija opens the door before you knock and hands you bread, tomatoes and sunscreen “from the bathroom”, plus an invitation to Sunday lunch next time you look “too thin”.'
            : 'The family next door gives you bread, a tomato, two eggs and a lecture on planning ahead. Then they invite you for coffee. Of course they do.',
        duje: 'Running out of food on a Sunday is how most friendships in Dalmatia begin.',
        tip: 'sunday-shops',
      },
    ],
  },
  {
    id: 'cathedral-dress',
    slot: 'day',
    where: ['split', 'trogir', 'hvar', 'dubrovnik'],
    weight: 2,
    title: 'Shoulders, Please',
    story:
      'At the cathedral door, a lady with a firm expression looks at your bare shoulders, then at your beach shorts, then into your soul. She holds up a large paper wrap like a matador’s cape.',
    choices: [
      {
        id: 'wear-wrap',
        label: 'Wear the paper wrap with dignity',
        effects: { happiness: 7, local: 1, adventure: 1 },
        result: 'You go in wrapped like a slightly crumpled burrito. Inside it is cool, quiet and breathtaking, and you forget about the wrap. Nobody else does.',
        duje: 'Shoulders covered in church. My grandmother would check yours personally.',
        tip: 'church-dress',
      },
      {
        id: 'come-back',
        label: 'Come back later, properly dressed',
        effects: { energy: -5, happiness: 5, local: 2 },
        result: 'You come back in a shirt. The lady recognises you, nods and waves you in like a regular. You have earned something. Respect, possibly.',
        duje: 'She remembered you. They always remember. That’s the system.',
        tip: 'church-dress',
      },
    ],
  },
  {
    id: 'seagull-mate',
    slot: 'day',
    where: COAST,
    weight: 2,
    title: 'Mate Strikes',
    story: (s) =>
      f(s, 'benchNights')
        ? 'A familiar seagull lands on the bench beside you. It’s Mate, your roommate from the bench nights. He looks at your burek. He looks at you. He believes you owe him rent.'
        : 'You sit on a bench by the sea with a warm burek. A seagull lands next to you, studies the burek and adopts the posture of a debt collector. Locals call this one Mate.',
    choices: [
      {
        id: 'protect-burek',
        label: 'Shield the burek with your body',
        chance: {
          p: 0.4,
          success: { effects: { happiness: 6, adventure: 1 }, result: 'You hunch over the burek like a goalkeeper. Mate gives up and robs a teenager on the next bench. You feel guilty and full.' },
          fail: {
            effects: { money: -3, happiness: -2 },
            result: 'A second seagull attacks from behind. Teamwork. The burek is gone. You buy another and eat it in a doorway like a fugitive.',
            moment: { id: 'mate', text: 'Lost a burek to a seagull named Mate (he had backup)', rank: 4 },
          },
        },
        duje: 'Everyone on the Riva has lost a burek to Mate. It’s like a tax.',
      },
      {
        id: 'share-mate',
        label: 'Tear off a piece for him',
        effects: { happiness: 5 },
        result: 'Mate takes it and stays. He follows you for the rest of the morning at a respectful distance, like a feathered bodyguard who works for pastry.',
        duje: 'Never feed Mate. Now you have a seagull. You can’t return a seagull.',
      },
    ],
  },
  {
    id: 'laundry-drop',
    slot: 'day',
    where: ['split', 'trogir', 'omis', 'dubrovnik'],
    weight: 2,
    title: 'Incoming Sock',
    story: 'Something soft lands on your head. It is a sock. Three floors up, between two stone walls, a grandmother leans out of a window beside a laundry line. “Sorry, sorry! Bring it up, dear?”',
    choices: [
      {
        id: 'deliver-sock',
        label: 'Climb three floors to return the sock',
        effects: { energy: -6, happiness: 9, local: 3 },
        result: 'You climb ancient stairs and hand over the sock. She gives you coffee, two biscuits and her life story, and tells you which neighbours have been feuding since 1987. You leave knowing too much.',
        duje: 'She will tell everyone a polite foreigner returned her sock. You are now famous on three streets.',
        tip: 'palace-lived-in',
        moment: { id: 'sock', text: 'Returned a sock three floors up and learned forty years of neighbourhood gossip', rank: 4 },
      },
      {
        id: 'hang-sock',
        label: 'Hang it on the door handle and wave',
        effects: { happiness: 4, energy: 2 },
        result: 'You hang the sock on the door handle and wave. She waves back, satisfied. Somewhere above, the laundry line is complete again. Order is restored.',
        duje: 'A sock returned is a family honoured. Even halfway.',
      },
    ],
  },
  {
    id: 'catamaran-seasick',
    slot: 'day',
    where: ISLANDS,
    when: (s) => s.route.length >= 2 && s.route.at(-2) !== s.location,
    weight: 2,
    title: 'Sea Legs',
    story: 'The crossing was bumpier than the brochure suggested. You step onto the island the colour of a green olive, and the ground keeps moving long after the boat has stopped.',
    choices: [
      {
        id: 'sea-legs-rest',
        label: 'Sit in the shade until the island stops swaying',
        effects: { energy: 8, happiness: 3 },
        result: 'Half an hour, one cold drink and a lot of staring at the horizon later, the island agrees to stand still.',
        duje: 'Look at the horizon. The horizon never moves. Unlike ferries.',
      },
      {
        id: 'sea-legs-swim',
        label: 'Jump straight into the sea',
        effects: { energy: 4, happiness: 7, adventure: 1 },
        result: 'The cold water resets your whole body. You float, staring at the sky, while the island slowly stops dancing.',
        duje: 'The sea made you sick, the sea makes you better. The sea is like family.',
      },
    ],
  },
  {
    id: 'phone-dead',
    slot: 'day',
    where: TOWNS,
    when: (s) => s.day >= 2,
    weight: 1,
    title: 'Battery 1%',
    story: 'Your phone dies in the middle of the old town: no map, no tickets, no photos, no Duje. Around you, a maze of identical, beautiful stone lanes.',
    choices: [
      {
        id: 'ask-cafe',
        label: 'Ask a café to charge it and wait with a coffee',
        effects: { money: -3, energy: 8, happiness: 6, local: 1 },
        result: 'The waiter plugs it in behind the bar without a word, as if this happens hourly. It does. An hour, one coffee and two new friends later, you are back online.',
        duje: 'A café is a charging station with emotions.',
        tip: 'kava-ritual',
      },
      {
        id: 'wander-offline',
        label: 'Wander without it',
        effects: { energy: -5, happiness: 9, adventure: 3 },
        flags: { hidden: 1 },
        result: 'Without the map you look up instead of down: carved coats of arms, a hidden courtyard, a fig tree growing out of a wall. You find your way back by following the smell of grilled fish.',
        duje: 'Best way to see an old town: get lost on purpose. The sea is always downhill.',
        moment: { id: 'offline', text: 'Navigated an old town with a dead phone, using only the smell of grilled fish', rank: 4 },
      },
    ],
  },

  // ───────────────────────── evenings, anywhere
  {
    id: 'bill-tip',
    slot: 'evening',
    where: ['any'],
    weight: 2,
    title: 'The Bill',
    story:
      'Dinner was wonderful. The waiter, charming all evening, brings the bill on a little saucer and retreats to a respectful distance, pretending not to watch. He is watching.',
    choices: [
      {
        id: 'round-up',
        label: 'Round up and leave a little extra in cash',
        effects: { money: -6, happiness: 6, local: 1 },
        result: 'You leave a little extra in coins. The waiter says “hvala, doviđenja!” with real warmth and recommends a bar where his cousin works. Everyone has a cousin.',
        duje: 'A small tip with a smile. Perfect. Not too much, not too little. Like rakija.',
        tip: 'tipping',
      },
      {
        id: 'tip-huge',
        label: 'Leave an enormous tip, to look generous',
        effects: { money: -30, happiness: 4 },
        result: 'The waiter stares at the saucer, then at you, then fetches the owner. Both thank you warmly and slightly suspiciously. You will be remembered. For the wrong reason.',
        duje: 'Too much! Now they think you’re a millionaire or a spy. On Hvar, both are common.',
      },
      {
        id: 'tip-none',
        label: 'Pay exactly the total',
        effects: { happiness: 1, energy: 1 },
        result: 'Perfectly acceptable. The waiter nods politely and says “hvala”. Nobody is offended. Nobody is moved. It is a purely mathematical evening.',
        duje: 'Correct. Legal. A little cold. Like the sea in February.',
        tip: 'tipping',
      },
    ],
  },
  {
    id: 'bevanda',
    slot: 'evening',
    where: ['any'],
    weight: 2,
    title: 'How Do You Drink Your Wine?',
    story:
      'At the bar, an old man orders red wine and a jug of water and mixes them in his glass with the precision of a chemist. He catches you staring. “Bevanda,” he says. “For the heat. And for living to ninety-three.”',
    choices: [
      {
        id: 'try-bevanda',
        label: 'Order a bevanda',
        effects: { money: -4, energy: 4, happiness: 6, local: 2 },
        result: 'Red wine, cold water, a long evening and a clear head in the morning. The old man raises his glass to you. You raise yours. You’re in a club now.',
        duje: 'Bevanda: the drink of wise men and grandfathers. Never order it in a fancy wine bar. Someone will faint.',
        tip: 'bevanda',
      },
      {
        id: 'try-prosek',
        label: 'Ask for something sweet: prošek',
        effects: { money: -6, happiness: 7, local: 1 },
        result: 'A small glass of amber dessert wine that tastes like figs and sunsets. The barman warns you, very seriously, never to confuse it with prosecco “in front of anyone”.',
        duje: 'Prošek is not prosecco. Mix them up here and you’ll get a lecture longer than the wine list.',
        tip: 'prosek',
      },
      {
        id: 'order-spritz',
        label: 'Order a spritz like everyone else',
        effects: { money: -9, happiness: 5 },
        result: 'It’s orange, it’s cold, it’s fine. The old man looks at it the way you’d look at someone wearing socks with sandals. Lovingly. Pityingly.',
        duje: 'Spritz. Fine. Italian. We’re neighbours, we share.',
      },
    ],
  },
  {
    id: 'zagreb-couple',
    slot: 'evening',
    where: ['split', 'trogir', 'omis', 'hvar', 'brac'],
    weight: 2,
    title: 'Split or Zagreb?',
    story:
      'At the next table, a couple from Zagreb are being teased by the waiter about their pale legs and their “sad” city with no sea. They tease him back about Split’s traffic. Then all three turn to you: “Which is better?”',
    choices: [
      {
        id: 'say-split',
        label: '“Split, obviously.”',
        effects: { happiness: 6, local: 1 },
        result: 'The waiter brings you a free dessert. The couple from Zagreb boo you cheerfully and then share their wine with you. Everyone is satisfied. Nobody has changed their mind.',
        duje: 'Correct answer. Write it down. Frame it.',
      },
      {
        id: 'say-zagreb',
        rel: { duje: -1 },
        label: '“Zagreb. It has… great museums?”',
        effects: { happiness: 5, adventure: 2 },
        flags: { zagrebFans: '@day' },
        result: 'The couple cheer. The waiter puts a hand on his heart and says nothing for an uncomfortably long time. Your dessert arrives last. Much later. Slightly smaller.',
        duje: 'I’m going to pretend I didn’t hear that. My mother heard it. She’s not speaking to you.',
      },
      {
        id: 'say-both',
        label: '“The best thing about Croatia is that you have both.”',
        effects: { happiness: 7, local: 2 },
        result: 'Silence. Then applause. The couple, the waiter and a man at the bar all raise their glasses. You could run for parliament.',
        duje: 'Diplomacy. Dubrovnik would be proud. Dubrovnik is always proud.',
      },
    ],
  },
  {
    id: 'summer-storm',
    slot: 'evening',
    where: ['any'],
    weight: 1.5,
    title: 'The Storm',
    story:
      'The sky turns purple, the wind spins the parasols, and then it pours: warm, heavy rain that turns the stone streets into rivers. The lights flicker. The waiters, completely unfazed, bring out candles.',
    choices: [
      {
        id: 'storm-candles',
        label: 'Stay under the awning by candlelight',
        effects: { money: -15, energy: 6, happiness: 9 },
        result: 'Candles, grilled squid, the smell of rain on hot stone, and a table of strangers who are friends by dessert. When the rain stops, everyone steps outside to watch the steam rise from the streets.',
        duje: 'Summer storms are like Dalmatian arguments. Loud, then over, then everybody eats.',
      },
      {
        id: 'storm-dance',
        label: 'Run out and dance in the rain',
        effects: { energy: -6, happiness: 10, adventure: 3 },
        result: 'You dance on the shining stones. A little girl joins in, then her grandfather, then a waiter with a tray on his head. For four minutes the whole street is a musical.',
        duje: 'Dancing in the rain on stones older than most countries. That’s not a holiday. That’s a film.',
        moment: { id: 'rain-dance', text: 'Danced in a summer storm with a waiter and someone’s grandfather', rank: 5 },
      },
    ],
  },
  {
    id: 'bench-committee',
    slot: 'evening',
    where: TOWNS,
    weight: 2,
    title: 'The Bench Committee',
    story:
      'On a stone bench by the church sit four grandmothers, evaluating everyone who walks past. Nothing escapes them: your shoes, your tan, your posture, your future. You are approaching.',
    choices: [
      {
        id: 'greet-ladies',
        label: '“Dobra večer!” — and smile',
        effects: { happiness: 8, local: 2 },
        flags: { phrases: 1 },
        result: 'Four faces soften at once. You are asked whether you are married, whether you eat enough and whether your mother knows where you are. You pass the inspection. Mostly.',
        duje: 'The bench committee has approved you. This is bigger than a visa.',
      },
      {
        id: 'walk-fast',
        label: 'Walk past quickly, looking at your phone',
        effects: { happiness: -2, energy: 2 },
        result: 'You walk past. Behind you a low murmur begins. By morning the whole street knows that a pale stranger walked past the bench without greeting anyone.',
        duje: 'Never pass the bench without a greeting. Never. Long memories, short patience.',
      },
    ],
  },
];
