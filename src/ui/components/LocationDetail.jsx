import Media from './Media.jsx';
import { CATEGORIES } from '../../data/locations.js';
import { creditLine } from '../../data/photos.js';
import { formatDuration, formatEuro } from '../../engine/itinerary.js';
import { estimateLeg, MODE_LABELS } from '../../engine/travel.js';

const STATUS_LABEL = { verified: 'Verified', unverified: 'Unverified', estimate: 'Estimate' };

function formatDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function LocationDetail({ location, hub, selected, canAdd, onToggle }) {
  const fromHub = estimateLeg(hub.coords, location.coords);
  const costVerified = location.costStatus === 'verified';
  return (
    <div className="detail">
      <Media location={location} className="detail__media" label={location.photo?.alt ?? location.name} />
      {location.photo && (
        <p className="detail__credit">
          <a href={location.photo.sourceUrl} target="_blank" rel="noopener noreferrer">
            {creditLine(location.photo)}
          </a>{' '}
          · via Wikimedia Commons
        </p>
      )}
      <div className="detail__chips">
        {location.tags.map((t) => (
          <span key={t} className={`chip cat-${t}`}>
            {CATEGORIES[t].emoji} {CATEGORIES[t].label}
          </span>
        ))}
      </div>
      <p className="detail__tagline">{location.tagline}</p>
      <p className="detail__desc">{location.description}</p>
      <dl className="detail__facts">
        <div>
          <dt>Time on site</dt>
          <dd>{formatDuration(location.durationMin)}</dd>
          <dd className="detail__status">estimate</dd>
        </div>
        <div>
          <dt>Cost per person</dt>
          <dd>{location.costPerPerson === 0 ? 'Free' : formatEuro(location.costPerPerson)}</dd>
          <dd className={`detail__status ${costVerified ? 'is-ok' : ''}`}>{costVerified ? 'verified' : 'estimate'}</dd>
        </div>
        <div>
          <dt>From {hub.short}</dt>
          <dd>
            {MODE_LABELS[fromHub.mode].emoji} {formatDuration(fromHub.minutes)}
          </dd>
          <dd className="detail__status">estimate</dd>
        </div>
      </dl>

      <section className="facts" aria-label="Facts and sources">
        <h3 className="facts__title">Facts & sources</h3>
        <ul className="facts__list">
          {location.facts.map((f) => (
            <li key={f.field} className={`fact fact--${f.status}`} data-status={f.status}>
              <div className="fact__head">
                <span className="fact__field">{f.field}</span>
                <span className={`badge badge--${f.status}`}>{STATUS_LABEL[f.status]}</span>
              </div>
              <p className="fact__value">{f.value}</p>
              {f.status === 'verified' && f.source && (
                <p className="fact__src">
                  Source:{' '}
                  <a href={f.source.url} target="_blank" rel="noopener noreferrer">
                    {f.source.label}
                  </a>{' '}
                  · checked {formatDate(f.verifiedOn)}
                </p>
              )}
              {f.status === 'unverified' && f.toVerify?.length > 0 && (
                <p className="fact__src">
                  Check:{' '}
                  {f.toVerify.map((s, i) => (
                    <span key={s.url}>
                      {i > 0 && ' · '}
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </span>
                  ))}
                </p>
              )}
              {f.note && <p className="fact__note">{f.note}</p>}
            </li>
          ))}
        </ul>
        <p className="detail__note">
          Last reviewed {formatDate(location.lastReviewed)}. Prices and opening hours change — check the official source
          before you travel.
        </p>
      </section>

      <button
        type="button"
        className={`btn ${selected ? 'btn--ghost' : 'btn--primary'} btn--block`}
        onClick={() => onToggle(location.id)}
        disabled={!selected && !canAdd}
      >
        {selected ? 'Remove from my day' : canAdd ? 'Add to my day' : 'Your day is full — remove one first'}
      </button>
    </div>
  );
}
