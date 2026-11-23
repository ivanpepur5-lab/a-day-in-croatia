import { describe, it, expect } from 'vitest';
import TRAVEL from '../src/data/travel-data.json' with { type: 'json' };
import { auditTravelData } from '../src/data/audit.js';
import { displayState, daysBetweenKeys } from '../src/data/verification.js';
import { LOCATIONS } from '../src/data/locations.js';
import { CHALLENGES } from '../src/data/challenges.js';
import { analyzeChallenge } from '../src/engine/analysis.js';

const clone = () => JSON.parse(JSON.stringify(TRAVEL));
const codes = (r) => r.issues.map((i) => i.code);
const TODAY = '2026-11-23';
const ids = LOCATIONS.map((l) => l.id);

describe('travel data audit — current data', () => {
  it('has no errors', () => {
    const r = auditTravelData(TRAVEL, { today: TODAY, locationIds: ids });
    expect(r.errors).toEqual([]);
  });

  it('keeps game values and scores unchanged by the data move', () => {
    const expected = {
      'diocletians-palace': [90, 12], marjan: [90, 0], bacvice: [90, 0], salona: [75, 8],
      klis: [60, 10], trogir: [90, 7], omis: [150, 30], krka: [180, 30],
    };
    for (const l of LOCATIONS) expect([l.durationMin, l.costPerPerson]).toEqual(expected[l.id]);
    expect(CHALLENGES.map((c) => analyzeChallenge(c).maxTotal)).toEqual([98, 96, 94]);
  });

  it('every important travel fact links to a source (verified) or to where to check it', () => {
    for (const [lid, l] of Object.entries(TRAVEL.locations)) {
      for (const f of l.facts.filter((x) => ['price', 'hours', 'transport', 'access'].includes(x.type))) {
        const linked = f.status === 'verified' ? Boolean(f.source) : (f.checkAt ?? []).length > 0;
        expect(linked, `${lid}.${f.id}`).toBe(true);
      }
      const p = l.price;
      expect(p.status === 'verified' ? Boolean(p.source && p.verifiedOn) : (p.checkAt ?? []).length > 0, `${lid}.price`).toBe(true);
    }
  });
});

describe('travel data audit — detects problems', () => {
  it('missing source on a verified fact', () => {
    const d = clone();
    delete d.locations.salona.facts[0].source;
    expect(codes(auditTravelData(d, { today: TODAY }))).toContain('SOURCE_MISSING');
  });
  it('unknown source id', () => {
    const d = clone();
    d.locations.salona.facts[0].source = 'does-not-exist';
    expect(codes(auditTravelData(d, { today: TODAY }))).toContain('SOURCE_UNKNOWN');
  });
  it('non-https source URL', () => {
    const d = clone();
    d.sources['armus-prices'].url = 'http://www.armus.hr/';
    expect(codes(auditTravelData(d, { today: TODAY }))).toContain('SOURCE_URL');
  });
  it('missing, malformed and future verification dates', () => {
    const d = clone();
    delete d.locations.salona.facts[0].verifiedOn;
    d.locations.salona.facts[1].verifiedOn = '23.11.2026';
    d.locations.trogir.facts[0].verifiedOn = '2027-01-01';
    const c = codes(auditTravelData(d, { today: TODAY }));
    expect(c).toEqual(expect.arrayContaining(['DATE_MISSING', 'DATE_FORMAT', 'DATE_FUTURE']));
  });
  it('unverified or estimated travel info without "checkAt"', () => {
    const d = clone();
    delete d.locations.klis.facts.find((f) => f.id === 'opening-hours').checkAt;
    delete d.locations.klis.price.checkAt;
    const r = auditTravelData(d, { today: TODAY });
    expect(r.errors.filter((e) => e.code === 'CHECK_MISSING').length).toBe(2);
  });
  it('an estimate dressed up as verified (no backing fact)', () => {
    const d = clone();
    d.locations.klis.price.status = 'verified';
    d.locations.klis.price.source = 'klis-fortress-site';
    d.locations.klis.price.verifiedOn = TODAY;
    delete d.locations.klis.price.checkAt;
    expect(codes(auditTravelData(d, { today: TODAY }))).toContain('PRICE_UNBACKED');
  });
  it('a verified price that no longer matches its fact', () => {
    const d = clone();
    d.locations.trogir.price.perPerson = 9;
    expect(codes(auditTravelData(d, { today: TODAY }))).toContain('PRICE_UNBACKED');
  });
  it('outdated verification dates (older than the review window)', () => {
    const r = auditTravelData(TRAVEL, { today: '2027-06-30' }); // ~219 days after the audit
    expect(r.warnings.some((w) => w.code === 'STALE')).toBe(true);
    expect(r.errors).toEqual([]);
  });
  it('expired validity periods (Krka 2026 price list after 31 Dec 2026)', () => {
    const r = auditTravelData(TRAVEL, { today: '2027-01-02' });
    const expired = r.warnings.filter((w) => w.code === 'EXPIRED').map((w) => w.where);
    expect(expired.some((w) => w.startsWith('locations.krka'))).toBe(true);
  });
  it('validity ending soon', () => {
    const r = auditTravelData(TRAVEL, { today: '2026-12-10' });
    expect(r.warnings.some((w) => w.code === 'EXPIRES_SOON' && w.where.startsWith('locations.krka'))).toBe(true);
  });
  it('bad fares and duplicate pairs', () => {
    const d = clone();
    d.fares.pairs[0].online = 0;
    d.fares.pairs.push({ ...d.fares.pairs[1] });
    const c = codes(auditTravelData(d, { today: TODAY }));
    expect(c).toEqual(expect.arrayContaining(['FARE_PRICE', 'FARE_PAIR']));
  });
  it('a game location with no travel data', () => {
    const d = clone();
    delete d.locations.omis;
    expect(codes(auditTravelData(d, { today: TODAY, locationIds: ids }))).toContain('LOCATION_MISSING');
  });
  it('a "source" on an unverified item', () => {
    const d = clone();
    d.locations.krka.facts.find((f) => f.id === 'opening-hours').source = 'krka-site';
    expect(codes(auditTravelData(d, { today: TODAY }))).toContain('SOURCE_ON_UNVERIFIED');
  });
});

describe('display state', () => {
  const opts = (today) => ({ today, defaultReviewDays: 180 });
  it('verified within the window, stale after it or after validUntil', () => {
    const rec = { status: 'verified', verifiedOn: '2026-11-23' };
    expect(displayState(rec, opts('2026-12-01')).state).toBe('verified');
    expect(displayState(rec, opts('2027-06-01')).state).toBe('stale');
    expect(displayState({ ...rec, validUntil: '2026-12-31' }, opts('2027-01-01')).state).toBe('stale');
    expect(displayState({ ...rec, reviewDays: 30 }, opts('2027-01-01')).state).toBe('stale');
  });
  it('passes estimates and unverified items through', () => {
    expect(displayState({ status: 'estimate' }, opts(TODAY)).state).toBe('estimate');
    expect(displayState({ status: 'unverified' }, opts(TODAY)).state).toBe('unverified');
  });
  it('counts days across years', () => {
    expect(daysBetweenKeys('2026-12-31', '2027-01-01')).toBe(1);
  });
});
