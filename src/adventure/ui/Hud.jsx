import { DESTINATIONS } from '../data/story.js';

const TIME = { base: 'Departure', travel: 'Morning', activity: 'Afternoon', event: 'Evening', ended: 'Home' };
const face = (h) => (h >= 80 ? '😄' : h >= 60 ? '🙂' : h >= 40 ? '😐' : h >= 25 ? '😕' : '😫');

function Bar({ value, tone, label }) {
  return (
    <span className={`hudbar hudbar--${tone} ${value < 25 ? 'is-low' : ''}`} role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ transform: `scaleX(${value / 100})` }} />
    </span>
  );
}

/** Persistent player stats, always visible during a run. */
export default function Hud({ state, pulse = {} }) {
  const all = Object.keys(DESTINATIONS);
  return (
    <div className="hud" data-testid="hud">
      <div className="hud__row">
        <span className="hud__day" data-testid="hud-day">
          {state.day === 0 ? 'Day 0' : `Day ${state.day}/5`} · {TIME[state.phase]}
        </span>
        <span className={`hud__money ${pulse.money ? (pulse.money > 0 ? 'up' : 'down') : ''}`} data-testid="hud-money" title="In-game money (fictional amounts)">
          €{Math.round(state.money)}
        </span>
      </div>
      <div className="hud__row hud__row--bars">
        <span className={`hud__stat ${pulse.energy ? (pulse.energy > 0 ? 'up' : 'down') : ''}`}>
          <span aria-hidden="true">⚡</span>
          <Bar value={state.energy} tone="energy" label="Energy" />
          <b data-testid="hud-energy">{state.energy}</b>
        </span>
        <span className={`hud__stat ${pulse.happiness ? (pulse.happiness > 0 ? 'up' : 'down') : ''}`}>
          <span aria-hidden="true">{face(state.happiness)}</span>
          <Bar value={state.happiness} tone="happy" label="Happiness" />
          <b data-testid="hud-happiness">{state.happiness}</b>
        </span>
      </div>
      <div className="hud__row hud__row--small">
        <span title="Adventure points">★ {state.adventure}</span>
        <span title="Local insider points">🗝️ {state.local}</span>
        <span title="Local tips found this run">📇 {state.tipsFound.length}</span>
        <span className="hud__places" aria-label={`${state.visited.length} of ${all.length} destinations visited`} title="Destinations visited">
          {all.map((d) => (
            <i key={d} className={state.visited.includes(d) ? 'on' : ''} title={DESTINATIONS[d].name} />
          ))}
        </span>
      </div>
    </div>
  );
}
