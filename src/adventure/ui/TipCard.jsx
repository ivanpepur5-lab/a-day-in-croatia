import { TIP_CATEGORIES } from '../data/tips.js';
import { SOURCES } from '../../data/locations.js';
import { formatCheckDate } from '../../data/verification.js';
import { stateOf } from '../../ui/components/Status.jsx';

/**
 * A collectible Local Insider card. Real-world information only — visually
 * distinct from the (fictional) story text.
 */
export default function TipCard({ tip, isNew = false, locked = false, compact = false }) {
  const cat = TIP_CATEGORIES[tip.category];
  if (locked) {
    return (
      <article className={`tipcard tipcard--locked cat-tip-${tip.category}`} aria-label={`Locked ${cat.label} tip`}>
        <span className="tipcard__cat">
          <span aria-hidden="true">{cat.emoji}</span> {cat.label}
        </span>
        <p className="tipcard__q" aria-hidden="true">?</p>
        <p className="tipcard__lockedtext">Keep playing to discover this tip</p>
      </article>
    );
  }
  const v = tip.verification;
  const src = v.status === 'verified' ? SOURCES[v.source] : null;
  const st = v.status === 'verified' ? stateOf({ status: 'verified', verifiedOn: v.verifiedOn, validUntil: v.validUntil }).state : 'editorial';
  return (
    <article
      className={`tipcard cat-tip-${tip.category} ${isNew ? 'is-new' : ''} ${compact ? 'tipcard--compact' : ''}`}
      data-testid={`tip-${tip.id}`}
    >
      {isNew && <span className="tipcard__ribbon">New tip!</span>}
      <header className="tipcard__head">
        <span className="tipcard__cat">
          <span aria-hidden="true">{cat.emoji}</span> {cat.label}
        </span>
        <span className="tipcard__real">Real-world tip</span>
      </header>
      <h3 className="tipcard__title">{tip.title}</h3>
      <p className="tipcard__tip">{tip.tip}</p>
      {!compact && (
        <p className="tipcard__why">
          <strong>Why it matters:</strong> {tip.why}
        </p>
      )}
      <footer className="tipcard__foot">
        {v.status === 'verified' ? (
          <span className={`badge badge--${st}`} title="Checked on an official source">
            {st === 'stale' ? '⚠ Needs re-check' : '✓ Verified'} · {formatCheckDate(v.verifiedOn)}
            {src && (
              <>
                {' · '}
                <a href={src.url} target="_blank" rel="noopener noreferrer">
                  {src.publisher ?? 'source'}
                </a>
              </>
            )}
          </span>
        ) : (
          <span className="badge badge--editorial" title="General knowledge, reviewed by the editors; no prices or schedules">
            ✎ Editorial tip
          </span>
        )}
      </footer>
    </article>
  );
}
