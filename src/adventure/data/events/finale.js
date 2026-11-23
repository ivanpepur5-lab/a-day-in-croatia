/**
 * FINALE & SURPRISE PAYOFFS (fiction).
 *
 *   duje-farewell   the last evening, always: Duje sums up YOUR holiday (moments, people,
 *                   promises) and gives one last real-world tip for next time — a region
 *                   beyond Dalmatia, chosen from how you played.
 *   venetian-actor  cheering for Venice in Omiš pays off later.
 *   zagreb-return   siding with Zagreb pays off later (and introduces the capital).
 */
import { COAST, TOWNS, f, before, here } from '../world.js';
import { PROMISES, toYou } from '../memory.js';

const byRank = (a, b) => b.rank - a.rank || a.day - b.day;

/** Duje's look back: two of your moments, a person, and the promise that matters most. */
function lookBack(s) {
  const moments = [...(s.moments ?? [])].sort(byRank);
  const lines = [];
  if (moments[0]) lines.push(`Five days ago you couldn’t say ‘hvala’. Since then ${toYou(moments[0].text)}.`);
  if (moments[1]) lines.push(`And ${toYou(moments[1].text)}. I was there for some of it. I’m still processing.`);
  if (!moments.length) lines.push('Five days, no disasters, no legends. Honestly? Suspiciously well-behaved. I respect it.');
  const broken = Object.entries(s.promises ?? {}).find(([id, p]) => p.status === 'open' && !PROMISES[id]?.openEnded);
  if (s.promises?.['briskula-rematch']?.status === 'open') lines.push('Also — somewhere in Omiš, a man is still waiting on a bench with a deck of cards. Just so you know.');
  else if (s.promises?.container?.status === 'open') lines.push('Also, Marija would like her container back. She asked me to mention it. Twice.');
  else if (broken) lines.push(`Also, you still owe ${PROMISES[broken[0]]?.to}. I’m just saying.`);
  else if ((s.rel?.ante ?? 0) >= 2) lines.push('Ante says you’re welcome back any time. At a family price. Probably.');
  else if ((s.rel?.marija ?? 0) >= 2) lines.push('Marija cried when I said you were leaving. Then she made peppers. For the plane.');
  return lines.join(' ');
}

/** Where Duje sends you next, from how you played. */
export function nextRegion(s) {
  if (s.flags.zagrebFans || s.flags.zagrebVisit) return 'zagreb';
  if (f(s, 'konoba') >= 2 || s.flags.oliveOil) return 'istria';
  if (s.visited.includes('krka') || f(s, 'hidden') >= 3) return 'plitvice';
  return 'zadar';
}

const NEXT_LINE = {
  zagreb: 'Next time, go north and see Zagreb. Yes, I’m saying it. Don’t tell anyone in Split. The Upper Town, the market, the cafés — it’s a different Croatia, and you’ve earned it.',
  istria: 'You eat like someone who should see Istria. Hill towns, olive oil, truffles. I’ll deny saying this, but their olive oil might be as good as ours. Might.',
  plitvice: 'You liked the waterfalls? Then next time: Plitvice. Lakes stacked on lakes, every colour of green. No swimming, before you ask.',
  zadar: 'Next time, start in Zadar and watch the sunset by the sea organ. The sea plays music. I’m not making it up. For once.',
};

export const FINALE_EVENTS = [
  {
    id: 'duje-farewell',
    kind: 'finale',
    finale: true,
    slot: 'evening',
    where: ['any'],
    when: (s) => s.day === 5,
    weight: 1,
    title: 'The Last Evening',
    story: (s) =>
      `Your last evening${s.location === 'split' ? '' : `, in ${here(s)}`}. Duje is quiet for a moment, which for Duje is a medical event. Then: “${lookBack(s)}”`,
    choices: [
      {
        id: 'farewell-promise',
        label: 'Promise him you’ll come back',
        effects: { happiness: 8, local: 1 },
        rel: { duje: 1 },
        promise: 'come-back',
        result: 'Duje nods, pretends something is in his eye, and immediately phones his mother to tell her. You hear her cheering from his phone.',
        duje: 'Everyone says they’ll come back. Most people do, actually. This coast is hard to leave.',
      },
      {
        id: 'farewell-next',
        label: 'Ask where you should go next time',
        effects: { happiness: 6, adventure: 1 },
        result: (s) => NEXT_LINE[nextRegion(s)],
        duje: 'There is more to Croatia than Dalmatia. Not better. But more.',
        tip: (s) => nextRegion(s),
        tipOptions: ['zagreb', 'istria', 'plitvice', 'zadar'],
      },
      {
        id: 'farewell-quiet',
        label: 'Say nothing. Watch the sea together.',
        effects: { happiness: 9, energy: 6 },
        rel: { duje: 1 },
        result: 'You sit on the warm stone as the sky goes from orange to navy. A ferry sounds its horn. Neither of you says anything for a long time. It’s the best conversation of the holiday.',
        duje: '…Pomalo. That’s all. Pomalo.',
      },
    ],
  },
  {
    id: 'venetian-actor',
    kind: 'callback',
    priority: true,
    slot: 'evening',
    where: TOWNS,
    when: (s) => before(s, 'teamVenice') && s.location !== 'omis',
    weight: 6,
    title: 'Your Only Fan',
    story: 'Your waiter tonight looks strangely familiar. Out of costume, it takes you a second: he is the man who played the Venetian officer in Omiš. He recognises you at once. “You,” he whispers. “You are the only one who ever cheered.”',
    choices: [
      {
        id: 'actor-dinner',
        label: 'Accept dinner “on the Republic of Venice”',
        effects: { money: -5, happiness: 11, local: 2 },
        result: 'Starters you didn’t order, a dessert with a tiny paper lion of St Mark stuck in it, and a toast “to the only person in Dalmatia with taste”. The bill is a drawing of a gondola.',
        duje: 'You got a free dinner for cheering for the wrong side. That’s not luck. That’s strategy.',
        moment: { id: 'venice-dinner', text: 'Got a free dinner from the Venetian officer (you were his only fan)', rank: 8, headline: 'Team Venice' },
      },
      {
        id: 'actor-autograph',
        label: 'Ask for his autograph instead',
        effects: { happiness: 8, adventure: 1 },
        result: 'He signs your napkin “Capitano, forever yours”, poses for a photo in his apron, and tells the whole terrace you are “a true connoisseur of theatre”.',
        duje: 'An autograph from a waiter who plays a villain in a pirate show. Frame it.',
      },
    ],
  },
  {
    id: 'zagreb-return',
    kind: 'callback',
    priority: true,
    slot: 'day',
    where: COAST,
    when: (s) => before(s, 'zagrebFans'),
    weight: 6,
    title: 'The Couple From Zagreb',
    story: (s) =>
      `In ${here(s)}, someone shouts your name. It’s the couple from Zagreb, the ones you sided with at dinner. “Our champion!” They’ve told all their friends about the tourist who said Zagreb is better than Split. They insist on buying you a coffee.`,
    choices: [
      {
        id: 'zagreb-coffee',
        label: 'Have the coffee and let them tell you about Zagreb',
        effects: { happiness: 8, local: 1, energy: 4 },
        flags: { zagrebVisit: true },
        result: 'For an hour they sell you Zagreb: the Upper Town, the market, the cafés, the trams. They give you their number “for when you come”. You realise you now have friends at both ends of the country.',
        duje: 'They’re right about the coffee in Zagreb. Don’t you dare tell them I said so.',
        tip: 'zagreb',
      },
      {
        id: 'zagreb-confess',
        label: 'Confess you only said it to annoy the waiter',
        effects: { happiness: 6, adventure: 2 },
        result: 'They gasp, then laugh so hard the next table joins in. “Classic Split,” they say. “You are one of them now.” They buy you the coffee anyway.',
        duje: 'You lied to Zagreb people for a dessert. I have never been prouder.',
      },
    ],
  },
];
