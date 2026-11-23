import Media from './Media.jsx';
import { CATEGORIES } from '../../data/locations.js';
import { creditLine } from '../../data/photos.js';
import { formatDuration, formatEuro } from '../../engine/itinerary.js';
import { estimateLeg, MODE_LABELS } from '../../engine/travel.js';
import { officialFare, FARE_SOURCE } from '../../data/fares.js';
import { formatCheckDate } from '../../data/verification.js';
import { StatusBadge, PriceTag, DataLegend, stateOf } from './Status.jsx';

function SourceLine({ rec }) {
  const st = stateOf(rec);
  if ((st.state === 'verified' || st.state === 'stale') && rec.source) {
    return (
      <p className="fact__src">
        Source:{' '}
        <a href={rec.source.url} target="_blank" rel="noopener noreferrer">
          {rec.source.label}
        </a>{' '}
        · last verified {formatCheckDate(rec.verifiedOn)}
        {rec.validUntil ? ` · valid until ${formatCheckDate(rec.validUntil)}` : ''}
        {st.state === 'stale' && <strong className="fact__stale"> · needs re-check ({st.reason})</strong>}
      </p>
    );
  }
  if (rec.toVerify?.length) {
    return (
      <p className="fact__src">
        {st.state === 'estimate' ? 'Official value to check at: ' : 'Check: '}
        {rec.toVerify.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ' · '}
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </span>
        ))}
      </p>
    );
  }
  return null;
}

export default function LocationDetail({ location, hub, selected, canAdd, onToggle }) {
  const fromHub = estimateLeg(hub.coords, location.coords);
  const fare = fromHub.mode === 'transit' ? officialFare(hub.id, location.id) : null;
  const fareRec = fare ? { status: 'verified', verifiedOn: FARE_SOURCE.verifiedOn, source: FARE_SOURCE } : { status: 'estimate' };
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
          <dd>≈{formatDuration(location.durationMin)}</dd>
          <dd>
            <StatusBadge rec={location.visit} compact />
          </dd>
        </div>
        <div data-testid="detail-price">
          <dt>Cost per person</dt>
          <dd>
            <PriceTag rec={location.price} amount={location.costPerPerson} suffix="" />
          </dd>
          <dd>
            <StatusBadge rec={location.price} compact />
          </dd>
        </div>
        <div>
          <dt>From {hub.short}</dt>
          <dd>
            {MODE_LABELS[fromHub.mode].emoji} ≈{formatDuration(fromHub.minutes)}
          </dd>
          <dd className="detail__status">
            {fromHub.mode === 'walk' ? (
              'walk · free'
            ) : (
              <PriceTag rec={fareRec} amount={fare ? fare.online : fromHub.costPerPerson} />
            )}
          </dd>
        </div>
      </dl>

      <div className={`pricebox pricebox--${stateOf(location.price).state}`}>
        <p className="pricebox__head">
          <strong>Price used in the game</strong> <StatusBadge rec={location.price} />
        </p>
        {location.costNote && <p className="fact__note">{location.costNote}</p>}
        <SourceLine rec={location.price} />
        {fromHub.mode === 'transit' && (
          <p className="fact__note">
            Bus from {hub.short}:{' '}
            {fare
              ? `${formatEuro(fare.online)} pp online / ticket office (${formatEuro(fare.driver)} from the driver) — official fare, last verified ${formatCheckDate(FARE_SOURCE.verifiedOn)}.`
              : `≈${formatEuro(fromHub.costPerPerson)} pp — estimated, no official fare for this journey.`}{' '}
            Travel time is an estimate.
          </p>
        )}
      </div>

      <section className="facts" aria-label="Facts and sources">
        <h3 className="facts__title">Facts & sources</h3>
        <ul className="facts__list">
          {location.facts.map((f) => {
            const st = stateOf(f);
            return (
              <li key={f.id ?? f.field} className={`fact fact--${st.state}`} data-status={st.state}>
                <div className="fact__head">
                  <span className="fact__field">{f.field}</span>
                  <StatusBadge rec={f} />
                </div>
                <p className="fact__value">{f.value}</p>
                <SourceLine rec={f} />
                {f.note && <p className="fact__note">{f.note}</p>}
              </li>
            );
          })}
        </ul>
        <DataLegend />
        <p className="detail__note">
          Prices and opening hours change — check the official source before you travel.
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
