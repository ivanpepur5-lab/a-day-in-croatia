import { CATEGORIES } from '../data/locations.js';

/**
 * Draw a 1080×1350 share card on a canvas (no external libraries) and
 * return it as a PNG Blob.
 */
const W = 1080;
const H = 1350;
const SERIF = '"Fraunces Variable", Georgia, serif';
const SANS = '"Manrope Variable", system-ui, sans-serif';

export async function renderShareImage({ number, challenge, result, dateLabel, url }) {
  if (document.fonts?.load) {
    await Promise.allSettled([
      document.fonts.load(`700 220px ${SERIF}`),
      document.fonts.load(`italic 400 60px ${SERIF}`),
      document.fonts.load(`700 40px ${SANS}`),
    ]);
  }
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background: Adriatic dusk
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0e2f45');
  bg.addColorStop(0.55, '#123a52');
  bg.addColorStop(1, '#0a2233');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Sun glow
  const sun = ctx.createRadialGradient(860, 250, 0, 860, 250, 420);
  sun.addColorStop(0, 'rgba(255,196,140,0.55)');
  sun.addColorStop(1, 'rgba(255,196,140,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, H);

  const pad = 90;
  ctx.fillStyle = '#f3d9b8';
  ctx.font = `700 30px ${SANS}`;
  ctx.letterSpacing = '6px';
  ctx.fillText('A DAY IN CROATIA', pad, 130);
  ctx.letterSpacing = '0px';

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `500 32px ${SANS}`;
  ctx.fillText(`#${number} · ${challenge.region} · ${dateLabel}`, pad, 180);

  ctx.fillStyle = '#ffffff';
  ctx.font = `italic 400 64px ${SERIF}`;
  ctx.fillText(challenge.title, pad, 280, W - pad * 2);

  // Score
  ctx.font = `700 260px ${SERIF}`;
  const scoreText = String(result.total);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreText, pad - 8, 560);
  const sw = ctx.measureText(scoreText).width;
  ctx.font = `500 54px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText('/100', pad + sw + 10, 560);

  ctx.fillStyle = '#ffb48a';
  ctx.font = `700 46px ${SANS}`;
  ctx.fillText(result.rating.title, pad, 640);

  // Component bars
  const labels = { time: 'Time', budget: 'Budget', route: 'Route', mission: 'Mission' };
  let y = 730;
  for (const c of result.components) {
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `600 32px ${SANS}`;
    ctx.fillText(labels[c.id], pad, y);
    ctx.textAlign = 'right';
    ctx.fillText(`${c.points}/${c.max}`, W - pad, y);
    ctx.textAlign = 'left';
    roundRect(ctx, pad, y + 18, W - pad * 2, 16, 8, 'rgba(255,255,255,0.12)');
    const grad = ctx.createLinearGradient(pad, 0, W - pad, 0);
    grad.addColorStop(0, '#ffd59a');
    grad.addColorStop(1, '#ff8a6b');
    roundRect(ctx, pad, y + 18, Math.max(16, (W - pad * 2) * (c.points / c.max)), 16, 8, grad);
    y += 92;
  }

  // Route (categories only — no spoilers)
  ctx.font = `400 64px ${SANS}`;
  const route = result.itinerary.stops.map((s) => CATEGORIES[s.location.category].emoji).join('  →  ');
  ctx.fillStyle = '#ffffff';
  ctx.fillText(route, pad, y + 60);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `500 28px ${SANS}`;
  ctx.fillText('Can you plan a better day?', pad, H - 120);
  if (url) ctx.fillText(url.replace(/^https?:\/\//, ''), pad, H - 76);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/**
 * Share via the Web Share API (with image when supported), falling back to
 * downloading the PNG. Returns 'shared' | 'downloaded' | 'cancelled'.
 */
export async function shareImage(blob, text, filename) {
  const file = new File([blob], filename, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return 'shared';
    } catch (e) {
      if (e?.name === 'AbortError') return 'cancelled';
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  return 'downloaded';
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand?.('copy') ?? false;
    ta.remove();
    return ok;
  }
}
