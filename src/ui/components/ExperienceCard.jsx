import Media from './Media.jsx';
import { CATEGORIES } from '../../data/locations.js';
import { formatDuration, formatEuro } from '../../engine/itinerary.js';

/** Selectable destination card for the pick screen. */
export default function ExperienceCard({ location, order, onToggle, onInfo, shake }) {
  const selected = order > 0;
  const cat = CATEGORIES[location.category];
  return (
    <article
      className={`xcard cat-${location.category} ${selected ? 'is-selected' : ''} ${shake ? 'is-shaking' : ''}`}
      data-testid={`card-${location.id}`}
    >
      <button
        type="button"
        className="xcard__hit"
        onClick={() => onToggle(location.id)}
        aria-pressed={selected}
        aria-label={`${selected ? 'Remove' : 'Add'} ${location.name}`}
      />
      <Media location={location} className="xcard__media" />
      <span className="xcard__cat">
        <span aria-hidden="true">{cat.emoji}</span> {cat.label}
      </span>
      <span className="xcard__badge" aria-hidden={!selected}>
        {selected ? order : '+'}
      </span>
      <div className="xcard__body">
        <h3 className="xcard__name">{location.name}</h3>
        <p className="xcard__area">{location.area}</p>
        <dl className="xcard__meta">
          <div>
            <dt className="sr-only">Duration</dt>
            <dd>⏱ {formatDuration(location.durationMin)}</dd>
          </div>
          <div>
            <dt className="sr-only">Cost per person</dt>
            <dd>
              {location.costPerPerson === 0 ? 'Free' : `${formatEuro(location.costPerPerson)} pp`}
              {location.costStatus === 'verified' ? (
                <span className="tag tag--ok" title="Price verified on an official source">✓</span>
              ) : (
                <span className="tag" title="Game estimate — not a verified price">est.</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
      <button
        type="button"
        className="xcard__info"
        onClick={() => onInfo(location)}
        aria-label={`About ${location.name}`}
      >
        i
      </button>
    </article>
  );
}
