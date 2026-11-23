import { PHOTOS } from '../../data/photos.js';
import { SITE_DISPLAY } from '../../config.js';
import { DESTINATIONS, ENDINGS } from '../data/story.js';
import {
  loadImage,
  loadFonts,
  drawCover,
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
 * Croatia Adventure share card. Same visual identity as the puzzle card:
 * navy, sand, coral, Fraunces. Formats: story 1080×1920 · post 1080×1350.
 * Only the configured production domain is printed (never localhost).
 */
export function buildAdventureShareText({ state, score, number, url }) {
  const ending = ENDINGS.find((e) => e.id === state.ending);
  const route = state.route.map((d) => DESTINATIONS[d].name).join(' → ');
  const lines = [
    `Croatia Adventure${state.mode === 'daily' ? ` #${number}` : ''}`,
    `${ending.emoji} ${ending.title} — ${score} pts`,
    `💶 €${Math.round(state.money)} left · ⚡ ${state.energy} · 🙂 ${state.happiness} · 🗝️ ${state.tipsFound.length} local tips`,
    route,
  ];
  if (url) lines.push('', url);
  return lines.join('\n');
}

export async function renderAdventureCard({ state, score, number, format = 'story' }) {
  const W = 1080;
  const H = format === 'story' ? 1920 : 1350;
  await loadFonts();
  const ending = ENDINGS.find((e) => e.id === state.ending);
  const heroPhoto = PHOTOS[ending.photo] ?? PHOTOS['split-hero'];
  const days = state.route.map((id, i) => ({ id, day: i + 1, location: { short: DESTINATIONS[id].name.replace(' National Park', ''), photo: PHOTOS[DESTINATIONS[id].photo] } }));
  const [hero, ...imgs] = await Promise.all([loadImage(heroPhoto.src), ...days.map((d) => loadImage(d.location.photo?.src ?? ''))]);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const pad = 80;
  const story = format === 'story';
  const bandH = story ? 860 : 520;
  background(ctx, W, H, bandH);
  heroBand(ctx, hero, W, bandH);

  const top = story ? 296 : 112;
  withTextShadow(ctx, () => {
    brandLine(ctx, pad, top, story ? 32 : 28);
    ctx.fillStyle = '#fff';
    ctx.font = `600 ${story ? 32 : 28}px ${SANS}`;
    ctx.fillText(state.mode === 'daily' ? `Croatia Adventure · Daily #${number}` : 'Croatia Adventure · 5 days', pad, top + (story ? 48 : 44));
  });

  // Ending title
  const titleY = story ? 760 : 430;
  withTextShadow(ctx, () => {
    ctx.fillStyle = '#fff';
    ctx.font = `400 ${story ? 96 : 76}px ${SANS}`;
    ctx.fillText(ending.emoji, pad, titleY - (story ? 120 : 96));
    fitFont(ctx, ending.title, `700 {s}px ${SERIF}`, story ? 104 : 84, W - pad * 2, 48);
    ctx.fillText(ending.title, pad, titleY);
  });

  // Score + stats
  let y = story ? 900 : 590;
  ctx.fillStyle = CORAL;
  ctx.font = `800 ${story ? 54 : 46}px ${SANS}`;
  ctx.fillText(`${score} points`, pad, y);
  y += story ? 70 : 60;
  const stats = [
    ['💶', `€${Math.round(state.money)}`, 'left'],
    ['⚡', `${state.energy}`, 'energy'],
    ['🙂', `${state.happiness}`, 'happiness'],
    ['🗝️', `${state.tipsFound.length}`, 'tips'],
  ];
  const colW = (W - pad * 2) / 4;
  stats.forEach(([icon, val, label], i) => {
    const x = pad + i * colW;
    fillRoundRect(ctx, x, y, colW - 16, story ? 150 : 128, 22, 'rgba(255,255,255,0.08)');
    ctx.textAlign = 'center';
    ctx.font = `400 ${story ? 40 : 34}px ${SANS}`;
    ctx.fillStyle = '#fff';
    ctx.fillText(icon, x + (colW - 16) / 2, y + (story ? 52 : 44));
    ctx.font = `700 ${story ? 44 : 38}px ${SERIF}`;
    ctx.fillText(val, x + (colW - 16) / 2, y + (story ? 104 : 88));
    ctx.font = `600 ${story ? 22 : 20}px ${SANS}`;
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.fillText(label, x + (colW - 16) / 2, y + (story ? 134 : 114));
    ctx.textAlign = 'left';
  });
  y += story ? 210 : 172;

  // Route
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `800 24px ${SANS}`;
  ctx.letterSpacing = '5px';
  ctx.fillText('MY 5 DAYS', pad, y);
  ctx.letterSpacing = '0px';
  routeTiles(ctx, days, imgs, { x: pad, y: y + 26, w: W - pad * 2, tileH: story ? 230 : 200, gap: 16, radius: 22, nameSize: 24 });

  footer(ctx, W, story ? 1556 : H - 170, pad, 'Fictional story · real local tips', 'Can you survive five days in Croatia?');
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), 'image/png'),
  );
}

export { SAND, drawCover };
