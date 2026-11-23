/**
 * Croatia Adventure — local persistence (per device, works offline).
 * Kept separate from the puzzle's storage key so the two games never collide.
 */
const KEY = 'adic:adventure:v1';

function read() {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}
function write(data) {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — the game still works for this session */
  }
}

export function loadProgress() {
  const d = read();
  return {
    tips: d.tips ?? [], // collected tip ids (across all runs)
    achievements: d.achievements ?? [],
    endings: d.endings ?? [], // endings ever reached
    daily: d.daily ?? {}, // dateKey → { ending, score, tips, money }
    runs: d.runs ?? 0,
    best: d.best ?? 0,
    current: d.current ?? null, // autosaved run in progress
  };
}

/** Merge newly discovered tips/achievements into the collection. Returns the ids that were new. */
export function collect({ tips = [], achievements = [] }) {
  const d = read();
  const known = new Set(d.tips ?? []);
  const newTips = tips.filter((t) => !known.has(t));
  const knownA = new Set(d.achievements ?? []);
  const newAch = achievements.filter((a) => !knownA.has(a));
  write({ ...d, tips: [...known, ...newTips], achievements: [...knownA, ...newAch] });
  return { newTips, newAch };
}

export function saveCurrent(state) {
  write({ ...read(), current: state });
}

export function clearCurrent() {
  const d = read();
  delete d.current;
  write(d);
}

/** Record a finished run. Daily runs: only the first result of the day counts. */
export function recordRun({ state, score, dateKey }) {
  const d = read();
  const endings = new Set(d.endings ?? []);
  endings.add(state.ending);
  const daily = { ...(d.daily ?? {}) };
  if (state.mode === 'daily' && dateKey && !daily[dateKey]) {
    daily[dateKey] = { ending: state.ending, score, tips: state.tipsFound.length, money: state.money, seed: state.seed };
  }
  write({
    ...d,
    endings: [...endings],
    daily,
    runs: (d.runs ?? 0) + 1,
    best: Math.max(d.best ?? 0, score),
    current: undefined,
  });
}
