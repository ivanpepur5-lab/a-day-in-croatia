import Media from '../components/Media.jsx';
import { formatDuration, formatEuro, formatClock, parseClock } from '../../engine/itinerary.js';
import { describeRequirement } from '../../engine/requirements.js';
import { CATEGORIES } from '../../data/locations.js';

export default function IntroScreen({ daily, hasPlayed, onStart, onViewResult, onHelp }) {
  const { challenge, number } = daily;
  const start = parseClock(challenge.startTime);
  const dateLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  return (
    <main className="screen intro">
      <section className="intro__hero">
        <Media artId="split-hero" className="intro__art" label="Illustration of Split’s waterfront" />
        <div className="intro__heroText">
          <p className="eyebrow eyebrow--light">
            Daily challenge #{number} · {dateLabel}
          </p>
          <h1 className="intro__title">
            A Day in <em>{challenge.region}</em>
          </h1>
          <p className="intro__subtitle">{challenge.title}</p>
        </div>
      </section>

      <section className="intro__card rise">
        <p className="intro__brief">{challenge.brief}</p>

        <ul className="stats" aria-label="Mission constraints">
          <li>
            <span className="stats__k">Time</span>
            <span className="stats__v">{formatDuration(challenge.availableMinutes)}</span>
            <span className="stats__s">
              {formatClock(start)}–{formatClock(start + challenge.availableMinutes)}
            </span>
          </li>
          <li>
            <span className="stats__k">Budget</span>
            <span className="stats__v">{formatEuro(challenge.budget)}</span>
            <span className="stats__s">for {challenge.partySize} people</span>
          </li>
          <li>
            <span className="stats__k">Transport</span>
            <span className="stats__v">On foot & bus</span>
            <span className="stats__s">{challenge.transport}</span>
          </li>
          <li>
            <span className="stats__k">Plan</span>
            <span className="stats__v">
              {challenge.picks} of {challenge.cardIds.length}
            </span>
            <span className="stats__s">experiences</span>
          </li>
        </ul>

        <div className="mission">
          <h2 className="mission__title">Mission requirements</h2>
          <ul className="mission__list">
            {challenge.requirements.map((r) => (
              <li key={r.id}>
                <span className="mission__icon" aria-hidden="true">
                  {CATEGORIES[r.category]?.emoji}
                </span>
                {describeRequirement(r)}
              </li>
            ))}
          </ul>
        </div>

        <div className="intro__actions">
          {hasPlayed ? (
            <>
              <button type="button" className="btn btn--primary btn--block" onClick={onViewResult}>
                View today’s result
              </button>
              <button type="button" className="btn btn--ghost btn--block" onClick={onStart}>
                Practice this challenge
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--primary btn--block btn--lg" onClick={onStart} data-testid="start">
              Plan my day
            </button>
          )}
          <button type="button" className="btn btn--link" onClick={onHelp}>
            How to play & scoring
          </button>
        </div>
        <p className="fineprint">
          Start and finish at {challenge.hub.name}. All times and prices are illustrative estimates.
        </p>
      </section>
    </main>
  );
}
