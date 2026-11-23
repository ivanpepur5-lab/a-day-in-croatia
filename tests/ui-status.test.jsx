import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup, within } from '@testing-library/react';
import { PriceTag, StatusBadge } from '../src/ui/components/Status.jsx';
import ExperienceCard from '../src/ui/components/ExperienceCard.jsx';
import LocationDetail from '../src/ui/components/LocationDetail.jsx';
import { LOCATIONS, SPLIT_HUB } from '../src/data/locations.js';

afterEach(cleanup);
const SRC = { label: 'Official source', url: 'https://example.org/' };

describe('price display never passes an estimate off as official', () => {
  it('estimate → "≈" + "est.", no check mark', () => {
    const { container } = render(<PriceTag rec={{ status: 'estimate' }} amount={12} today="2026-11-23" />);
    expect(container.textContent).toBe('≈€12 ppest.');
    expect(container.textContent).not.toContain('✓');
  });
  it('free estimate still says "est."', () => {
    const { container } = render(<PriceTag rec={{ status: 'estimate' }} amount={0} today="2026-11-23" />);
    expect(container.textContent).toBe('Freeest.');
  });
  it('unverified is treated like an estimate', () => {
    const { container } = render(<PriceTag rec={{ status: 'unverified' }} amount={5} today="2026-11-23" />);
    expect(container.textContent).toContain('≈');
    expect(container.textContent).toContain('est.');
  });
  it('verified → plain price + ✓ and a dated source in the tooltip', () => {
    const { container } = render(
      <PriceTag rec={{ status: 'verified', verifiedOn: '2026-11-23', source: SRC }} amount={8} today="2026-11-24" />,
    );
    expect(container.textContent).toBe('€8 pp✓');
    expect(container.firstChild.getAttribute('title')).toMatch(/Official price — Official source, checked 23 Nov 2026/);
  });
  it('outdated verification → ⚠ "needs re-check"', () => {
    const rec = { status: 'verified', verifiedOn: '2026-01-01', source: SRC };
    const { container } = render(<PriceTag rec={rec} amount={8} today="2026-11-23" />);
    expect(container.textContent).toContain('⚠');
    const badge = render(<StatusBadge rec={rec} today="2026-11-23" />).container;
    expect(badge.textContent).toContain('Needs re-check · 1 Jan 2026');
  });
});

describe('every destination card labels its price correctly', () => {
  for (const l of LOCATIONS) {
    it(l.name, () => {
      const { getByTestId } = render(
        <ExperienceCard location={l} order={0} onToggle={() => {}} onInfo={() => {}} shake={false} />,
      );
      const price = getByTestId(`price-${l.id}`);
      if (l.costStatus === 'verified') {
        expect(price.textContent).toContain('✓');
        expect(price.textContent).not.toContain('≈');
      } else {
        expect(price.textContent).toContain('est.');
        expect(price.textContent).not.toContain('✓');
        if (l.costPerPerson > 0) expect(price.textContent).toContain('≈');
      }
    });
  }
});

describe('detail sheet shows sources and last-verified dates', () => {
  for (const l of LOCATIONS) {
    it(l.name, () => {
      const { container } = render(
        <LocationDetail location={l} hub={SPLIT_HUB} selected={false} canAdd onToggle={() => {}} />,
      );
      for (const li of container.querySelectorAll('.fact')) {
        const state = li.dataset.status;
        const src = li.querySelector('.fact__src');
        if (state === 'verified' || state === 'stale') {
          expect(src?.textContent).toMatch(/Source: .+ · last verified \d{1,2} \w{3} \d{4}/);
          expect(within(li).getAllByRole('link').length).toBeGreaterThan(0);
        }
        if (state === 'unverified') expect(src?.textContent).toMatch(/^Check: /);
      }
    });
  }
});
