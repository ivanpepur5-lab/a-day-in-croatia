/**
 * Shared world constants for Croatia Adventure (fiction).
 * Kept separate so the event modules can import them without a cycle.
 */
export const START = { money: 500, energy: 100, happiness: 50, adventure: 0, local: 0, days: 5 };

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
export const COAST = ['split', 'trogir', 'omis', 'hvar', 'brac', 'dubrovnik'];
export const TOWNS = ['split', 'trogir', 'omis', 'hvar', 'brac', 'dubrovnik'];

/** Flag counter (0 when unset). */
export const f = (s, k) => s.flags[k] ?? 0;
export const was = (s, place) => s.visited.includes(place);
export const here = (s) => DESTINATIONS[s.location]?.name ?? 'town';
export const BASE_FRIEND = { hostel: 'Luka from the hostel', apartment: 'Marija next door', boutique: 'Igor the concierge' };
/** True when flag `k` (stored with '@day') was set on an earlier day. */
export const before = (s, k) => s.flags[k] !== undefined && s.flags[k] < s.day;
