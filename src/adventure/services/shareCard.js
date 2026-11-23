import { PHOTOS } from '../../data/photos.js';
import { DESTINATIONS } from '../data/story.js';
import { reportCard } from '../engine/report.js';
import {
  loadImage,
  loadFonts,
  fillRoundRect,
  fitFont,
  background,
  heroBand,
  brandLine,
  routeTiles,
  footer,
  withTextShadow,
  SERIF,
  SANS,
  SAND,
  CORAL,
} from '../../services/shareImage.js';

/**
 * Croatia Adventure share output. The funny part leads (ending, Duje's
 * verdict, the player's own disasters); numbers come second.
 * Only the configured production domain is printed (never localhost).
 */
export function buildAdventureShareText({ state, score, number, url }) {
  const { ending, title, verdict, highlights, promises } = reportCard(state);
  const kept = promises.filter((p) => p.status === 'kept').length;
  const broken = promises.filter((p) => p.status === 'broken').length;
  const lines = [
    `Croatia Adventure${state.mode === 'daily' ? ` #${number}` : ''} — ${ending.emoji} ${ending.title}`,
    `📖 My holiday: “${title}”`,
    `“${verdict}”`,
    '',
    ...highlights.map((h) => `• ${h}`),
    '',
    ...(kept + broken ? [`🤞 Promises: ${kept} kept, ${broken} broken`] : []),
    `💶 €${Math.round(state.money)} left · 🙂 ${state.happiness} · 📇 ${state.tipsFound.length} local tips · ${score} pts`,
    'Can you survive five days in Croatia?',
  ];
  if (url) lines.push(url);
  return lines.join('\n');
}

/** Wrap text into lines that fit `maxWidth` with the current ctx.font. */
function wrap(ctx, text, maxWidth, maxLines = 3) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    const last = lines[maxLines - 1];
    if (!text.endsWith(last)) lines[maxLines - 1] = `${last.replace(/[,.;:]?\s*\S*$/, '')}…`;
  }
  return lines;
}

export async function renderAdventureCard({ state, score, number, format = 'story' }) {
  const W = 1080;
  const story = format === 'story';
  const H = story ? 1920 : 1350;
  await loadFonts();
  const { ending, title, verdict, highlights } = reportCard(state);
  const heroPhoto = PHOTOS[ending.photo] ?? PHOTOS['split-hero'];
  const days = state.route.map((id) => ({ location: { short: DESTINATIONS[id].name.replace(' National Park', ''), photo: PHOTOS[DESTINATIONS[id].photo] } }));
  const [hero, ...imgs] = await Promise.all([loadImage(heroPhoto.src), ...days.map((d) => loadImage(d.location.photo?.src ?? ''))]);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const pad = 80;
  const bandH = story ? 760 : 470;
  background(ctx, W, H, bandH);
  heroBand(ctx, hero, W, bandH);

  // header (inside Stories safe area)
  const top = story ? 296 : 108;
  withTextShadow(ctx, () => {
    brandLine(ctx, pad, top, story ? 30 : 26);
    ctx.fillStyle = '#fff';
    ctx.font = `600 ${story ? 30 : 26}px ${SANS}`;
    const sub = `${state.mode === 'daily' ? `Daily #${number}` : '5 days'} · “${title}”`;
    fitFont(ctx, sub, `600 {s}px ${SANS}`, story ? 30 : 26, W - pad * 2, 20);
    ctx.fillText(sub, pad, top + (story ? 46 : 40));
  });

  // ending
  const titleY = story ? 700 : 420;
  withTextShadow(ctx, () => {
    ctx.fillStyle = '#fff';
    ctx.font = `400 ${story ? 84 : 64}px ${SANS}`;
    ctx.fillText(ending.emoji, pad, titleY - (story ? 108 : 84));
    fitFont(ctx, ending.title, `700 {s}px ${SERIF}`, story ? 92 : 72, W - pad * 2, 44);
    ctx.fillText(ending.title, pad, titleY);
  });

  // Duje's verdict
  let y = story ? 780 : 520;
  ctx.font = `italic 400 ${story ? 40 : 34}px ${SERIF}`;
  ctx.fillStyle = SAND;
  for (const line of wrap(ctx, `“${verdict}”`, W - pad * 2, 2)) {
    ctx.fillText(line, pad, y);
    y += story ? 50 : 42;
  }
  ctx.font = `700 ${story ? 22 : 20}px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText('— Duje, your local friend', pad, y + 2);
  y += story ? 64 : 52;

  // highlights (the shareable part)
  const shown = highlights.slice(0, story ? 3 : 2);
  ctx.font = `600 ${story ? 30 : 27}px ${SANS}`;
  for (const h of shown) {
    const lines = wrap(ctx, h, W - pad * 2 - 44, 2);
    const lh = story ? 38 : 36;
    const boxH = lines.length * lh + (story ? 26 : 30);
    fillRoundRect(ctx, pad, y, W - pad * 2, boxH, 18, 'rgba(255,255,255,0.07)');
    ctx.fillStyle = CORAL;
    ctx.fillText('•', pad + 18, y + (story ? 48 : 44));
    ctx.fillStyle = '#fff';
    lines.forEach((l, i) => ctx.fillText(l, pad + 44, y + (story ? 48 : 44) + i * lh));
    y += boxH + 12;
  }

  // stats row
  y += story ? 34 : 22;
  ctx.font = `700 ${story ? 30 : 26}px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText(`${score} pts  ·  €${Math.round(state.money)} left  ·  🙂 ${state.happiness}  ·  📇 ${state.tipsFound.length} tips`, pad, y + 10);
  y += story ? 40 : 30;

  // route
  routeTiles(ctx, days, imgs, { x: pad, y, w: W - pad * 2, tileH: 150, gap: 14, radius: 20, nameSize: 22 });

  footer(ctx, W, story ? 1556 : H - 150, pad, 'Fictional story · real local tips', 'Can you survive five days in Croatia?');
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), 'image/png'),
  );
}
