/**
 * End-to-end checks against a production build, on phone-sized viewports.
 *
 *   npm run build && npm run test:e2e
 *   E2E_SITE_URL=https://play.example.org  → expects that domain on share output
 *
 * Covers: full playthrough, touch drag-and-drop (real touch events), sticky
 * header / dock / footer overlaps at 360, 390 and 430 px, exact rank, share
 * images in both formats, and that no localhost URL appears anywhere in
 * shared output (share text, DOM, and every string drawn on the canvas).
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { scorePlan } from '../src/engine/scoring.js';
import { getDailyChallenge } from '../src/engine/daily.js';
import { analyzeChallenge, rankOf } from '../src/engine/analysis.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const EXPECT_DOMAIN = (process.env.E2E_SITE_URL || '').replace(/^https:\/\//, '').replace(/^www\./, '');
const SHOTS = new URL('../screenshots/', import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });
const LOCAL = /localhost|127\.0\.0\.1|0\.0\.0\.0|:4179/i;

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: new URL('..', import.meta.url).pathname,
  stdio: 'ignore',
});
const failures = [];
const check = (cond, msg) => {
  console.log(`${cond ? '✓' : '✗'} ${msg}`);
  if (!cond) failures.push(msg);
};

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('preview server did not start');
}

/** Record every string drawn on any canvas. */
const CANVAS_SPY = () => {
  window.__canvasText = [];
  const orig = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (text, ...rest) {
    window.__canvasText.push(String(text));
    return orig.call(this, text, ...rest);
  };
};

async function newPhone(browser, width) {
  const context = await browser.newContext({
    viewport: { width, height: 800 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36',
  });
  await context.addInitScript(CANVAS_SPY);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return { context, page, errors };
}

/** Real touch drag via CDP (touchStart → touchMove… → touchEnd). */
async function touchDrag(page, from, to, steps = 16) {
  const cdp = await page.context().newCDPSession(page);
  const pt = (x, y) => [{ x, y, radiusX: 4, radiusY: 4, force: 1, id: 1 }];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pt(from.x, from.y) });
  await page.waitForTimeout(60);
  for (let i = 1; i <= steps; i++) {
    const x = from.x + ((to.x - from.x) * i) / steps;
    const y = from.y + ((to.y - from.y) * i) / steps;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pt(x, y) });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(350);
}

const center = (b) => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });

/**
 * Overlap audit:
 *  1. at rest (scrollY = 0) no content starts underneath the sticky header;
 *  2. at the bottom of the page, every element can be scrolled fully above
 *     the fixed dock (nothing is permanently hidden behind it);
 *  3. no horizontal scrolling.
 */
async function overlapAudit(page, label) {
  return page.evaluate(async (label) => {
    const problems = [];
    const header = document.querySelector('.topbar');
    const dock = document.querySelector('.dock__inner');
    const sel = 'h1,h2,h3,p,button,a,.stop,.xcard,.meter,li.node,li.leg,.footer p';
    const targets = () =>
      [...document.querySelectorAll(sel)].filter((el) => !el.closest('.topbar, .dock, .sheet') && el.getClientRects().length);
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 50));
    const hb = header.getBoundingClientRect();
    for (const el of targets()) {
      const r = el.getBoundingClientRect();
      if (r.height && r.top < hb.bottom - 1 && r.bottom > hb.top) problems.push(`${label}: under header at rest: ${el.textContent.trim().slice(0, 40)}`);
    }
    if (dock) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 80));
      const db = dock.getBoundingClientRect();
      for (const el of targets()) {
        const r = el.getBoundingClientRect();
        if (r.height && r.bottom > db.top + 1 && r.top < window.innerHeight) problems.push(`${label}: unreachable behind dock: ${el.textContent.trim().slice(0, 40)}`);
      }
    }
    const over = document.documentElement.scrollWidth - window.innerWidth;
    if (over > 0) problems.push(`${label}: horizontal overflow ${over}px`);
    window.scrollTo(0, 0);
    return problems;
  }, label);
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  const { challenge, number } = getDailyChallenge(new Date());
  const analysis = analyzeChallenge(challenge);

  for (const width of [360, 390, 430]) {
    console.log(`\n— ${width}px —`);
    const { context, page, errors } = await newPhone(browser, width);
    await page.goto(BASE);

    await page.getByRole('dialog').waitFor();
    if (width === 390) {
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${SHOTS}${width}-0-howto.png` });
    }
    await page.getByRole('button', { name: 'Got it' }).click();

    // Intro — real hero photo + credit
    const heroSrc = await page.locator('.intro__art img').getAttribute('src');
    check(/split-hero/.test(heroSrc), `hero is the licensed Split photograph (${heroSrc})`);
    await page.waitForFunction(() => document.querySelector('.intro__art img')?.complete);
    check(await page.locator('.intro__credit').isVisible(), 'hero shows photo credit');
    await page.screenshot({ path: `${SHOTS}${width}-1-intro.png` });
    for (const p of await overlapAudit(page, 'intro')) check(false, p);

    await page.getByTestId('start').click();
    await page.getByText(`Choose ${challenge.picks} experiences`).waitFor();
    check((await page.locator('.xcard img').count()) === 8, '8 cards with photographs');

    const picks = ['marjan', 'salona', 'bacvice', 'diocletians-palace'];
    for (const id of picks) await page.getByTestId(`card-${id}`).locator('.xcard__hit').click();
    await page.getByTestId('card-krka').locator('.xcard__hit').click();
    check(!(await page.getByTestId('card-krka').getAttribute('class')).includes('is-selected'), 'fifth pick refused');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SHOTS}${width}-2-pick.png` });
    for (const p of await overlapAudit(page, 'pick')) check(false, p);

    // dock must fit inside the viewport
    const dockBox = await page.locator('.dock__inner').boundingBox();
    check(Math.abs(dockBox.y + dockBox.height - (800 - 10)) <= 2, `dock is pinned to the bottom of the screen (bottom at ${Math.round(dockBox.y + dockBox.height)})`);
    check(dockBox.x >= 0 && dockBox.x + dockBox.width <= width, `dock fits in ${width}px (${Math.round(dockBox.width)}px)`);
    const clipped = await page.locator('.dock__summary span').evaluateAll((els) =>
      els.filter((e) => e.getBoundingClientRect().right > document.querySelector('.dock__cta').getBoundingClientRect().left + 1 || e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent),
    );
    check(clipped.length === 0, `dock summary is not clipped${clipped.length ? `: ${clipped.join(' | ')}` : ''}`);
    const ctaBox = await page.getByTestId('to-arrange').boundingBox();
    check(ctaBox.x + ctaBox.width <= width - 4, 'Arrange button fully visible');

    // detail sheet with facts & sources
    await page.getByRole('button', { name: 'About Salona' }).click();
    const dialog = page.getByRole('dialog');
    check((await dialog.locator('.fact--verified').count()) >= 2, 'Salona shows verified facts');
    check(await dialog.getByRole('link', { name: /Archaeological Museum in Split — ticket prices/ }).first().isVisible(), 'verified fact links to its source');
    check(await dialog.getByText(/last verified 23 Nov 2026/).first().isVisible(), 'verified fact shows last-verified date');
    check((await dialog.getByTestId('detail-price').locator('[data-state="verified"]').count()) >= 1, 'Salona price shown as verified');
    if (width === 390) {
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${SHOTS}${width}-3-detail.png` });
    }
    // sheet must sit above the sticky header
    const sheetTop = await page.locator('.sheet').evaluate((el) => getComputedStyle(el).zIndex);
    check(Number(sheetTop) > 30, 'sheet stacks above sticky header');
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'About Krka National Park' }).click();
    check((await dialog.locator('.fact--unverified').count()) >= 1, 'Krka shows unverified label');
    const krkaPrice = await dialog.getByTestId('detail-price').innerText();
    check(/≈€30/.test(krkaPrice) && /est\./.test(krkaPrice) && !krkaPrice.includes('✓'), `Krka game price is labelled an estimate (${krkaPrice.replace(/\s+/g, ' ')})`);
    await page.getByRole('button', { name: 'Close' }).click();

    // every card: estimates carry "est.", only verified prices carry ✓
    const cardPrices = await page.locator('[data-testid^="price-"]').evaluateAll((els) =>
      els.map((e) => ({ id: e.dataset.testid, state: e.dataset.state, text: e.textContent })),
    );
    const mislabelled = cardPrices.filter((p) =>
      p.state === 'verified' ? !p.text.includes('✓') || p.text.includes('≈') : !p.text.includes('est.') || p.text.includes('✓'),
    );
    check(cardPrices.length === 8 && mislabelled.length === 0, `card prices labelled verified/estimate correctly${mislabelled.length ? `: ${JSON.stringify(mislabelled)}` : ''}`);

    await page.getByTestId('to-arrange').click();
    await page.getByText('Order your day').waitFor();
    const disclosure = await page.getByTestId('estimate-disclosure').innerText();
    check(/includes €24 of estimated costs: Palace entry ≈€24/.test(disclosure), `estimate disclosure lists estimated costs (${disclosure.slice(0, 80)}…)`);
    const order = () => page.locator('[data-testid^="stop-"]').evaluateAll((els) => els.map((e) => e.dataset.id));
    check(JSON.stringify(await order()) === JSON.stringify(picks), 'stops start in pick order');

    // Touch drag: drag stop #3 (Bačvice) by its handle up to the top slot
    await page.getByTestId('stop-0').evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 140));
    await page.waitForTimeout(200);
    const handle = page.getByTestId('stop-2').locator('.stop__handle');
    const hb = await handle.boundingBox();
    check(hb.width >= 40 && hb.height >= 44, `drag handle is a comfortable touch target (${Math.round(hb.width)}×${Math.round(hb.height)})`);
    const top = await page.getByTestId('stop-0').boundingBox();
    await touchDrag(page, center(hb), { x: center(hb).x, y: top.y + 8 });
    const afterTouch = await order();
    check(afterTouch[0] === 'bacvice', `touch drag moves a stop (${afterTouch.join(', ')})`);

    // page must still scroll by touch outside the handle (card body)
    const before = await page.evaluate(() => window.scrollY);
    const body = await page.getByTestId('stop-1').locator('.stop__body').boundingBox();
    await touchDrag(page, center(body), { x: center(body).x, y: center(body).y - 200 }, 8);
    const afterScroll = await page.evaluate(() => window.scrollY);
    check(JSON.stringify(await order()) === JSON.stringify(afterTouch), 'swiping a card body does not reorder');
    check(afterScroll !== before || (await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)), 'swiping a card body scrolls the page');

    // finish with arrows: palace, bacvice, salona, marjan
    const target = ['diocletians-palace', 'bacvice', 'salona', 'marjan'];
    for (let guard = 0; guard < 12; guard++) {
      const cur = await order();
      const i = cur.findIndex((id, k) => id !== target[k]);
      if (i < 0) break;
      const j = cur.indexOf(target[i]);
      await page.getByTestId(`up-${j}`).click();
    }
    const finalOrder = await order();
    check(JSON.stringify(finalOrder) === JSON.stringify(target), 'arrow buttons reorder');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${SHOTS}${width}-4-arrange.png` });
    for (const p of await overlapAudit(page, 'arrange')) check(false, p);

    await page.getByTestId('submit').click();

    // Results
    const expected = scorePlan(challenge, finalOrder).total;
    await page.getByTestId('final-score').waitFor();
    check(Number(await page.getByTestId('final-score').getAttribute('data-score')) === expected, `score ${expected} matches engine`);
    await page.getByTestId('rank').waitFor();
    check(/Includes €24 of estimated costs/.test(await page.getByTestId('budget-estimate-note').innerText()), 'results disclose estimated costs');
    const rank = Number(await page.getByTestId('rank').getAttribute('data-rank'));
    const exp = rankOf(analysis, expected);
    check(rank === exp.rank, `exact rank ${rank} of ${analysis.count} matches engine`);
    check(Number(await page.getByTestId('rank').getAttribute('data-max')) === analysis.maxTotal, `max ${analysis.maxTotal} shown`);
    check(!(await page.locator('.results__context').innerText()).includes('%'), 'ranking shows an exact rank, not a percentage');

    await page.getByTestId('share-preview').waitFor({ timeout: 10000 });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${SHOTS}${width}-5-results.png` });
    for (const p of await overlapAudit(page, 'results')) check(false, p);

    if (width === 390) {
      await page.screenshot({ path: `${SHOTS}${width}-6-results-full.png`, fullPage: true });
      for (const fmt of ['story', 'post']) {
        await page.getByTestId(`format-${fmt}`).click();
        await page.waitForFunction((f) => document.querySelector('.share__preview')?.className.includes(f), fmt);
        await page.getByTestId('share-preview').waitFor();
        const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('share-image').click()]);
        const file = `${SHOTS}share-${fmt}.png`;
        await download.saveAs(file);
        const dims = await page.evaluate(async (src) => {
          const img = new Image();
          img.src = src;
          await img.decode();
          return [img.naturalWidth, img.naturalHeight];
        }, await page.getByTestId('share-preview').getAttribute('src'));
        const want = fmt === 'story' ? [1080, 1920] : [1080, 1350];
        check(dims[0] === want[0] && dims[1] === want[1], `${fmt} image is ${dims.join('×')}`);
      }
      const drawn = await page.evaluate(() => window.__canvasText);
      writeFileSync(`${SHOTS}canvas-text.json`, JSON.stringify(drawn, null, 1));
      check(drawn.length > 20, `canvas text recorded (${drawn.length} strings)`);
      check(!drawn.some((t) => LOCAL.test(t)), 'no localhost in any string drawn on share images');
      check(drawn.includes('Palace') && drawn.includes('Marjan'), 'route tiles name the real stops');
      if (EXPECT_DOMAIN) check(drawn.includes(EXPECT_DOMAIN), `configured domain ${EXPECT_DOMAIN} printed on card`);
      else check(!drawn.some((t) => /\.[a-z]{2,}$/i.test(t) && !/\s/.test(t)), 'no domain printed when none is configured');
      const text = await page.getByTestId('share-text').innerText();
      check(!LOCAL.test(text), 'no localhost in share text');
      if (EXPECT_DOMAIN) check(text.includes(EXPECT_DOMAIN), 'share text uses configured domain');
      const html = await page.content();
      check(!/localhost:4179/.test(html.replace(/blob:http:\/\/localhost:4179\/[\w-]+/g, '')), 'no localhost URL rendered in the page (except blob previews)');

      // credits sheet
      await page.getByTestId('open-credits').click();
      check((await page.getByTestId('photo-credits').locator('li').count()) === 12, 'credits list all 12 photographs');
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${SHOTS}${width}-7-credits.png` });
      await page.getByRole('button', { name: 'Close' }).click();

      // persistence
      await page.reload();
      await page.getByTestId('final-score').waitFor();
      check(Number(await page.getByTestId('final-score').getAttribute('data-score')) === expected, 'result persists after reload');
    }

    check(errors.length === 0, `no console errors${errors.length ? `: ${errors.join(' | ')}` : ''}`);
    await context.close();
  }

  const manifest = await (await fetch(`${BASE}/manifest.webmanifest`)).json();
  check(manifest.icons.length >= 3 && manifest.display === 'standalone', 'manifest is installable');
  check((await fetch(`${BASE}/og-image.jpg`)).ok, 'link-preview image served');
  const index = await (await fetch(BASE)).text();
  check(/og:image" content="[^"]*og-image\.jpg"/.test(index), 'index.html has og:image');
  check(!LOCAL.test(index), 'index.html has no localhost references');
  await browser.close();
  console.log(`\nPuzzle #${number} (${challenge.id}), best ${analysis.maxTotal}`);
} catch (e) {
  failures.push(e.message);
  console.error(e);
} finally {
  server.kill();
}

if (failures.length) {
  console.error(`\n${failures.length} e2e check(s) failed`);
  process.exit(1);
}
console.log('\nAll e2e checks passed. Screenshots in ./screenshots');
