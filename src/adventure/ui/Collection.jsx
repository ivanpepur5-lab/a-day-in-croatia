import { useState } from 'react';
import TipCard from './TipCard.jsx';
import { TIPS, TIP_CATEGORIES } from '../data/tips.js';
import { ACHIEVEMENTS, ENDINGS } from '../data/story.js';

/** The collectible album: tips by category, achievements and endings discovered. */
export default function Collection({ progress, onBack }) {
  const [cat, setCat] = useState('all');
  const have = new Set(progress.tips);
  const list = TIPS.filter((t) => cat === 'all' || t.category === cat);
  const pct = Math.round((have.size / TIPS.length) * 100);
  return (
    <main className="adv-coll" data-testid="adv-collection-screen">
      <header className="adv-coll__head">
        <h1 className="adv-scene__title">Local tip collection</h1>
        <p className="adv-small">
          {have.size} of {TIPS.length} real-world tips collected · {progress.runs} holidays played · best score {progress.best}
        </p>
        <div className="adv-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </header>

      <nav className="adv-cats" aria-label="Tip categories">
        <button type="button" className={cat === 'all' ? 'is-on' : ''} onClick={() => setCat('all')}>
          All
        </button>
        {Object.values(TIP_CATEGORIES).map((c) => {
          const n = TIPS.filter((t) => t.category === c.id);
          const got = n.filter((t) => have.has(t.id)).length;
          return (
            <button key={c.id} type="button" className={cat === c.id ? 'is-on' : ''} onClick={() => setCat(c.id)}>
              {c.emoji} {c.label} <small>
                {got}/{n.length}
              </small>
            </button>
          );
        })}
      </nav>

      <div className="adv-tipgrid adv-tipgrid--album">
        {list.map((t) => (
          <TipCard key={t.id} tip={t} locked={!have.has(t.id)} compact />
        ))}
      </div>

      <section className="adv-card">
        <h2 className="adv-h2">Achievements</h2>
        <ul className="adv-achs">
          {ACHIEVEMENTS.map((a) => {
            const on = progress.achievements.includes(a.id);
            return (
              <li key={a.id} className={on ? 'is-on' : ''}>
                <span className="adv-achs__e" aria-hidden="true">
                  {on ? a.emoji : '🔒'}
                </span>
                <span>
                  <b>{a.title}</b>
                  <small>{a.description}</small>
                </span>
              </li>
            );
          })}
        </ul>
        <h2 className="adv-h2">Endings discovered · {progress.endings.length}/{ENDINGS.length}</h2>
        <ul className="adv-endings">
          {ENDINGS.map((e) => (
            <li key={e.id} className={progress.endings.includes(e.id) ? 'is-on' : ''}>
              <span aria-hidden="true">{progress.endings.includes(e.id) ? e.emoji : '❔'}</span>
              {progress.endings.includes(e.id) ? e.title : 'Undiscovered ending'}
            </li>
          ))}
        </ul>
      </section>
      <button type="button" className="btn btn--ghost btn--block" onClick={onBack}>
        Back
      </button>
    </main>
  );
}
