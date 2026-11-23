/* global __BUILD_ID__ */
import { useEffect, useMemo, useState } from 'react';
import Media from '../../ui/components/Media.jsx';
import TipCard from './TipCard.jsx';
import { PHOTOS } from '../../data/photos.js';
import { ENDINGS, ACHIEVEMENTS, DESTINATIONS } from '../data/story.js';
import { TIPS_BY_ID } from '../data/tips.js';
import { computeScore } from '../engine/game.js';
import { renderAdventureCard, buildAdventureShareText } from '../services/shareCard.js';
import { shareImage, copyText, FORMATS } from '../../services/shareImage.js';
import { SITE_URL } from '../../config.js';
import { useCountUp } from '../../ui/hooks.js';
import { reportCard } from '../engine/report.js';
import Duje from './Duje.jsx';

/** Plain-text log of a run, for external playtesters to paste into feedback (no personal data). */
export function playtestLog(state, total, report) {
  return [
    `Croatia Adventure playtest log · build ${typeof __BUILD_ID__ === 'string' ? __BUILD_ID__ : 'dev'}`,
    `Seed: ${state.seed} (${state.mode}) · Ending: ${state.ending} · Score: ${total}`,
    `Final: €${Math.round(state.money)} · energy ${state.energy} · happiness ${state.happiness} · adventure ${state.adventure} · local ${state.local}`,
    `Route: ${state.route.join(' → ')}`,
    `Story title: ${report.title}`,
    `Events: ${state.seenEvents.join(', ')}`,
    `Choices: ${state.choices.map((c) => `${c.day}.${c.phase[0]}:${c.id}`).join(' ')}`,
    `Hidden found: ${(state.secrets ?? []).join(', ') || 'none'} · Tips: ${state.tipsFound.length}`,
  ].join('\n');
}

const PART_LABEL = {
  happiness: '🙂 Happiness × 4',
  adventure: '★ Adventure × 12',
  local: '🗝️ Local insider × 12',
  places: '📍 Destinations × 30',
  tips: '📇 Tips found × 8',
  money: '💶 Money left ÷ 2',
  energy: '⚡ Energy left',
};

export default function EndingScreen({ state, daily, progress, onAgain, onCollection, onMenu }) {
  const ending = ENDINGS.find((e) => e.id === state.ending);
  const score = useMemo(() => computeScore(state), [state]);
  const report = useMemo(() => reportCard(state), [state]);
  const shown = useCountUp(score.total, { duration: 1400, delay: 300 });
  const [format, setFormat] = useState('story');
  const [preview, setPreview] = useState({ url: '', blob: null, format: '' });
  const [toast, setToast] = useState('');
  const shareText = buildAdventureShareText({ state, score: score.total, number: daily.number, url: SITE_URL });

  useEffect(() => {
    let cancelled = false;
    let url = '';
    renderAdventureCard({ state, score: score.total, number: daily.number, format })
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setPreview({ url, blob, format });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [state, score.total, daily.number, format]);

  const flash = (m) => {
    setToast(m);
    setTimeout(() => setToast(''), 2400);
  };
  const onShare = async () => {
    const blob = preview.blob && preview.format === format ? preview.blob : await renderAdventureCard({ state, score: score.total, number: daily.number, format });
    const r = await shareImage(blob, shareText, `croatia-adventure-${state.mode === 'daily' ? daily.number : 'free'}-${format}.png`);
    if (r === 'downloaded') flash('Result card saved as an image');
  };
  const onCopy = async () => flash((await copyText(shareText)) ? 'Result copied' : 'Copy failed');
  const onCopyLog = async () => flash((await copyText(playtestLog(state, score.total, report))) ? 'Playtest log copied — paste it into your feedback' : 'Copy failed');

  const official = state.mode === 'daily' && progress.daily[daily.key]?.seed === state.seed;
  return (
    <main className="adv-end" data-testid="adv-ending" data-ending={ending.id}>
      <section className="adv-end__hero">
        <Media photo={PHOTOS[ending.photo]} className="adv-end__photo" />
        <div className="adv-end__text">
          <p className="adv-eyebrow">{state.mode === 'daily' ? `Daily adventure #${daily.number}` : 'Free play'} · ending</p>
          <p className="adv-end__emoji" aria-hidden="true">
            {ending.emoji}
          </p>
          <h1 className="adv-end__title" data-testid="adv-ending-title">
            {ending.title}
          </h1>
        </div>
      </section>

      <section className="adv-card">
        <p className="adv-label">Story</p>
        <p className="adv-story__text">{ending.epilogue}</p>
      </section>

      <section className="adv-card adv-report" data-testid="adv-report">
        <p className="adv-eyebrow">Holiday report card</p>
        <h2 className="adv-h2 adv-report__title" data-testid="adv-story-title">
          “{report.title}”
        </h2>
        <Duje testId="adv-verdict">“{report.verdict}”</Duje>
        <ol className="adv-diary" data-testid="adv-diary">
          {report.diary.map((d) => (
            <li key={d.day}>
              <b>
                Day {d.day} · {d.place}
              </b>
              <span>{d.text}</span>
            </li>
          ))}
        </ol>
        <h3 className="adv-h3">Top moments</h3>
        <ol className="adv-highlights" data-testid="adv-highlights">
          {report.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ol>
        {report.stats.length > 0 && (
          <ul className="adv-funstats">
            {report.stats.map((x) => (
              <li key={x.label}>
                <b>
                  {x.icon} {x.value}
                </b>
                <span>{x.label}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="adv-card">
        <div className="adv-score">
          <span className="adv-score__n" data-testid="adv-score" data-score={score.total}>
            {shown}
          </span>
          <span className="adv-score__l">points</span>
        </div>
        {official && <p className="adv-small">Recorded as today’s official daily result.</p>}
        <ul className="adv-parts">
          {Object.entries(score.parts).map(([k, v]) => (
            <li key={k}>
              <span>{PART_LABEL[k]}</span>
              <b>{v}</b>
            </li>
          ))}
        </ul>
        <ul className="adv-finalstats">
          <li>
            💶 <b>€{Math.round(state.money)}</b> left
          </li>
          <li>
            ⚡ <b>{state.energy}</b> energy
          </li>
          <li>
            🙂 <b>{state.happiness}</b> happiness
          </li>
        </ul>
        <ol className="adv-route">
          {state.route.map((d, i) => (
            <li key={`${d}-${i}`}>
              <Media photo={PHOTOS[DESTINATIONS[d].photo]} className="adv-route__img" variant="thumb" />
              <span>
                Day {i + 1} · {DESTINATIONS[d].name}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="adv-card">
        <h2 className="adv-h2">Achievements</h2>
        <ul className="adv-achs">
          {ACHIEVEMENTS.map((a) => {
            const thisRun = state.achievements.includes(a.id);
            const ever = progress.achievements.includes(a.id);
            return (
              <li key={a.id} className={thisRun ? 'is-on' : ever ? 'is-ever' : ''}>
                <span className="adv-achs__e" aria-hidden="true">
                  {thisRun || ever ? a.emoji : '🔒'}
                </span>
                <span>
                  <b>{a.title}</b>
                  <small>{thisRun ? 'Unlocked this holiday' : ever ? 'Unlocked before' : a.description}</small>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="adv-card">
        <h2 className="adv-h2">
          Local tips from this holiday · {state.tipsFound.length}
        </h2>
        <div className="adv-tipgrid">
          {state.tipsFound.map((id) => (
            <TipCard key={id} tip={TIPS_BY_ID[id]} compact />
          ))}
        </div>
        <button type="button" className="btn btn--link" onClick={onCollection}>
          Open your full collection
        </button>
      </section>

      <section className="adv-card share">
        <h2 className="adv-h2">Share your holiday</h2>
        <div className="seg" role="radiogroup" aria-label="Image format">
          {Object.values(FORMATS).map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={format === f.id} className={`seg__btn ${format === f.id ? 'is-on' : ''}`} onClick={() => setFormat(f.id)} data-testid={`adv-format-${f.id}`}>
              {f.label} <span>{f.ratio}</span>
            </button>
          ))}
        </div>
        <div className={`share__preview share__preview--${format}`}>
          {preview.url && preview.format === format ? <img src={preview.url} alt="Your Croatia Adventure result card" data-testid="adv-share-preview" /> : <div className="share__loading">Preparing your card…</div>}
        </div>
        <div className="share__actions">
          <button type="button" className="btn btn--primary" onClick={onShare} data-testid="adv-share">
            Share image
          </button>
          <button type="button" className="btn btn--ghost" onClick={onCopy}>
            Copy result
          </button>
        </div>
        <pre className="share__text" data-testid="adv-share-text">
          {shareText}
        </pre>
      </section>

      <section className="adv-actions">
        <button type="button" className="btn btn--primary btn--block" onClick={onAgain} data-testid="adv-again">
          Play again (new random holiday)
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={onMenu}>
          Back to menu
        </button>
        <button type="button" className="btn btn--link" onClick={onCopyLog} data-testid="adv-playtest-log">
          Playtesting? Copy your run log for feedback
        </button>
      </section>
      {toast && <p className="toast" role="status">{toast}</p>}
    </main>
  );
}
