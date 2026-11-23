import { PHOTOS } from '../data/photos.js';
import { SITE_DISPLAY } from '../config.js';

/**
 * Share-card renderer (Canvas 2D, no libraries).
 *
 *   story — 1080×1920 (9:16): Instagram/Facebook Stories, WhatsApp Status
 *   post  — 1080×1350 (4:5):  feeds, WhatsApp chats, Facebook posts
 *
 * Photos are same-origin files from /public/images, so the canvas is never
 * tainted and toBlob() works. The only URL printed is SITE_DISPLAY (from
 * build configuration) — never window.location.
 */
export const FORMATS = {
  story: { id: 'story', label: 'Story', ratio: '9:16', w: 1080, h: 1920 },
  post: { id: 'post', label: 'Post', ratio: '4:5', w: 1080, h: 1350 },
};

const SERIF = '"Fraunces Variable", Georgia, serif';
const SANS = '"Manrope Variable", system-ui, sans-serif';
const NAVY = '#0e2f45';
const NAVY_DEEP = '#0a2233';
const SAND = '#f3d9b8';
const CORAL = '#ffb48a';

const imageCache = new Map();
function loadImage(src) {
  if (!imageCache.has(src)) {
    imageCache.set(
      src,
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      }),
    );
  }
  return imageCache.get(src);
}

async function loadFonts() {
  if (!document.fonts?.load) return;
  await Promise.allSettled([
    document.fonts.load(`700 200px ${SERIF}`),
    document.fonts.load(`italic 400 60px ${SERIF}`),
    document.fonts.load(`600 40px ${SERIF}`),
    document.fonts.load(`700 40px ${SANS}`),
    document.fonts.load(`500 30px ${SANS}`),
  ]);
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fillRoundRect(ctx, x, y, w, h, r, fill) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Draw an image "object-fit: cover" into a (rounded) box. */
function drawCover(ctx, img, x, y, w, h, r = 0, focusY = 0.5) {
  ctx.save();
  if (r) {
    roundRectPath(ctx, x, y, w, h, r);
    ctx.clip();
  }
  if (img) {
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) * focusY;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  } else {
    ctx.fillStyle = '#1f4a63';
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

/** Fit text to a max width by shrinking the font size. */
function fitFont(ctx, text, weightFamily, size, maxWidth, min = 18) {
  let s = size;
  ctx.font = `${weightFamily.replace('{s}', s)}`;
  while (ctx.measureText(text).width > maxWidth && s > min) {
    s -= 2;
    ctx.font = `${weightFamily.replace('{s}', s)}`;
  }
  return s;
}

function background(ctx, w, h, flatUntil = 0) {
  // Flat NAVY behind the photo band so its fade has no visible seam.
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, NAVY);
  bg.addColorStop(Math.min(0.9, flatUntil / h), NAVY);
  bg.addColorStop(Math.min(0.95, flatUntil / h + 0.3), '#123a52');
  bg.addColorStop(1, NAVY_DEEP);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
}

/** Soft shadow for text drawn over photographs. */
function withTextShadow(ctx, fn) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 2;
  fn();
  ctx.restore();
}

/** Header photo band that fades into the navy background. */
function heroBand(ctx, img, w, bandH) {
  drawCover(ctx, img, 0, 0, w, bandH, 0, 0.55);
  const fade = ctx.createLinearGradient(0, 0, 0, bandH);
  fade.addColorStop(0, 'rgba(10,34,51,0.78)');
  fade.addColorStop(0.32, 'rgba(10,34,51,0.15)');
  fade.addColorStop(0.62, 'rgba(14,47,69,0.35)');
  fade.addColorStop(0.9, 'rgba(14,47,69,0.92)');
  fade.addColorStop(1, NAVY);
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, bandH);
}

function brandLine(ctx, x, y, size = 30) {
  ctx.fillStyle = SAND;
  ctx.font = `800 ${size}px ${SANS}`;
  ctx.letterSpacing = `${Math.round(size * 0.22)}px`;
  ctx.fillText('A DAY IN CROATIA', x, y);
  ctx.letterSpacing = '0px';
}

/**
 * The route: one photo tile per stop, numbered, with its short name,
 * joined by a dashed line — readable at a glance on a phone.
 */
function routeTiles(ctx, stops, images, { x, y, w, tileH, gap = 22, radius = 26, nameSize = 30 }) {
  const n = stops.length;
  const tileW = (w - gap * (n - 1)) / n;
  // connector
  ctx.save();
  ctx.strokeStyle = 'rgba(255,214,170,0.75)';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(x + tileW / 2, y + tileH / 2);
  ctx.lineTo(x + w - tileW / 2, y + tileH / 2);
  ctx.stroke();
  ctx.restore();

  stops.forEach((stop, i) => {
    const tx = x + i * (tileW + gap);
    // shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    fillRoundRect(ctx, tx, y, tileW, tileH, radius, '#173f57');
    ctx.restore();
    drawCover(ctx, images[i], tx, y, tileW, tileH, radius, 0.5);
    // inner bottom shade for legibility
    ctx.save();
    roundRectPath(ctx, tx, y, tileW, tileH, radius);
    ctx.clip();
    const shade = ctx.createLinearGradient(0, y + tileH * 0.45, 0, y + tileH);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = shade;
    ctx.fillRect(tx, y, tileW, tileH);
    ctx.restore();
    // white hairline
    roundRectPath(ctx, tx, y, tileW, tileH, radius);
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.stroke();
    // number badge
    const br = Math.round(tileW * 0.13);
    ctx.beginPath();
    ctx.arc(tx + br + 12, y + br + 12, br, 0, Math.PI * 2);
    ctx.fillStyle = SAND;
    ctx.fill();
    ctx.fillStyle = NAVY;
    ctx.font = `800 ${Math.round(br * 1.15)}px ${SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1), tx + br + 12, y + br + 13);
    // name on the photo
    const name = stop.location.short;
    fitFont(ctx, name, `700 {s}px ${SANS}`, nameSize, tileW - 20, 16);
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(name, tx + tileW / 2, y + tileH - 20);
    ctx.textAlign = 'left';
  });
}

function scoreBars(ctx, components, { x, y, w, rowH = 86, label = 30 }) {
  const labels = { time: 'Time', budget: 'Budget', route: 'Route', mission: 'Mission' };
  components.forEach((c, i) => {
    const ry = y + i * rowH;
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = `600 ${label}px ${SANS}`;
    ctx.fillText(labels[c.id], x, ry);
    ctx.textAlign = 'right';
    ctx.font = `700 ${label}px ${SANS}`;
    ctx.fillText(`${c.points}/${c.max}`, x + w, ry);
    ctx.textAlign = 'left';
    fillRoundRect(ctx, x, ry + 16, w, 14, 7, 'rgba(255,255,255,0.13)');
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, '#ffd59a');
    grad.addColorStop(1, '#ff8a6b');
    fillRoundRect(ctx, x, ry + 16, Math.max(14, w * (c.points / c.max)), 14, 7, grad);
  });
}

function scoreBlock(ctx, result, x, baseline, size) {
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${size}px ${SERIF}`;
  const text = String(result.total);
  ctx.fillText(text, x - size * 0.03, baseline);
  const sw = ctx.measureText(text).width;
  ctx.font = `500 ${Math.round(size * 0.2)}px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.62)';
  ctx.fillText('/100', x + sw + 12, baseline);
}

/** Footer block starting at a separator line at `top`. */
function footer(ctx, w, top, pad, fallback) {
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(pad, top, w - pad * 2, 2);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = `600 34px ${SERIF}`;
  ctx.fillText('Can you plan a better day?', pad, top + 64);
  ctx.font = `600 28px ${SANS}`;
  ctx.fillStyle = SAND;
  if (SITE_DISPLAY) {
    ctx.fillText(SITE_DISPLAY, pad, top + 108);
  } else if (fallback) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(fallback, pad, top + 108);
  }
  // photo credit hint (full credits are in the app)
  ctx.textAlign = 'right';
  ctx.font = `500 20px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText('Photos: Wikimedia Commons (CC)', w - pad, top + 108);
  ctx.textAlign = 'left';
}

/**
 * @param {{number:number, challenge:object, result:object, dateLabel:string,
 *          rankText?:string, format?:'story'|'post'}} opts
 * @returns {Promise<Blob>}
 */
export async function renderShareImage({ number, challenge, result, dateLabel, rankText, format = 'story' }) {
  const f = FORMATS[format] ?? FORMATS.story;
  const { w, h } = f;
  await loadFonts();
  const stops = result.itinerary.stops;
  const [hero, ...stopImages] = await Promise.all([
    loadImage(PHOTOS['split-hero'].src),
    ...stops.map((s) => loadImage(s.location.photo?.src ?? '')),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const pad = 80;
  const bandH = f.id === 'story' ? 820 : 470;
  background(ctx, w, h, bandH);

  if (f.id === 'story') {
    // Stories overlay ~250px of UI at the top and bottom: keep text inside 250–1670.
    heroBand(ctx, hero, w, bandH);
    withTextShadow(ctx, () => {
      brandLine(ctx, pad, 296, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 32px ${SANS}`;
      ctx.fillText(`Daily challenge #${number} · ${dateLabel}`, pad, 344);
      ctx.fillStyle = '#ffffff';
      fitFont(ctx, challenge.title, `italic 400 {s}px ${SERIF}`, 64, w - pad * 2, 36);
      ctx.fillText(challenge.title, pad, 700);
    });

    scoreBlock(ctx, result, pad, 925, 230);
    ctx.fillStyle = CORAL;
    ctx.font = `800 46px ${SANS}`;
    ctx.fillText(result.rating.title, pad, 996);
    if (rankText) {
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = `600 30px ${SANS}`;
      ctx.fillText(rankText, pad, 1042);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = `800 24px ${SANS}`;
    ctx.letterSpacing = '5px';
    ctx.fillText('MY ROUTE', pad, 1108);
    ctx.letterSpacing = '0px';
    routeTiles(ctx, stops, stopImages, { x: pad, y: 1132, w: w - pad * 2, tileH: 240, nameSize: 30 });

    const colW = (w - pad * 2 - 60) / 2;
    scoreBars(ctx, result.components.slice(0, 2), { x: pad, y: 1434, w: colW, rowH: 72, label: 26 });
    scoreBars(ctx, result.components.slice(2), { x: pad + colW + 60, y: 1434, w: colW, rowH: 72, label: 26 });
    footer(ctx, w, 1556, pad, SITE_DISPLAY ? '' : `${challenge.region}, Croatia`);
  } else {
    heroBand(ctx, hero, w, bandH);
    withTextShadow(ctx, () => {
      brandLine(ctx, pad, 112, 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 28px ${SANS}`;
      ctx.fillText(`Daily challenge #${number} · ${dateLabel}`, pad, 156);
    });

    scoreBlock(ctx, result, pad, 540, 200);
    const right = w - pad;
    ctx.textAlign = 'right';
    ctx.fillStyle = CORAL;
    ctx.font = `800 40px ${SANS}`;
    ctx.fillText(result.rating.title, right, 466);
    ctx.fillStyle = '#ffffff';
    fitFont(ctx, challenge.title, `italic 400 {s}px ${SERIF}`, 40, 520, 24);
    ctx.fillText(challenge.title, right, 514);
    if (rankText) {
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = `600 24px ${SANS}`;
      ctx.fillText(rankText, right, 552);
    }
    ctx.textAlign = 'left';

    routeTiles(ctx, stops, stopImages, { x: pad, y: 610, w: w - pad * 2, tileH: 300, nameSize: 30 });

    // bars in two columns
    const colW = (w - pad * 2 - 60) / 2;
    scoreBars(ctx, result.components.slice(0, 2), { x: pad, y: 1002, w: colW, rowH: 74, label: 26 });
    scoreBars(ctx, result.components.slice(2), { x: pad + colW + 60, y: 1002, w: colW, rowH: 74, label: 26 });
    footer(ctx, w, h - 170, pad, SITE_DISPLAY ? '' : `${challenge.region}, Croatia`);
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), 'image/png'),
  );
}

/**
 * Share via the Web Share API (with the image when supported), falling back
 * to downloading the PNG. Returns 'shared' | 'downloaded' | 'cancelled'.
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
