import { previousDateKey } from '../engine/daily.js';

/**
 * Local persistence (works offline). Only the *order* of a plan is stored —
 * scores are always recomputed from the deterministic engine.
 */
const KEY = 'adic:v1';

function safeRead() {
  try {
    const raw = globalThis.localStorage?.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function safeWrite(data) {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable (private mode) — game still works */
  }
}

export function loadState() {
  const data = safeRead();
  return {
    playerId: data.playerId ?? null,
    history: data.history ?? {},
    seenIntro: Boolean(data.seenIntro),
  };
}

export function getPlayerId() {
  const data = safeRead();
  if (data.playerId) return data.playerId;
  const id =
    globalThis.crypto?.randomUUID?.() ??
    `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  safeWrite({ ...data, playerId: id });
  return id;
}

export function getResultFor(dateKey) {
  return safeRead().history?.[dateKey] ?? null;
}

/** Save the first (official) result of a day. Later plays are practice and not saved. */
export function saveResult(dateKey, entry) {
  const data = safeRead();
  const history = data.history ?? {};
  if (history[dateKey]) return false;
  history[dateKey] = { ...entry, completedAt: entry.completedAt ?? new Date().toISOString() };
  safeWrite({ ...data, history });
  return true;
}

export function markIntroSeen() {
  safeWrite({ ...safeRead(), seenIntro: true });
}

/** Pure stats from a history map. */
export function computeStats(history, todayKey) {
  const keys = Object.keys(history).sort();
  const totals = keys.map((k) => history[k].total);
  let streak = 0;
  let cursor = history[todayKey] ? todayKey : previousDateKey(todayKey);
  while (history[cursor]) {
    streak += 1;
    cursor = previousDateKey(cursor);
  }
  let maxStreak = 0;
  let run = 0;
  let prev = null;
  for (const k of keys) {
    run = prev && previousDateKey(k) === prev ? run + 1 : 1;
    maxStreak = Math.max(maxStreak, run);
    prev = k;
  }
  return {
    played: keys.length,
    best: totals.length ? Math.max(...totals) : 0,
    average: totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0,
    streak,
    maxStreak,
  };
}
