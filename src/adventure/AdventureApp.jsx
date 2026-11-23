import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './adventure.css';
import Hud from './ui/Hud.jsx';
import Duje from './ui/Duje.jsx';
import TipCard from './ui/TipCard.jsx';
import EndingScreen from './ui/EndingScreen.jsx';
import Collection from './ui/Collection.jsx';
import Media from '../ui/components/Media.jsx';
import { PHOTOS } from '../data/photos.js';
import { DESTINATIONS, START, ACHIEVEMENTS } from './data/story.js';
import { TIPS } from './data/tips.js';
import { newGame, getStep, choose, computeScore } from './engine/game.js';
import { loadProgress, collect, saveCurrent, clearCurrent, recordRun } from './services/progress.js';
import { dateKey as puzzleDateKey, puzzleNumberForKey, formatPuzzleDate } from '../engine/daily.js';

const DELTA_META = {
  money: { icon: '💶', fmt: (v) => `${v > 0 ? '+' : '−'}€${Math.abs(v)}` },
  energy: { icon: '⚡', fmt: (v) => `${v > 0 ? '+' : '−'}${Math.abs(v)}` },
  happiness: { icon: '🙂', fmt: (v) => `${v > 0 ? '+' : '−'}${Math.abs(v)}` },
  adventure: { icon: '★', fmt: (v) => `${v > 0 ? '+' : '−'}${Math.abs(v)}` },
  local: { icon: '🗝️', fmt: (v) => `${v > 0 ? '+' : '−'}${Math.abs(v)}` },
};
const DELTA_GOOD = (k, v) => v > 0;

const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

function randomSeed() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/* ─────────────────────────────────────────────────── TITLE ── */
function Title({ progress, daily, onDaily, onFree, onResume, onCollection }) {
  const played = progress.daily[daily.key];
  return (
    <main className="adv-title">
      <section className="adv-title__hero">
        <Media photo={PHOTOS.hvar} variant="hero" className="adv-title__art" priority />
        <div className="adv-title__text">
          <p className="adv-eyebrow">Prototype · new game mode</p>
          <h1 className="adv-title__h">
            Croatia <em>Adventure</em>
          </h1>
          <p className="adv-title__sub">Five days. €500. One sunburn, probably.</p>
        </div>
      </section>
      <section className="adv-card rise">
        <ul className="adv-start">
          <li>
            <b>€{START.money}</b>
            <span>budget</span>
          </li>
          <li>
            <b>{START.days}</b>
            <span>days</span>
          </li>
          <li>
            <b>{START.energy}</b>
            <span>energy</span>
          </li>
          <li>
            <b>{START.happiness}</b>
            <span>happiness</span>
          </li>
        </ul>
        <Duje>
          Bok! I’m Duje, from Split. For five days I’ll be your local friend, your guide and your harshest critic. Every
          choice costs money, energy or happiness — and I remember everything. So does Dalmatia.
        </Duje>
        <p className="adv-intro">
          Survive — and enjoy — a five-day holiday. Collect real local tips, discover hidden places, and find one of ten
          endings.
        </p>
        {progress.current && !progress.current.ended && (
          <button type="button" className="btn btn--primary btn--block btn--lg" onClick={onResume} data-testid="adv-resume">
            Continue your holiday · Day {progress.current.day || 0}
          </button>
        )}
        <button
          type="button"
          className={`btn ${progress.current && !progress.current.ended ? 'btn--ghost' : 'btn--primary btn--lg'} btn--block`}
          onClick={onDaily}
          data-testid="adv-daily"
        >
          {played ? `Daily adventure #${daily.number} — replay for fun` : `Daily adventure #${daily.number}`}
        </button>
        <p className="adv-small">
          {played
            ? `Today’s official result: ${played.score} pts. Replays don’t change it.`
            : `Everyone gets the same events today (${daily.label}).`}
        </p>
        <button type="button" className="btn btn--ghost btn--block" onClick={onFree} data-testid="adv-free">
          Free play (random holiday)
        </button>
        <button type="button" className="btn btn--link" onClick={onCollection} data-testid="adv-collection">
          Local tip collection · {progress.tips.length}/{TIPS.length} · achievements {progress.achievements.length}/6
        </button>
        <p className="adv-disclaimer">
          The story, characters and in-game prices are <strong>fictional</strong>. Local Insider tip cards are{' '}
          <strong>real-world information</strong>, marked “Verified” (official source and date) or “Editorial”.
        </p>
      </section>
    </main>
  );
}

/* ─────────────────────────────────────────────────── OUTCOME ── */
function Outcome({ outcome, newTip, newAch, onContinue, last }) {
  const ref = useRef(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="adv-outcome" role="dialog" aria-modal="true" aria-labelledby="adv-outcome-title">
      <div className="adv-outcome__panel" ref={ref} tabIndex={-1}>
        <p className="adv-label">{outcome.kind === 'hidden' ? '🔎 Hidden discovery' : outcome.kind === 'callback' ? '↩ Consequences' : 'Story'}</p>
        <h2 id="adv-outcome-title" className="adv-outcome__title">
          {outcome.lucky === true ? 'Lucky!' : outcome.lucky === false ? 'Not this time…' : outcome.choice.label}
        </h2>
        <p className="adv-outcome__text" data-testid="adv-result">
          {outcome.text}
        </p>
        {outcome.duje && (
          <Duje compact testId="adv-duje-reaction">
            {outcome.duje}
          </Duje>
        )}
        {Object.keys(outcome.deltas).length > 0 && (
          <ul className="adv-deltas" data-testid="adv-deltas">
            {Object.entries(outcome.deltas).map(([k, v], i) => (
              <li key={k} className={DELTA_GOOD(k, v) ? 'good' : 'bad'} style={{ '--i': i }}>
                <span aria-hidden="true">{DELTA_META[k].icon}</span> {DELTA_META[k].fmt(v)}
              </li>
            ))}
          </ul>
        )}
        {outcome.night && (
          <p className="adv-night" data-testid="adv-night">
            🌙{' '}
            {outcome.night.rough
              ? 'You couldn’t afford your bed and slept on a bench by the sea. ⚡ +5, 🙂 −10.'
              : `Night: −€${outcome.night.paid} for your bed, ⚡ +${outcome.night.recovered} after sleep.`}
            {outcome.night.tired && ' You went to bed exhausted (🙂 −8).'}
          </p>
        )}
        {outcome.night?.line && <Duje compact>{outcome.night.line}</Duje>}
        {outcome.moment && (
          <p className="adv-moment" data-testid="adv-moment">
            📝 Added to your holiday report: <em>{outcome.moment.text}</em>
          </p>
        )}
        {outcome.tip && (
          <div className="adv-tipreveal" data-testid="adv-tip">
            <p className="adv-label adv-label--real">{newTip ? 'New Local Insider tip unlocked!' : 'Local Insider tip'}</p>
            <TipCard tip={outcome.tip} isNew={newTip} />
          </div>
        )}
        {newAch.length > 0 && (
          <ul className="adv-ach-toast" data-testid="adv-achievement">
            {newAch.map((a) => (
              <li key={a.id}>
                <span aria-hidden="true">{a.emoji}</span> Achievement unlocked: <strong>{a.title}</strong>
              </li>
            ))}
          </ul>
        )}
        <button type="button" className="btn btn--primary btn--block" onClick={onContinue} data-testid="adv-continue">
          {last ? 'See how your holiday ended' : outcome.night ? 'Sleep & start the next day' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────── PLAY ── */
function Play({ state, onChoose }) {
  const step = getStep(state);
  const dest = state.location ? DESTINATIONS[state.location] : null;
  const photo = dest ? PHOTOS[dest.photo] : PHOTOS['split-hero'];
  return (
    <main className="adv-play" key={`${state.day}-${state.phase}`}>
      <section className="adv-scene">
        <Media photo={photo} className="adv-scene__photo" />
        <div className="adv-scene__text">
          <p className="adv-eyebrow">{dest ? dest.name : 'Somewhere over the Adriatic'}</p>
          <h1 className="adv-scene__title" data-testid="adv-step-title">
            {step.title}
          </h1>
        </div>
      </section>
      <section className="adv-story">
        {step.phase === 'event' ? (
          <>
            <p className={`adv-label ${step.kind ? `adv-label--${step.kind}` : ''}`} data-testid="adv-event-kind">
              {step.kind === 'callback' ? '↩ Consequences of your choices' : step.kind === 'hidden' ? '🔎 Hidden discovery' : 'Story'}
            </p>
            <p className="adv-story__text" data-testid="adv-prompt">
              {step.prompt}
            </p>
          </>
        ) : (
          <Duje testId="adv-prompt">{step.prompt}</Duje>
        )}
      </section>
      <ul className="adv-choices" data-testid="adv-choices">
        {step.choices.map((c, i) => (
          <li key={c.id} style={{ '--i': i }}>
            <button
              type="button"
              className="adv-choice"
              disabled={c.disabled}
              onClick={() => onChoose(c.id)}
              data-testid={`adv-choice-${c.id}`}
            >
              <span className="adv-choice__label">{c.label}</span>
              {c.hint && <span className="adv-choice__hint">{c.hint}</span>}
              <span className="adv-choice__meta">
                {c.cost > 0 && <span className="adv-cost">−€{c.cost}</span>}
                {c.nightly && <span className="adv-cost">€{c.nightly}/night</span>}
                {c.chance && <span className="adv-risk">🎲 risky</span>}
                {c.disabled && <span className="adv-risk">{c.reason}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

/* ─────────────────────────────────────────────────── APP ── */
export default function AdventureApp({ onExit, now = new Date() }) {
  const daily = useMemo(() => {
    const key = puzzleDateKey(now);
    return { key, number: puzzleNumberForKey(key), label: formatPuzzleDate(key) };
  }, [now]);
  const [progress, setProgress] = useState(loadProgress);
  const [screen, setScreen] = useState('title'); // title | play | ending | collection
  const [state, setState] = useState(null);
  const [pending, setPending] = useState(null); // { outcome, next, newTip, newAch }
  const [pulse, setPulse] = useState({});

  const refresh = () => setProgress(loadProgress());

  // Every screen change starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const start = (mode) => {
    const seed = mode === 'daily' ? `daily-${daily.key}` : `free-${randomSeed()}`;
    const s = newGame({ seed, mode });
    setState(s);
    saveCurrent(s);
    setScreen('play');
    window.scrollTo(0, 0);
  };

  const onChoose = useCallback(
    (id) => {
      const { state: next, outcome } = choose(state, id);
      const { newTips, newAch } = collect({ tips: next.tipsFound, achievements: next.achievements });
      setPending({
        outcome,
        next,
        newTip: Boolean(outcome.tip && newTips.includes(outcome.tip.id)),
        newAch: outcome.achievements.filter((a) => newAch.includes(a)).map((a) => ACH_BY_ID[a]),
      });
      setPulse(outcome.deltas);
      setState(next);
      if (next.ended) {
        const score = computeScore(next).total;
        recordRun({ state: next, score, dateKey: daily.key });
      } else {
        saveCurrent(next);
      }
      refresh();
    },
    [state, daily.key],
  );

  const onContinue = () => {
    const ended = pending?.next.ended;
    setPending(null);
    setPulse({});
    if (ended) setScreen('ending');
    window.scrollTo(0, 0);
  };

  return (
    <div className="adv">
      <header className="adv-top">
        <button type="button" className="adv-top__back" onClick={screen === 'title' ? onExit : () => setScreen('title')} data-testid="adv-back">
          ← {screen === 'title' ? 'A Day in Croatia' : 'Menu'}
        </button>
        <span className="adv-top__brand">
          Croatia <em>Adventure</em>
        </span>
      </header>

      {screen === 'play' && state && <Hud state={state} pulse={pulse} />}

      {screen === 'title' && (
        <Title
          progress={progress}
          daily={daily}
          onDaily={() => start('daily')}
          onFree={() => start('free')}
          onResume={() => {
            setState(progress.current);
            setScreen('play');
            window.scrollTo(0, 0);
          }}
          onCollection={() => setScreen('collection')}
        />
      )}
      {screen === 'play' && state && !state.ended && <Play state={state} onChoose={onChoose} />}
      {screen === 'ending' && state && (
        <EndingScreen
          state={state}
          daily={daily}
          progress={progress}
          onAgain={() => start('free')}
          onCollection={() => setScreen('collection')}
          onMenu={() => {
            clearCurrent();
            refresh();
            setScreen('title');
          }}
        />
      )}
      {screen === 'collection' && <Collection progress={progress} onBack={() => setScreen(state && state.ended ? 'ending' : 'title')} />}

      {pending && (
        <Outcome
          outcome={pending.outcome}
          newTip={pending.newTip}
          newAch={pending.newAch}
          last={pending.next.ended}
          onContinue={onContinue}
        />
      )}
    </div>
  );
}
