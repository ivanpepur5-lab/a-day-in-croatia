import { describe, it, expect } from 'vitest';
import { CHALLENGES, CHALLENGES_BY_ID } from '../src/data/challenges.js';
import { analyzeChallenge, rankOf, ordinal } from '../src/engine/analysis.js';
import { allPlans, bestPlan } from '../src/engine/solver.js';
import { scorePlan } from '../src/engine/scoring.js';

describe('exhaustive analysis & exact rank', () => {
  for (const c of CHALLENGES) {
    describe(c.id, () => {
      const a = analyzeChallenge(c);
      const plans = allPlans(c);

      it('covers all 1,680 ordered plans exactly once', () => {
        expect(a.count).toBe(1680);
        expect(new Set(plans.map((p) => p.order.join('>'))).size).toBe(1680);
        let sum = 0;
        for (const n of a.histogram.values()) sum += n;
        expect(sum).toBe(1680);
      });

      it('max score, best plan and rank #1 agree', () => {
        const max = Math.max(...plans.map((p) => p.result.total));
        expect(a.maxTotal).toBe(max);
        expect(bestPlan(c).result.total).toBe(max);
        expect(a.best.result.total).toBe(max);
        expect(scorePlan(c, a.best.order).total).toBe(max);
        expect(rankOf(a, max).rank).toBe(1);
        expect(rankOf(a, max).isBest).toBe(true);
        expect(a.bestPlans.length).toBe(a.histogram.get(max));
        expect(rankOf(a, max).tiedWith).toBe(a.bestPlans.length - 1);
        expect(max).toBeLessThanOrEqual(100);
      });

      it('rank = 1 + number of strictly better plans, for every plan', () => {
        for (const p of plans) {
          const better = plans.filter((q) => q.result.total > p.result.total).length;
          const same = plans.filter((q) => q.result.total === p.result.total).length;
          const r = rankOf(a, p.result.total);
          expect(r.rank).toBe(better + 1);
          expect(r.tiedWith).toBe(same - 1);
          expect(r.count).toBe(1680);
        }
      });

      it('the worst plan ranks last among distinct scores', () => {
        const r = rankOf(a, a.minTotal);
        expect(r.rank + r.tiedWith).toBe(1680);
      });
    });
  }

  it('reports ties honestly (Emperors & Fortresses has several best plans)', () => {
    const a = analyzeChallenge(CHALLENGES_BY_ID['split-heritage']);
    expect(a.bestPlans.length).toBeGreaterThan(1);
    expect(rankOf(a, a.maxTotal).tiedWith).toBe(a.bestPlans.length - 1);
  });

  it('formats ordinals', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101, 111].map(ordinal)).toEqual([
      '1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '101st', '111th',
    ]);
  });
});
