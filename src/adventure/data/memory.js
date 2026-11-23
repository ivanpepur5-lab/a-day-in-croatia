/**
 * STORY MEMORY (fiction) — what the holiday remembers about you.
 *
 *   PROMISES   things you said you'd do. Choices make, keep or break them; open
 *              promises are marked broken when the holiday ends (unless open-ended),
 *              and the report card lists them.
 *   CAST       the people you can build a relationship with (`rel` in choice effects).
 *   MEMORIES   one line per morning in which Duje brings up something from an earlier
 *              day. Each is used at most once, only after the day it happened.
 */
import { DESTINATIONS } from './world.js';

const f = (s, k) => s.flags[k] ?? 0;
const met = (s, id) => s.rel?.[id] !== undefined;
/** Did the player actually make this choice (not just see the event)? */
const did = (s, ...ids) => (s.choices ?? []).some((c) => ids.includes(c.id));

export const PROMISES = {
  'aunt-lunch': {
    to: 'the aunt from the wedding',
    text: 'to come to Sunday lunch',
    kept: 'Went to the aunt’s “small lunch” (31 people), as promised',
    broken: 'Promised the wedding aunt you’d come to lunch. She set a place for you anyway',
  },
  container: {
    to: 'Marija',
    text: 'to bring back her container',
    kept: 'Brought Marija’s container back, as promised',
    broken: 'Promised to bring back Marija’s container. The whole street knows',
  },
  peka: {
    to: 'the konoba',
    text: 'to come back for the peka you ordered',
    kept: 'Came back for the peka you pre-ordered',
    broken: 'Pre-ordered a peka and never came back for it. Somewhere, a peka waits',
  },
  'briskula-rematch': {
    to: 'Grandpa in Omiš',
    text: 'to give him a briškula rematch',
    kept: 'Kept your word to Grandpa in Omiš (via his nephew)',
    broken: 'Promised Grandpa in Omiš a briškula rematch. He is still on the bench',
  },
  bocce: {
    to: 'the boće players',
    text: 'to come back for another game',
    kept: 'Showed up for the boće rematch, as promised',
    broken: 'Promised the boće players a rematch. They argued about you instead',
  },
  fishing: {
    to: 'Pegica’s fisherman',
    text: 'to come out on his boat',
    kept: 'Went out on the boat with Pegica, as promised',
    broken: 'Promised the fisherman you’d come fishing. Pegica waited on the quay',
  },
  'come-back': {
    to: 'Duje',
    text: 'to come back next year',
    openEnded: 'Promised Duje you’ll come back. He has already told his mother',
  },
  jar: {
    to: 'Duje’s mother',
    text: 'to bring back her jam jar next year',
    openEnded: 'Promised Duje’s mother to bring back her jam jar next year. She wrote it down',
  },
};

/** People you can get to know. `rel` scores: ≥2 close, 1 good terms, 0 met, <0 complicated. */
export const CAST = [
  { id: 'duje', name: 'Duje', role: 'your local friend', lines: ['is still recovering from you', 'tolerates you', 'is proud of you (don’t tell him we told you)', 'calls you family now'] },
  { id: 'marija', name: 'Marija', role: 'the neighbour', lines: ['is mentioning the container to the whole street', 'waves politely', 'leaves figs on your doorstep', 'has adopted you'] },
  { id: 'luka', name: 'Luka', role: 'the hostel guitarist', lines: ['plays a sad song about you', 'nods from across the room', 'calls you “bro”', 'calls you his manager'] },
  { id: 'igor', name: 'Igor', role: 'the concierge', lines: ['has noted your preferences. All of them', 'bows exactly fifteen degrees', 'bows a little lower', 'shares his secret spots with you'] },
  { id: 'ante', name: 'Ante', role: 'Duje’s cousin: sunbeds, boats, souvenirs, “other”', lines: ['has blacklisted you', 'charges you full price', 'gives you the “family price”', 'considers you a business partner'] },
  { id: 'brian', name: 'Brian', role: 'the man in the Hawaiian shirt', lines: ['tells a story about you at parties', 'follows you on everything', 'calls you “my guy”', 'calls you his mentor'] },
];

export function relLabel(person, score) {
  const i = score < 0 ? 0 : score === 0 ? 1 : score <= 2 ? 2 : 3;
  return person.lines[i];
}

/**
 * Duje's morning callbacks. Ordered by priority; `since` is the flag holding the day it
 * happened (so a memory is only mentioned on a LATER morning).
 */
export const MEMORIES = [
  // promises in trouble come first — they are the funniest
  { id: 'grandpa-waiting', when: (s) => s.promises?.['briskula-rematch']?.status === 'open' && s.location !== 'omis', line: 'Small thing. Somewhere in Omiš an old man is sitting on a bench with a deck of cards. Waiting. No pressure.' },
  { id: 'container-pending', when: (s) => s.promises?.container?.status === 'open' && s.day >= 3, line: 'Marija asked me about her container. I said nothing. I am loyal. I am also scared of Marija.' },
  // hidden discoveries
  { id: 'mem-no-name', when: (s) => did(s, 'go'), line: 'Still thinking about that beach with no name? Good. Keep thinking. Don’t post.' },
  { id: 'mem-visovac', when: (s) => did(s, 'go-visovac'), line: 'You’ve been quieter since Visovac. It suits you.' },
  { id: 'mem-blaca', when: (s) => did(s, 'walk-blaca'), line: 'My legs still hurt from hearing about your walk to Blaca.' },
  { id: 'mem-konoba', when: (s) => did(s, 'sit-down'), line: 'I tried to find your konoba with no name. I couldn’t. That’s how you know it’s real.' },
  { id: 'mem-glow', when: (s) => did(s, 'glow-swim', 'glow-watch'), line: 'So the sea really glowed for you? Thirty-four years I’ve lived here. Twice. I’m not jealous. I’m a bit jealous.' },
  { id: 'mem-sustipan', when: (s) => did(s, 'sit-sustipan'), line: 'Thanks for not telling anyone about Sustipan. I checked.' },
  { id: 'mem-hajduk', when: (s) => did(s, 'watch-match'), line: 'My voice is still gone from the match. Worth it.' },
  { id: 'mem-fortica', when: (s) => did(s, 'climb-fortica'), line: 'You climbed to the pirates’ lookout. I told my uncle. He said he did it in 1974. Of course he did.' },
  // characters and decisions
  { id: 'mem-fish', when: (s) => s.flags.bigFish && !s.flags.fishLegend, line: (s) => `Somewhere in ${DESTINATIONS[s.flags.bigFishPlace]?.name ?? 'Split'}, a waiter is still telling the story of your fish. It’s getting bigger.` },
  { id: 'mem-goat', when: (s) => s.flags.goatExcuse, line: 'The rental company has added a goat emoji to your file. I didn’t know they could do that.' },
  { id: 'mem-wedding', when: (s) => s.flags.wedding, line: 'The wedding WhatsApp group is at 212 messages. Seven are about you. Two are photos of your dancing.' },
  { id: 'mem-ante', when: (s) => f(s, 'ante') >= 2 && (s.rel?.ante ?? 0) >= 1, line: 'Ante called me. He says you’re “a good customer”. I’m worried for you.' },
  { id: 'mem-ante-cold', when: (s) => f(s, 'ante') >= 2 && (s.rel?.ante ?? 0) <= 0, line: 'Ante called me. He says you are “a very difficult customer”. From Ante, that is almost a compliment.' },
  { id: 'mem-brian', when: (s) => s.flags.shirtMet !== undefined && f(s, 'shirtHelped') >= 1, line: 'Brian sent me a friend request. How does Brian know who I am?' },
  { id: 'mem-brian-video', when: (s) => s.flags.shirtFilmed, line: 'Your video of Brian has been shared 400 times. Brian has seen it. Brian thinks it’s great. I don’t understand Brian.' },
  { id: 'mem-ivana', when: (s) => s.flags.wingman && !s.flags.dujeDate, line: 'I walked past the bakery today. I didn’t go in. Don’t ask. Don’t look at me like that.' },
  { id: 'mem-ivana-tease', when: (s) => s.flags.ivanaTease, line: 'Please stop humming wedding songs when I mention bread. People are starting to talk.' },
  { id: 'mem-pegica', when: (s) => s.flags.fished, line: 'Pegica walked past my building this morning. She was looking for you. I’m offended.' },
  { id: 'mem-ham', when: (s) => s.flags.hamCarry, line: 'People are calling you “the ham person”. Affectionately. Mostly.' },
  { id: 'mem-bocce', when: (s) => s.flags.bocceDone, line: 'The boće group chat is still arguing about your last throw. You’re a legend among men over seventy.' },
  { id: 'mem-venice', when: (s) => s.flags.teamVenice, line: 'A man in Omiš asked me if I know “the one who cheered for Venice”. I said no. I lied for you.' },
  { id: 'mem-toe', when: (s) => s.flags.luckyToe, line: 'Remember the lucky toe? Every time something goes your way, I’m giving the toe the credit.' },
  { id: 'mem-lemons', when: (s) => s.flags.lemons, line: 'Are you wearing the lemon swimsuit today? Asking so I can stand somewhere else.' },
  { id: 'mem-mirror', when: (s) => s.flags.mirror && !s.flags.goatExcuse, line: 'How’s the car? And the mirror? And the wall? The wall is fine. Walls are always fine.' },
];

/** The memory Duje brings up this morning, if any: the first one that applies and hasn't been used. */
const YESTERDAY = [
  (t) => `Yesterday ${t}. I’ve already told three people. Four, with my mother.`,
  (t) => `I’m still thinking about yesterday: ${t}. That’s going in the family history.`,
];

export function memoryFor(s) {
  if (s.phase !== 'travel' || s.day < 2) return null;
  const used = s.mentioned ?? [];
  const m = MEMORIES.find((x) => !used.includes(x.id) && x.when(s));
  if (m) return { id: m.id, line: typeof m.line === 'function' ? m.line(s) : m.line };
  // otherwise: yesterday's most memorable moment (at most twice per holiday)
  const usedYesterday = used.filter((id) => id.startsWith('yesterday-')).length;
  if (usedYesterday >= YESTERDAY.length) return null;
  const best = (s.moments ?? []).filter((x) => x.day === s.day - 1 && x.rank >= 4 && x.id !== 'bench').sort((a, b) => b.rank - a.rank)[0];
  if (!best) return null;
  return { id: `yesterday-${best.id}`, line: YESTERDAY[usedYesterday](toYou(best.text)) };
}

/** “You were adopted…” — turns a report moment into something Duje can say to you. */
export function toYou(text) {
  if (!text) return '';
  const t = text.replace(/^Was /, 'were ').replace(/^Got /, 'got ');
  return `you ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
}

export { met };
