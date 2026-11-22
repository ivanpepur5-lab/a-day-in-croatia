/**
 * End-to-end playthrough on an emulated phone, against a production build.
 *   npm run build && npm run test:e2e
 * Uses the Playwright that is available on the machine (not a project dependency).
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { scorePlan } from '../src/engine/scoring.js';
import { getDailyChallenge } from '../src/engine/daily.js';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const SHOTS = new URL('../screenshots/', import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });

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

try {
  await waitForServer();
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

  await page.goto(BASE);
  const { challenge } = getDailyChallenge(new Date());

  // First visit opens "How to play"
  await page.getByRole('dialog').waitFor();
  check(await page.getByRole('dialog').getByText('How scoring works').isVisible(), 'how-to-play opens on first visit');
  await page.screenshot({ path: `${SHOTS}0-howto.png` });
  await page.getByRole('button', { name: 'Got it' }).click();

  await page.screenshot({ path: `${SHOTS}1-intro.png` });
  check(await page.getByText(challenge.brief).isVisible(), 'mission brief shown');
  await page.getByTestId('start').click();

  // Pick
  await page.getByText(`Choose ${challenge.picks} experiences`).waitFor();
  check((await page.locator('[data-testid^="card-"]').count()) === 8, '8 experience cards shown');
  check(await page.getByTestId('to-arrange').isDisabled(), 'cannot continue with 0 picks');

  const picks = ['marjan', 'salona', 'bacvice', 'diocletians-palace'];
  for (const id of picks) await page.getByTestId(`card-${id}`).locator('.xcard__hit').click();
  // 5th pick is refused
  await page.getByTestId('card-krka').locator('.xcard__hit').click();
  check(
    (await page.getByTestId('card-krka').getAttribute('class')).includes('is-selected') === false,
    'fifth pick is refused',
  );
  check(await page.getByText('Your day is full').isVisible(), 'full-day message shown');
  // toggle off & on again
  await page.getByTestId('card-bacvice').locator('.xcard__hit').click();
  check((await page.locator('.xcard.is-selected').count()) === 3, 'tapping a chosen card removes it');
  await page.getByTestId('card-bacvice').locator('.xcard__hit').click();

  // info sheet
  await page.getByRole('button', { name: 'About Krka National Park' }).click();
  check(await page.getByRole('dialog').getByText('illustrative values').isVisible(), 'detail sheet shows illustrative note');
  await page.screenshot({ path: `${SHOTS}3-detail.png` });
  await page.getByRole('button', { name: 'Close' }).click();
  await page.screenshot({ path: `${SHOTS}2-pick.png` });

  await page.getByTestId('to-arrange').click();

  // Arrange — selection order: marjan, salona, palace, bacvice
  await page.getByText('Order your day').waitFor();
  const order = async () =>
    page.locator('[data-testid^="stop-"]').evaluateAll((els) => els.map((e) => e.dataset.id));
  check(JSON.stringify(await order()) === JSON.stringify(['marjan', 'salona', 'diocletians-palace', 'bacvice']), 'stops start in pick order');

  // Arrow buttons: move Marjan (0) to the end
  for (let i = 0; i < 3; i++) await page.getByTestId(`down-${i}`).click();
  check(JSON.stringify(await order()) === JSON.stringify(['salona', 'diocletians-palace', 'bacvice', 'marjan']), 'arrow buttons reorder');

  // Drag the Palace handle above Salona (touch-like pointer drag)
  const handle = page.getByTestId('stop-1').locator('.stop__handle');
  const target = page.getByTestId('stop-0');
  const hb = await handle.boundingBox();
  const tb = await target.boundingBox();
  await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
  await page.mouse.down();
  for (let s = 1; s <= 12; s++) {
    await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2 - ((hb.y - tb.y + 20) * s) / 12);
    await page.waitForTimeout(16);
  }
  await page.mouse.up();
  await page.waitForTimeout(300);
  const dragged = await order();
  check(JSON.stringify(dragged) === JSON.stringify(['diocletians-palace', 'salona', 'bacvice', 'marjan']), `drag-and-drop reorders (${dragged.join(',')})`);

  // Fix to the expert order with arrows: palace, bacvice, salona, marjan
  await page.getByTestId('up-2').click();
  const finalOrder = await order();
  check(JSON.stringify(finalOrder) === JSON.stringify(['diocletians-palace', 'bacvice', 'salona', 'marjan']), 'final order set');
  await page.screenshot({ path: `${SHOTS}4-arrange.png`, fullPage: true });

  const timeText = await page.getByTestId('meter-time').innerText();
  check(/\d/.test(timeText), `time meter shows a value (${timeText.replace(/\s+/g, ' ')})`);

  await page.getByTestId('submit').click();

  // Results
  const expected = scorePlan(challenge, finalOrder).total;
  await page.getByTestId('final-score').waitFor();
  const shown = Number(await page.getByTestId('final-score').getAttribute('data-score'));
  check(shown === expected, `UI score ${shown} equals engine score ${expected}`);
  await page.getByText('possible plans').waitFor();
  await page.waitForTimeout(1800);
  check((await page.getByTestId('final-score').innerText()) === String(expected), 'score count-up lands on the final value');
  check((await page.locator('[data-testid^="component-"]').count()) === 4, 'four score components shown');
  check(await page.getByTestId('share-card').isVisible(), 'share card rendered');
  await page.screenshot({ path: `${SHOTS}5-results.png` });
  await page.screenshot({ path: `${SHOTS}6-results-full.png`, fullPage: true });

  // Share image download fallback (headless has no Web Share)
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('share-image').click()]);
  const file = `${SHOTS}share-card.png`;
  await download.saveAs(file);
  check(download.suggestedFilename().endsWith('.png'), 'share image downloads as PNG');

  // Persistence: reload shows the saved official result
  await page.reload();
  await page.getByTestId('final-score').waitFor();
  check(Number(await page.getByTestId('final-score').getAttribute('data-score')) === expected, 'result persists after reload');

  // Practice round does not overwrite the official result
  await page.getByTestId('practice').click();
  for (const id of ['krka', 'omis', 'trogir', 'klis']) await page.getByTestId(`card-${id}`).locator('.xcard__hit').click();
  await page.getByTestId('to-arrange').click();
  await page.getByTestId('submit').click();
  await page.getByText('Practice round', { exact: false }).first().waitFor();
  const practiceScore = Number(await page.getByTestId('final-score').getAttribute('data-score'));
  check(practiceScore === scorePlan(challenge, ['krka', 'omis', 'trogir', 'klis']).total, `practice score correct (${practiceScore})`);
  await page.reload();
  await page.getByTestId('final-score').waitFor();
  check(Number(await page.getByTestId('final-score').getAttribute('data-score')) === expected, 'official result unchanged by practice');

  // No horizontal scroll on the phone
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 0, `no horizontal overflow (${overflow}px)`);

  // PWA bits
  const manifest = await (await fetch(`${BASE}/manifest.webmanifest`)).json();
  check(manifest.icons.length >= 3 && manifest.display === 'standalone', 'manifest is installable');
  check((await fetch(`${BASE}/sw.js`)).ok, 'service worker served');

  check(errors.length === 0, `no console errors${errors.length ? `: ${errors.join(' | ')}` : ''}`);
  await browser.close();
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
