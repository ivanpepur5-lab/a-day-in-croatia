import { DATE_RE, displayState, daysBetweenKeys } from './verification.js';

/**
 * Audit the editable travel data (src/data/travel-data.json).
 *
 * Errors   — data that would mislead players: missing/unknown sources,
 *            missing or impossible dates, unbacked "verified" prices,
 *            invalid statuses or numbers. `npm run audit:check` fails on these.
 * Warnings — information that needs a human: verification older than the
 *            review window, validity periods that ended or end soon,
 *            sources nobody uses.
 *
 * @param {object} data            parsed travel-data.json
 * @param {{today:string, locationIds?:string[]}} opts
 */
export function auditTravelData(data, { today, locationIds = null }) {
  const issues = [];
  const add = (level, code, where, message) => issues.push({ level, code, where, message });
  const sources = data.sources ?? {};
  const meta = data.meta ?? {};
  const defaultReviewDays = meta.defaultReviewDays ?? 180;
  const used = new Set();
  const STATUSES = ['verified', 'unverified', 'estimate'];
  const IMPORTANT = ['price', 'hours', 'transport', 'access'];

  // --- sources
  for (const [id, s] of Object.entries(sources)) {
    if (!s.label) add('error', 'SOURCE_LABEL', `sources.${id}`, 'Source has no label.');
    if (!s.url || !/^https:\/\/[^\s/]+\.[^\s/]+/.test(s.url)) add('error', 'SOURCE_URL', `sources.${id}`, `Source URL must be https (got "${s.url ?? ''}").`);
  }
  const checkSourceRef = (id, where) => {
    if (!id) return false;
    used.add(id);
    if (!sources[id]) {
      add('error', 'SOURCE_UNKNOWN', where, `Unknown source id "${id}" — add it to "sources".`);
      return false;
    }
    return true;
  };

  const checkDates = (rec, where) => {
    if (!rec.verifiedOn) add('error', 'DATE_MISSING', where, 'Verified item has no "verifiedOn" date.');
    else if (!DATE_RE.test(rec.verifiedOn)) add('error', 'DATE_FORMAT', where, `"verifiedOn" must be YYYY-MM-DD (got "${rec.verifiedOn}").`);
    else if (rec.verifiedOn > today) add('error', 'DATE_FUTURE', where, `"verifiedOn" ${rec.verifiedOn} is in the future.`);
    for (const k of ['validFrom', 'validUntil']) {
      if (rec[k] && !DATE_RE.test(rec[k])) add('error', 'DATE_FORMAT', where, `"${k}" must be YYYY-MM-DD (got "${rec[k]}").`);
    }
    if (rec.verifiedOn && DATE_RE.test(rec.verifiedOn) && rec.verifiedOn <= today) {
      const st = displayState(rec, { today, defaultReviewDays });
      if (st.state === 'stale') {
        const expired = rec.validUntil && today > rec.validUntil;
        add('warning', expired ? 'EXPIRED' : 'STALE', where, expired ? `Information was valid until ${rec.validUntil} — re-check.` : `Verified ${rec.verifiedOn}: ${st.reason}.`);
      } else if (rec.validUntil && DATE_RE.test(rec.validUntil) && daysBetweenKeys(today, rec.validUntil) <= 30) {
        add('warning', 'EXPIRES_SOON', where, `Information is valid only until ${rec.validUntil}.`);
      }
    }
  };

  const checkRecord = (rec, where, { important }) => {
    if (!STATUSES.includes(rec.status)) {
      add('error', 'STATUS', where, `Status must be one of ${STATUSES.join(', ')} (got "${rec.status}").`);
      return;
    }
    if (rec.status === 'verified') {
      if (!rec.source) add('error', 'SOURCE_MISSING', where, 'Verified item has no "source".');
      else checkSourceRef(rec.source, where);
      checkDates(rec, where);
    } else {
      if (rec.source) add('error', 'SOURCE_ON_UNVERIFIED', where, `Only verified items may have "source"; use "checkAt" for ${rec.status} items.`);
      const refs = rec.checkAt ?? [];
      refs.forEach((id) => checkSourceRef(id, where));
      if (important && refs.length === 0) add('error', 'CHECK_MISSING', where, `${rec.status} travel information needs "checkAt" (where to verify it).`);
    }
  };

  // --- locations
  const locs = data.locations ?? {};
  if (locationIds) {
    for (const id of locationIds) if (!locs[id]) add('error', 'LOCATION_MISSING', `locations.${id}`, 'Game location has no travel data.');
    for (const id of Object.keys(locs)) if (!locationIds.includes(id)) add('warning', 'LOCATION_UNUSED', `locations.${id}`, 'Travel data for a location the game does not use.');
  }
  for (const [lid, l] of Object.entries(locs)) {
    const base = `locations.${lid}`;
    // game price
    const p = l.price;
    if (!p || typeof p.perPerson !== 'number' || p.perPerson < 0) {
      add('error', 'PRICE_INVALID', `${base}.price`, '"price.perPerson" must be a number ≥ 0.');
    } else {
      checkRecord(p, `${base}.price`, { important: true });
      if (p.status === 'verified') {
        const backing = (l.facts ?? []).find((f) => f.id === p.fact);
        if (!backing) add('error', 'PRICE_UNBACKED', `${base}.price`, 'Verified price must point ("fact") to a verified fact.');
        else if (backing.status !== 'verified' || !String(backing.value).includes(`€${p.perPerson}`)) {
          add('error', 'PRICE_UNBACKED', `${base}.price`, `Fact "${p.fact}" does not verify €${p.perPerson}.`);
        }
      }
    }
    // visit time
    const v = l.visitMinutes;
    if (!v || typeof v.value !== 'number' || v.value <= 0) add('error', 'VISIT_INVALID', `${base}.visitMinutes`, '"visitMinutes.value" must be a positive number.');
    else checkRecord(v, `${base}.visitMinutes`, { important: false });
    // facts
    const ids = new Set();
    for (const f of l.facts ?? []) {
      const where = `${base}.facts.${f.id ?? '?'}`;
      if (!f.id) add('error', 'FACT_ID', where, 'Fact needs an "id".');
      else if (ids.has(f.id)) add('error', 'FACT_ID', where, 'Duplicate fact id.');
      ids.add(f.id);
      if (!f.label || !f.value) add('error', 'FACT_TEXT', where, 'Fact needs "label" and "value".');
      checkRecord(f, where, { important: IMPORTANT.includes(f.type) });
    }
  }

  // --- fares
  const fares = data.fares;
  if (fares) {
    const fr = { status: 'verified', ...fares };
    checkRecord(fr, 'fares', { important: true });
    if (!['online', 'driver'].includes(fares.gameColumn)) add('error', 'FARE_COLUMN', 'fares.gameColumn', '"gameColumn" must be "online" or "driver".');
    const seen = new Set();
    for (const [i, pr] of (fares.pairs ?? []).entries()) {
      const where = `fares.pairs[${i}]`;
      const key = [...(pr.between ?? [])].sort().join('|');
      if ((pr.between ?? []).length !== 2) add('error', 'FARE_PAIR', where, '"between" must list two municipalities.');
      if (seen.has(key)) add('error', 'FARE_PAIR', where, `Duplicate fare for ${key}.`);
      seen.add(key);
      for (const k of ['online', 'driver']) {
        if (typeof pr[k] !== 'number' || pr[k] <= 0) add('error', 'FARE_PRICE', where, `"${k}" must be a positive per-person price in EUR.`);
      }
      if (typeof pr.validityMinutes !== 'number') add('error', 'FARE_PRICE', where, '"validityMinutes" is required.');
    }
  }

  for (const id of Object.keys(sources)) {
    if (!used.has(id)) add('warning', 'SOURCE_UNUSED', `sources.${id}`, 'Source is not referenced by any item.');
  }

  return {
    issues,
    errors: issues.filter((i) => i.level === 'error'),
    warnings: issues.filter((i) => i.level === 'warning'),
  };
}
