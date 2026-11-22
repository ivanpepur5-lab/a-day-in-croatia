import { SPLIT_HUB } from './locations.js';

const SPLIT_CARDS = [
  'diocletians-palace',
  'marjan',
  'bacvice',
  'salona',
  'klis',
  'trogir',
  'omis',
  'krka',
];

/**
 * Daily challenges. All values are illustrative game parameters.
 * The daily rotation cycles through this list (see engine/daily.js).
 */
export const CHALLENGES = [
  {
    id: 'split-classic',
    region: 'Split',
    title: 'The Classic Split Day',
    brief:
      'You have 8 hours in Split, a budget of €75 for two people, and no rental car. ' +
      'Build the best possible day by selecting and arranging four experiences.',
    startTime: '09:00',
    availableMinutes: 480,
    budget: 75,
    partySize: 2,
    transport: 'No rental car',
    hub: SPLIT_HUB,
    picks: 4,
    cardIds: SPLIT_CARDS,
    requirements: [
      { id: 'r-history', type: 'category', category: 'history', min: 1 },
      { id: 'r-nature', type: 'category', category: 'nature', min: 1 },
      { id: 'r-view', type: 'finishWith', category: 'viewpoint' },
    ],
  },
  {
    id: 'split-heritage',
    region: 'Split',
    title: 'Emperors & Fortresses',
    brief:
      'Two history lovers, 9 hours and €90 between you — still no car. ' +
      'Pack in the heritage, but save time for a swim.',
    startTime: '08:30',
    availableMinutes: 540,
    budget: 90,
    partySize: 2,
    transport: 'No rental car',
    hub: SPLIT_HUB,
    picks: 4,
    cardIds: SPLIT_CARDS,
    requirements: [
      { id: 'r-history2', type: 'category', category: 'history', min: 2 },
      { id: 'r-beach', type: 'category', category: 'beach', min: 1 },
    ],
  },
  {
    id: 'split-wild',
    region: 'Split',
    title: 'Out Into the Wild',
    brief:
      'A long summer day: 11 hours, €130 for two and public transport only. ' +
      'Get outdoors, get on the water, and end with a view.',
    startTime: '08:00',
    availableMinutes: 660,
    budget: 130,
    partySize: 2,
    transport: 'No rental car',
    hub: SPLIT_HUB,
    picks: 4,
    cardIds: SPLIT_CARDS,
    requirements: [
      { id: 'r-adventure', type: 'category', category: 'adventure', min: 1 },
      { id: 'r-nature2', type: 'category', category: 'nature', min: 2 },
      { id: 'r-view-end', type: 'finishWith', category: 'viewpoint' },
    ],
  },
];

export const CHALLENGES_BY_ID = Object.fromEntries(CHALLENGES.map((c) => [c.id, c]));
