import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import IntroScreen from './ui/screens/IntroScreen.jsx';
import PickScreen from './ui/screens/PickScreen.jsx';
import ArrangeScreen from './ui/screens/ArrangeScreen.jsx';
import ResultsScreen from './ui/screens/ResultsScreen.jsx';
import Sheet from './ui/components/Sheet.jsx';
import HowToPlay from './ui/components/HowToPlay.jsx';
import { getDailyChallenge } from './engine/daily.js';
import { gameReducer, createInitialState } from './engine/gameReducer.js';
import { scorePlan } from './engine/scoring.js';
import { getResultFor, saveResult, loadState, computeStats, getPlayerId, markIntroSeen } from './services/storage.js';
import { submitResult } from './services/supabase.js';
import { DATA_STATUS } from './data/locations.js';

export default function App({ now = new Date() }) {
  const daily = useMemo(() => getDailyChallenge(now), [now]);
  const { challenge } = daily;
  const [saved, setSaved] = useState(() => getResultFor(daily.dateKey));
  const [helpOpen, setHelpOpen] = useState(() => !loadState().seenIntro);

  const reducer = useCallback((s, a) => gameReducer(s, a, challenge), [challenge]);
  const [state, dispatch] = useReducer(reducer, undefined, () => createInitialState(challenge, saved));

  // Persist the first official result of the day.
  useEffect(() => {
    if (state.screen !== 'results' || !state.submitted || state.practice || saved) return;
    const result = scorePlan(challenge, state.selection);
    const entry = {
      challengeId: challenge.id,
      puzzleNumber: daily.number,
      order: state.selection,
      total: result.total,
      components: Object.fromEntries(result.components.map((c) => [c.id, c.points])),
    };
    if (saveResult(daily.dateKey, entry)) {
      setSaved(getResultFor(daily.dateKey));
      submitResult({ ...entry, playerId: getPlayerId(), dateKey: daily.dateKey });
    }
  }, [state, saved, challenge, daily]);

  // Scroll to top on screen change.
  const prevScreen = useRef(state.screen);
  useEffect(() => {
    if (prevScreen.current !== state.screen) {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      prevScreen.current = state.screen;
    }
  }, [state.screen]);

  const stats = useMemo(() => computeStats(loadState().history, daily.dateKey), [daily.dateKey, saved]);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
    markIntroSeen();
  }, []);

  const toggle = useCallback((id) => dispatch({ type: 'TOGGLE', id, at: Date.now() }), []);
  const move = useCallback((from, to) => dispatch({ type: 'MOVE', from, to }), []);

  // Showing an official result: always the saved plan, even after practice rounds.
  const showingOfficial = state.screen === 'results' && !state.practice;
  const resultSelection = showingOfficial && saved ? saved.order : state.selection;

  return (
    <div className="app" data-screen={state.screen}>
      <header className="topbar">
        <button type="button" className="brand" onClick={() => dispatch({ type: 'HOME' })} aria-label="A Day in Croatia — home">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <circle cx="16" cy="13" r="7" fill="var(--sun)" />
              <path d="M2 21c4-3 8-3 14 0s10 3 14 0v9H2z" fill="var(--sea)" />
            </svg>
          </span>
          <span className="brand__name">
            A Day in <em>Croatia</em>
          </span>
        </button>
        <span className="topbar__num">#{daily.number}</span>
        <button type="button" className="icon-btn" onClick={() => setHelpOpen(true)} aria-label="How to play">
          ?
        </button>
      </header>

      <div className="stage" key={state.screen}>
        {state.screen === 'intro' && (
          <IntroScreen
            daily={daily}
            hasPlayed={Boolean(saved)}
            onStart={() => dispatch({ type: saved ? 'PRACTICE' : 'START' })}
            onViewResult={() => dispatch({ type: 'VIEW_OFFICIAL', order: saved.order })}
            onHelp={() => setHelpOpen(true)}
          />
        )}
        {state.screen === 'pick' && (
          <PickScreen
            challenge={challenge}
            selection={state.selection}
            lastToggle={state.lastToggle}
            onToggle={toggle}
            onNext={() => dispatch({ type: 'GO_ARRANGE' })}
            onBack={() => dispatch({ type: 'BACK' })}
          />
        )}
        {state.screen === 'arrange' && (
          <ArrangeScreen
            challenge={challenge}
            selection={state.selection}
            practice={state.practice}
            onMove={move}
            onSubmit={() => dispatch({ type: 'SUBMIT' })}
            onBack={() => dispatch({ type: 'BACK' })}
          />
        )}
        {state.screen === 'results' && resultSelection.length === challenge.picks && (
          <ResultsScreen
            daily={daily}
            selection={resultSelection}
            practice={state.practice}
            stats={stats}
            onPractice={() => dispatch({ type: 'PRACTICE' })}
            onHome={() => dispatch({ type: 'HOME' })}
          />
        )}
      </div>

      <footer className="footer">
        <p>
          <strong>{DATA_STATUS.label}</strong> — durations, prices and travel times are estimates for play, not live
          data. Check official sources before you travel.
        </p>
      </footer>

      <Sheet open={helpOpen} onClose={closeHelp} title="How to play" labelledBy="help-title">
        <HowToPlay />
        <button type="button" className="btn btn--primary btn--block" onClick={closeHelp}>
          Got it
        </button>
      </Sheet>
    </div>
  );
}
