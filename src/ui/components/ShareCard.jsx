import { CATEGORIES } from '../../data/locations.js';

/** On-screen preview of the shareable result card (mirrors the PNG). */
export default function ShareCard({ number, challenge, result, dateLabel }) {
  return (
    <div className="sharecard" data-testid="share-card">
      <div className="sharecard__glow" aria-hidden="true" />
      <p className="sharecard__brand">A DAY IN CROATIA</p>
      <p className="sharecard__meta">
        #{number} · {challenge.region} · {dateLabel}
      </p>
      <p className="sharecard__title">{challenge.title}</p>
      <p className="sharecard__score">
        {result.total}
        <span>/100</span>
      </p>
      <p className="sharecard__rating">{result.rating.title}</p>
      <ul className="sharecard__bars">
        {result.components.map((c) => (
          <li key={c.id}>
            <span>{c.label.split(' ')[0]}</span>
            <span className="sharecard__track">
              <span style={{ width: `${(c.points / c.max) * 100}%` }} />
            </span>
            <span>
              {c.points}/{c.max}
            </span>
          </li>
        ))}
      </ul>
      <p className="sharecard__route" aria-label="Route by category">
        {result.itinerary.stops.map((s) => CATEGORIES[s.location.category].emoji).join(' → ')}
      </p>
    </div>
  );
}
