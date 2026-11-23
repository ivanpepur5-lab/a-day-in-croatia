import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { LOCATIONS, AUDIT_DATE } from '../src/data/locations.js';
import { PHOTOS } from '../src/data/photos.js';
import { sanitizeSiteUrl } from '../src/config.js';
import { buildShareText } from '../src/engine/share.js';
import { scorePlan } from '../src/engine/scoring.js';
import { CHALLENGES_BY_ID } from '../src/data/challenges.js';

const publicDir = `${resolve(process.cwd(), 'public')}/`;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('location data audit', () => {
  it('tags every fact as verified, unverified or estimate', () => {
    for (const l of LOCATIONS) {
      expect(l.lastReviewed).toMatch(DATE);
      expect(l.facts.length).toBeGreaterThan(0);
      for (const f of l.facts) {
        expect(['verified', 'unverified', 'estimate']).toContain(f.status);
        expect(f.field && f.value).toBeTruthy();
      }
    }
  });

  it('gives every verified fact an https source URL and a verification date', () => {
    for (const l of LOCATIONS) {
      for (const f of l.facts.filter((x) => x.status === 'verified')) {
        expect(f.source.url).toMatch(/^https:\/\//);
        expect(f.source.label.length).toBeGreaterThan(3);
        expect(f.verifiedOn).toMatch(DATE);
        expect(f.verifiedOn <= AUDIT_DATE).toBe(true);
      }
    }
  });

  it('gives every unverified fact somewhere to verify it', () => {
    for (const l of LOCATIONS) {
      for (const f of l.facts.filter((x) => x.status === 'unverified')) {
        expect(f.toVerify.length).toBeGreaterThan(0);
        f.toVerify.forEach((s) => expect(s.url).toMatch(/^https:\/\//));
      }
    }
  });

  it('only calls a price verified when a verified fact backs it', () => {
    for (const l of LOCATIONS) {
      expect(['verified', 'estimate']).toContain(l.costStatus);
      if (l.costStatus === 'verified') {
        const backed = l.facts.some((f) => f.status === 'verified' && f.value.includes(`€${l.costPerPerson}`));
        expect(backed).toBe(true);
      }
    }
  });

  it('labels visit times as estimates for every location', () => {
    for (const l of LOCATIONS) {
      expect(l.visit.status).toBe('estimate');
      expect(l.visit.value).toBe(l.durationMin);
    }
  });
});

describe('photography', () => {
  it('has a licensed, attributed photo for every location and the hero', () => {
    for (const id of ['split-hero', 'hvar', 'brac', 'dubrovnik', ...LOCATIONS.map((l) => l.id)]) {
      const p = PHOTOS[id];
      expect(p, id).toBeTruthy();
      expect(p.author.length).toBeGreaterThan(1);
      expect(['CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY 2.0', 'CC BY 4.0', 'CC0', 'Public domain']).toContain(p.license);
      expect(p.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(p.alt.length).toBeGreaterThan(5);
      expect(existsSync(`${publicDir}${p.src}`), p.src).toBe(true);
      expect(existsSync(`${publicDir}${p.thumb}`), p.thumb).toBe(true);
      expect(existsSync(`${publicDir}${p.src.replace('.jpg', '.webp')}`), 'webp').toBe(true);
      expect(existsSync(`${publicDir}${p.thumb.replace('.jpg', '.webp')}`), 'webp thumb').toBe(true);
    }
    for (const l of LOCATIONS) expect(l.photo).toBe(PHOTOS[l.id]);
  });
});

describe('production URL configuration', () => {
  it('rejects local, non-https and malformed URLs', () => {
    for (const bad of [
      '',
      undefined,
      'http://localhost:4179',
      'https://localhost:4179',
      'https://127.0.0.1',
      'https://0.0.0.0:8080',
      'http://example.com',
      'https://myapp.local',
      'https://intranet',
      'not a url',
    ]) {
      expect(sanitizeSiteUrl(bad)).toBe('');
    }
  });
  it('keeps only the origin of a valid https URL', () => {
    expect(sanitizeSiteUrl('https://adayincroatia.com/play?x=1')).toBe('https://adayincroatia.com');
    expect(sanitizeSiteUrl('https://a-day-in-croatia.netlify.app/')).toBe('https://a-day-in-croatia.netlify.app');
  });
  it('share text never contains a local URL and omits the link when none is configured', () => {
    const c = CHALLENGES_BY_ID['split-classic'];
    const result = scorePlan(c, ['diocletians-palace', 'bacvice', 'salona', 'marjan']);
    const none = buildShareText({ number: 3, challenge: c, result, url: sanitizeSiteUrl('http://localhost:4179') });
    expect(none).not.toMatch(/localhost|127\.0\.0\.1|http/);
    const prod = buildShareText({ number: 3, challenge: c, result, url: 'https://adayincroatia.com' });
    expect(prod.trim().endsWith('https://adayincroatia.com')).toBe(true);
  });
});
