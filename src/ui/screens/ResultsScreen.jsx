import { useEffect, useMemo, useState } from 'react';
import ScoreRing from '../components/ScoreRing.jsx';
import RouteMap from '../components/RouteMap.jsx';
import { scorePlan } from '../../engine/scoring.js';
import { analyzeChallenge, rankOf } from '../../engine/analysis.js';
import { formatClock, formatDuration } from '../../engine/itinerary.js';
import { describeRequirement } from '../../engine/requirements.js';
import { buildShareText } from '../../engine/share.js';
import { msUntilNextPuzzle, formatPuzzleDate } from '../../engine/daily.js';
import { SITE_URL } from '../../config.js';
import { renderShareImage, shareImage, copyText, FORMATS } from '../../services/shareImage.js';
import { useNow, usePrefersReducedMotion } from '../hooks.js';
import { CATEGORIES } from '../../data/locations.js';

const ICONS = { time: '⏱️', budget: '💶', route: '🧭', mission: '🎯' };

function Countdown() {
  const now = useNow(1000);
  const ms = msUntilNextPuzzle(now);
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return (
    <span className="countdown" aria-label="Time until the next challenge">
      {hh}:{mm}:{ss}
    </span>
  );
}

function Breakdown({ component, delay }) {
  const reduced = usePrefersReducedMotion();
  const [grown, setGrown] = useState(reduced);
  useEffect(() => {
    if (reduced) return undefined;
    const t = setTimeout(() => setGrown(true), delay);
    return () => clearTimeout(t);
  }, [delay, reduced]);
  const pct = (component.points / component.max) * 100;
  return (
    <li className="bd" data-testid={`component-${component.id}`}>
      <div className="bd__row">
        <span className="bd__label">
          <span aria-hidden="true">{ICONS[component.id]}</span> {component.label}
        </span>
        <span className="bd__pts">
          <strong>{component.points}</strong>/{component.max}
        </span>
      </div>
      <div className="bd__track">
        <div className="bd__fill" style={{ width: grown ? `${pct}%` : 0 }} />
      </div>
      <p className="bd__detail">{component.detail}</p>
      {component.id === 'mission' && (
        <ul className="checks checks--inline">
          {component.data.checks.map((c) => (
            <li key={c.id} className={c.met ? 'is-ok' : 'is-miss'}>
              <span className="checks__mark" aria-hidden="true">
                {c.met ? '✓' : '✕'}
              </span>
              {describeRequirement(c)}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function ResultsScreen({ daily, selection, practice, stats, onPractice, onHome }) {
  const { challenge, number } = daily;
  const result = useMemo(() => scorePlan(challenge, selection), [challenge, selection]);
  const [analysis, setAnalysis] = useState(null);
  const [showBest, setShowBest] = useState(false);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [format, setFormat] = useState('story');
  const [preview, setPreview] = useState({ url: '', blob: null, format: '' });

  // Exhaustive analysis of all 1,680 plans runs after first paint.
  useEffect(() => {
    const id = setTimeout(() => {
      const a = analyzeChallenge(challenge);
      setAnalysis({ ...a, position: rankOf(a, result.total) });
    }, 50);
    return () => clearTimeout(id);
  }, [challenge, result.total]);

  const dateLabel = formatPuzzleDate(daily.dateKey, { day: 'numeric', month: 'short', year: 'numeric' });
  const shareText = buildShareText({ number, challenge, result, url: SITE_URL });
  const rankText = analysis
    ? `Rank ${analysis.position.rank.toLocaleString('en')} of ${analysis.count.toLocaleString('en')} possible plans`
    : '';

  // Render the real export as the on-screen preview, so what you see is what you share.
  useEffect(() => {
    if (!analysis) return undefined;
    let cancelled = false;
    let url = '';
    renderShareImage({ number, challenge, result, dateLabel, rankText, format })
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setPreview({ url, blob, format });
      })
      .catch(() => !cancelled && setPreview({ url: '', blob: null, format }));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis, format, number, challenge, result.total, dateLabel, rankText]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const onShareImage = async () => {
    setBusy(true);
    try {
      const blob =
        preview.blob && preview.format === format
          ? preview.blob
          : await renderShareImage({ number, challenge, result, dateLabel, rankText, format });
      const outcome = await shareImage(blob, shareText, `a-day-in-croatia-${number}-${format}.png`);
      if (outcome === 'downloaded') flash('Result card saved as an image');
    } catch {
      flash('Could not create the image — try “Copy result”.');
    } finally {
      setBusy(false);
    }
  };

  const onCopy = async () => {
    if (navigator.share && window.matchMedia?.('(pointer: coarse)').matches) {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch (e) {
        if (e?.name === 'AbortError') return;
      }
    }
    flash((await copyText(shareText)) ? 'Result copied to clipboard' : 'Copy failed');
  };

  const { itinerary } = result;

  return (
    <main className="screen results">
      <section className="results__hero rise">
        <p className="eyebrow eyebrow--light">
          Challenge #{number} · {challenge.region}
          {practice ? ' · Practice round' : ''}
        </p>
        <ScoreRing score={result.total} />
        <h1 className="results__rating">{result.rating.title}</h1>
        <p className="results__blurb">{result.rating.blurb}</p>
        <p className="results__context" aria-live="polite">
          {analysis ? (
            <span data-testid="rank" data-rank={analysis.position.rank} data-count={analysis.count} data-max={analysis.maxTotal}>
              {analysis.position.isBest ? (
                <>
                  <strong>You found the best possible plan.</strong>{' '}
                </>
              ) : null}
              Rank <strong>{analysis.position.rank.toLocaleString('en')}</strong> of{' '}
              {analysis.count.toLocaleString('en')} possible plans
              {analysis.position.tiedWith > 0 &&
                ` (tied with ${analysis.position.tiedWith} other${analysis.position.tiedWith === 1 ? '' : 's'})`}
              <br />
              Highest score possible today: <strong>{analysis.maxTotal}</strong>
              {analysis.bestPlans.length > 1 && ` (${analysis.bestPlans.length} plans reach it)`}
            </span>
          ) : (
            'Ranking against every possible plan…'
          )}
        </p>
        {!result.valid && (
          <p className="warn warn--light">
            {!itinerary.constraints.timeOk && `Overran by ${formatDuration(itinerary.constraints.overrunMinutes)}. `}
            {!itinerary.constraints.budgetOk && `Over budget by €${itinerary.constraints.overBudget}.`}
          </p>
        )}
      </section>

      <section className="panel">
        <h2 className="panel__title">Score breakdown</h2>
        <ul className="breakdown">
          {result.components.map((c, i) => (
            <Breakdown key={c.id} component={c} delay={500 + i * 180} />
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2 className="panel__title">Your day</h2>
        <ol className="recap">
          {itinerary.stops.map((s) => (
            <li key={s.location.id}>
              <span className="recap__time">{formatClock(s.arrive)}</span>
              <span className="recap__name">
                {CATEGORIES[s.location.category].emoji} {s.location.name}
              </span>
              <span className="recap__dur">{formatDuration(s.location.durationMin)}</span>
            </li>
          ))}
          <li className="recap__end">
            <span className="recap__time">{formatClock(itinerary.totals.endTime)}</span>
            <span className="recap__name">Back at {challenge.hub.short}</span>
            <span className="recap__dur">{formatDuration(itinerary.totals.travelMinutes)} travel</span>
          </li>
        </ol>
        <RouteMap hub={challenge.hub} orderedIds={selection} compact />
      </section>

      <section className="panel share">
        <h2 className="panel__title">Share your day</h2>
        <div className="seg" role="radiogroup" aria-label="Image format">
          {Object.values(FORMATS).map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={format === f.id}
              className={`seg__btn ${format === f.id ? 'is-on' : ''}`}
              onClick={() => setFormat(f.id)}
              data-testid={`format-${f.id}`}
            >
              {f.label} <span>{f.ratio}</span>
            </button>
          ))}
        </div>
        <p className="share__hint">
          {format === 'story' ? 'For Instagram & Facebook Stories and WhatsApp Status.' : 'For feeds, WhatsApp chats and Facebook posts.'}
        </p>
        <div className={`share__preview share__preview--${format}`}>
          {preview.url && preview.format === format ? (
            <img src={preview.url} alt="Your shareable result card" data-testid="share-preview" />
          ) : (
            <div className="share__loading">Preparing your card…</div>
          )}
        </div>
        <div className="share__actions">
          <button type="button" className="btn btn--primary" onClick={onShareImage} disabled={busy || !analysis} data-testid="share-image">
            {busy ? 'Preparing…' : 'Share image'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onCopy} data-testid="copy-result">
            Copy result
          </button>
        </div>
        <pre className="share__text" aria-label="Share text preview" data-testid="share-text">
          {shareText}
        </pre>
      </section>

      {analysis && (
        <section className="panel">
          <h2 className="panel__title">The expert route</h2>
          {showBest ? (
            <div className="expert">
              <ol className="expert__list">
                {analysis.best.order.map((id, i) => {
                  const stop = analysis.best.result.itinerary.stops[i];
                  return (
                    <li key={id}>
                      <span className="recap__time">{formatClock(stop.arrive)}</span>
                      {CATEGORIES[stop.location.category].emoji} {stop.location.name}
                    </li>
                  );
                })}
              </ol>
              <p className="bd__detail">
                Scores {analysis.best.result.total}:{' '}
                {analysis.best.result.components.map((c) => `${c.points}/${c.max}`).join(' · ')}
              </p>
            </div>
          ) : (
            <button type="button" className="btn btn--ghost btn--block" onClick={() => setShowBest(true)}>
              Reveal the highest-scoring plan
            </button>
          )}
        </section>
      )}

      {!practice && stats && (
        <section className="panel">
          <h2 className="panel__title">Your stats</h2>
          <ul className="statgrid">
            <li>
              <strong>{stats.played}</strong>
              <span>Played</span>
            </li>
            <li>
              <strong>{stats.streak}</strong>
              <span>Streak</span>
            </li>
            <li>
              <strong>{stats.best}</strong>
              <span>Best</span>
            </li>
            <li>
              <strong>{stats.average}</strong>
              <span>Average</span>
            </li>
          </ul>
        </section>
      )}

      <section className="results__next">
        <p className="eyebrow">Next challenge in</p>
        <Countdown />
        <div className="results__actions">
          <button type="button" className="btn btn--ghost" onClick={onPractice} data-testid="practice">
            Practice again
          </button>
          <button type="button" className="btn btn--link" onClick={onHome}>
            Back to mission
          </button>
        </div>
        {practice && <p className="fineprint">Practice rounds don’t change your official score.</p>}
      </section>

      {toast && (
        <p className="toast" role="status">
          {toast}
        </p>
      )}
    </main>
  );
}
