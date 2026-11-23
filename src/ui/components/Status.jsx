import { displayState, formatCheckDate, STATE_LABEL } from '../../data/verification.js';
import { DEFAULT_REVIEW_DAYS } from '../../data/locations.js';
import { formatEuro } from '../../engine/itinerary.js';
import { dateKey } from '../../engine/daily.js';

/**
 * One visual language for data quality, used everywhere:
 *   ✓ Verified (green, with date + source) · ⚠ Needs re-check (amber)
 *   ? Unverified (orange)                   · ≈ Estimate (grey, never an official price)
 */

/** Today's puzzle-day date, so staleness flips at the same moment for everyone. */
export const todayKey = () => dateKey(new Date());

export function stateOf(rec, today = todayKey()) {
  return displayState(rec ?? { status: 'estimate' }, { today, defaultReviewDays: DEFAULT_REVIEW_DAYS });
}

const ICON = { verified: '✓', stale: '⚠', unverified: '?', estimate: '≈' };
const SHORT = { verified: 'Verified', stale: 'Re-check', unverified: 'Unverified', estimate: 'Estimate' };

export function StatusBadge({ rec, today, compact = false }) {
  const st = stateOf(rec, today);
  const date = rec?.verifiedOn ? formatCheckDate(rec.verifiedOn) : '';
  const title =
    st.state === 'verified'
      ? `Verified on an official source on ${date}`
      : st.state === 'stale'
        ? `Verified ${date}, but ${st.reason} — please re-check`
        : st.state === 'unverified'
          ? 'Not yet confirmed on an official source'
          : 'Game estimate — not an official value';
  return (
    <span className={`badge badge--${st.state}`} title={title} data-state={st.state}>
      <span aria-hidden="true">{ICON[st.state]}</span> {compact ? SHORT[st.state] : STATE_LABEL[st.state]}
      {!compact && (st.state === 'verified' || st.state === 'stale') && date ? ` · ${date}` : ''}
    </span>
  );
}

/**
 * A price that can never pass as official unless it is verified.
 * verified → "€8 pp ✓" · stale → "€8 pp ⚠" · estimate → "≈€12 pp est." / "Free est."
 */
export function PriceTag({ rec, amount, suffix = ' pp', today, testId }) {
  const st = stateOf(rec, today);
  const official = st.state === 'verified' || st.state === 'stale';
  const value = amount === 0 ? 'Free' : `${official ? '' : '≈'}${formatEuro(amount)}${suffix}`;
  const date = rec?.verifiedOn ? formatCheckDate(rec.verifiedOn) : '';
  const title = official
    ? `Official price${rec?.source ? ` — ${rec.source.label}` : ''}, checked ${date}${st.state === 'stale' ? ' (needs re-check)' : ''}`
    : 'Estimated — not an official price';
  return (
    <span className={`price price--${st.state}`} title={title} data-state={st.state} data-testid={testId}>
      {value}
      <span className={`tag ${st.state === 'verified' ? 'tag--ok' : st.state === 'stale' ? 'tag--stale' : ''}`}>
        {st.state === 'verified' ? '✓' : st.state === 'stale' ? '⚠' : 'est.'}
      </span>
    </span>
  );
}

/** Small legend explaining the four states. */
export function DataLegend() {
  return (
    <ul className="legend" aria-label="What the labels mean">
      <li>
        <span className="badge badge--verified">✓ Verified</span> checked on an official source (date shown)
      </li>
      <li>
        <span className="badge badge--stale">⚠ Needs re-check</span> verified, but the check is old or the price list expired
      </li>
      <li>
        <span className="badge badge--unverified">? Unverified</span> not yet confirmed — check the linked source
      </li>
      <li>
        <span className="badge badge--estimate">≈ Estimate</span> a game value, never an official price
      </li>
    </ul>
  );
}
