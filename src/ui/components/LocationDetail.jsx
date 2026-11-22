import Media from './Media.jsx';
import { CATEGORIES } from '../../data/locations.js';
import { formatDuration, formatEuro } from '../../engine/itinerary.js';
import { estimateLeg, MODE_LABELS } from '../../engine/travel.js';

export default function LocationDetail({ location, hub, selected, canAdd, onToggle }) {
  const fromHub = estimateLeg(hub.coords, location.coords);
  return (
    <div className="detail">
      <Media location={location} className="detail__media" label={location.name} />
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
        </div>
        <div>
          <dt>Cost per person</dt>
          <dd>{location.costPerPerson === 0 ? 'Free' : formatEuro(location.costPerPerson)}</dd>
        </div>
        <div>
          <dt>From {hub.short}</dt>
          <dd>
            {MODE_LABELS[fromHub.mode].emoji} {formatDuration(fromHub.minutes)}
          </dd>
        </div>
      </dl>
      <p className="detail__note">
        {location.costNote} · illustrative values, not verified prices or opening hours.
      </p>
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
