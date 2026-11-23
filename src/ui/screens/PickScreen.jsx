import { useMemo, useState } from 'react';
import ExperienceCard from '../components/ExperienceCard.jsx';
import LocationDetail from '../components/LocationDetail.jsx';
import Sheet from '../components/Sheet.jsx';
import Media from '../components/Media.jsx';
import { getLocation } from '../../data/locations.js';
import { buildItinerary, formatDuration, formatEuro } from '../../engine/itinerary.js';

export default function PickScreen({ challenge, selection, lastToggle, onToggle, onNext, onBack }) {
  const [detail, setDetail] = useState(null);
  const itinerary = useMemo(() => buildItinerary(challenge, selection), [challenge, selection]);
  const full = selection.length === challenge.picks;
  const shakeId = lastToggle?.status === 'full' ? lastToggle.id : null;
  const { totals, constraints } = itinerary;

  return (
    <main className="screen pick">
      <header className="stephead">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back to mission">
          ←
        </button>
        <div>
          <p className="eyebrow">Step 1 of 2</p>
          <h1 className="stephead__title">Choose {challenge.picks} experiences</h1>
        </div>
      </header>

      <div className="grid" role="list">
        {challenge.cardIds.map((id, i) => {
          const loc = getLocation(id);
          return (
            <div role="listitem" key={id} className="grid__item" style={{ '--i': i }}>
              <ExperienceCard
                location={loc}
                order={selection.indexOf(id) + 1}
                onToggle={onToggle}
                onInfo={setDetail}
                shake={shakeId === id}
                key={shakeId === id ? lastToggle.at : id}
              />
            </div>
          );
        })}
      </div>

      <div className="dock" aria-live="polite">
        <div className="dock__inner">
          <div className="dock__slots">
            {Array.from({ length: challenge.picks }, (_, i) => {
              const id = selection[i];
              return (
                <button
                  type="button"
                  key={i}
                  className={`slot ${id ? 'is-filled' : ''}`}
                  onClick={() => id && onToggle(id)}
                  aria-label={id ? `Remove ${getLocation(id).name}` : `Empty slot ${i + 1}`}
                  disabled={!id}
                >
                  {id ? <Media location={getLocation(id)} className="slot__media" variant="thumb" /> : <span>{i + 1}</span>}
                </button>
              );
            })}
          </div>
          <div className="dock__summary">
            <span className={constraints.timeOk ? '' : 'is-bad'}>
              ⏱ {formatDuration(totals.totalMinutes)}
              <small> / {formatDuration(challenge.availableMinutes)}</small>
            </span>
            <span className={constraints.budgetOk ? '' : 'is-bad'}>
              💶 {formatEuro(totals.totalCost)}
              <small> / {formatEuro(challenge.budget)}</small>
            </span>
          </div>
          <button
            type="button"
            className="btn btn--primary dock__cta"
            disabled={!full}
            onClick={onNext}
            data-testid="to-arrange"
          >
            {full ? 'Arrange →' : `${selection.length}/${challenge.picks}`}
          </button>
        </div>
        {shakeId && (
          <p className="dock__toast" role="status" key={lastToggle.at}>
            Your day is full — tap a chosen card to swap it out.
          </p>
        )}
      </div>

      <Sheet open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.name}>
        {detail && (
          <LocationDetail
            location={detail}
            hub={challenge.hub}
            selected={selection.includes(detail.id)}
            canAdd={!full}
            onToggle={(id) => {
              onToggle(id);
              setDetail(null);
            }}
          />
        )}
      </Sheet>
    </main>
  );
}
