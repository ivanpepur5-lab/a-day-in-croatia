/**
 * End-to-end playthrough of the Croatia Adventure prototype on phone viewports.
 *   npm run build && node scripts/e2e-adventure.mjs
 */
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const PORT = 4185;
const BASE = `http://localhost:${PORT}`;
const SHOTS = new URL('../screenshots/', import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });
const LOCAL = /localhost|127\.0\.0\.1|:4185/i;

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
      /* not yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('preview server did not start');
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  for (const width of [360, 390, 430]) {
    console.log(`\n— ${width}px —`);
    const context = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await context.addInitScript(() => {
      localStorage.setItem('adic:v1', JSON.stringify({ seenIntro: true }));
      window.__canvasText = [];
      const orig = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (t, ...r) {
        window.__canvasText.push(String(t));
        return orig.call(this, t, ...r);
      };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    // Entry from the original game — which must still work
    await page.goto(BASE);
    await page.getByTestId('start').waitFor();
    check(await page.getByTestId('start').isVisible(), 'original puzzle still loads');
    await page.getByTestId('open-adventure').click();
    await page.getByTestId('adv-daily').waitFor();
    check(page.url().endsWith('#adventure'), 'adventure opens at #adventure');
    if (width === 390) await page.screenshot({ path: `${SHOTS}adv-1-title.png` });

    await page.getByTestId('adv-daily').click();
    await page.getByTestId('hud').waitFor();
    check((await page.getByTestId('hud-money').innerText()) === '€500', 'starts with €500');
    check((await page.getByTestId('hud-energy').innerText()) === '100', 'starts with 100 energy');
    check((await page.getByTestId('hud-happiness').innerText()) === '50', 'starts with happiness 50');

    let decisions = 0;
    let tipsSeen = 0;
    let nights = 0;
    let shotN = 0;
    const seenTitles = new Set();
    for (let guard = 0; guard < 30; guard++) {
      if (await page.getByTestId('adv-ending').count()) break;
      await page.getByTestId('adv-choices').waitFor();
      const title = await page.getByTestId('adv-step-title').innerText();
      seenTitles.add(title);
      const buttons = page.locator('[data-testid^="adv-choice-"]:not([disabled])');
      const n = await buttons.count();
      check(n >= 1 && n <= 4, `“${title}”: ${n} choice(s) available`);
      if (width === 390 && shotN < 3 && guard % 3 === 1) await page.screenshot({ path: `${SHOTS}adv-2-play-${++shotN}.png` });
      // vary choices: alternate first / last available
      await buttons.nth(guard % 2 === 0 ? 0 : n - 1).click();
      decisions++;
      await page.getByTestId('adv-continue').waitFor();
      if (await page.getByTestId('adv-tip').count()) {
        tipsSeen++;
        if (width === 390 && tipsSeen === 1) {
          await page.waitForTimeout(1600);
          await page.screenshot({ path: `${SHOTS}adv-3-outcome-tip.png` });
        }
      }
      if (await page.getByTestId('adv-night').count()) nights++;
      await page.getByTestId('adv-continue').click();
    }
    check(decisions >= 14 && decisions <= 16, `full five-day loop played (${decisions} decisions)`);
    check(nights === 4, `four nights slept (${nights})`);
    check(tipsSeen >= 5, `local tips revealed during play (${tipsSeen})`);

    await page.getByTestId('adv-ending').waitFor();
    const endingTitle = await page.getByTestId('adv-ending-title').innerText();
    check(endingTitle.length > 3, `reached an ending: ${endingTitle}`);
    const score = Number(await page.getByTestId('adv-score').getAttribute('data-score'));
    check(score > 0, `final score ${score}`);
    await page.getByTestId('adv-share-preview').waitFor({ timeout: 10000 });
    await page.waitForTimeout(1600);
    if (width === 390) {
      await page.screenshot({ path: `${SHOTS}adv-4-ending.png` });
      await page.screenshot({ path: `${SHOTS}adv-5-ending-full.png`, fullPage: true });
      for (const fmt of ['story', 'post']) {
        await page.getByTestId(`adv-format-${fmt}`).click();
        await page.getByTestId('adv-share-preview').waitFor();
        await page.waitForTimeout(300);
        const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('adv-share').click()]);
        await dl.saveAs(`${SHOTS}adv-share-${fmt}.png`);
      }
      const drawn = await page.evaluate(() => window.__canvasText);
      check(!drawn.some((t) => LOCAL.test(t)), 'no localhost on the exported cards');
      check(drawn.includes(endingTitle), 'card shows the ending title');
      check(!LOCAL.test(await page.getByTestId('adv-share-text').innerText()), 'no localhost in share text');
    }

    // overflow
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(over <= 0, `no horizontal overflow (${over}px)`);

    // collection persists
    await page.getByText('Open your full collection').click();
    await page.getByTestId('adv-collection-screen').waitFor();
    const unlocked = await page.locator('.adv-tipgrid--album .tipcard:not(.tipcard--locked)').count();
    check(unlocked >= 5, `collection shows unlocked tips (${unlocked})`);
    if (width === 390) await page.screenshot({ path: `${SHOTS}adv-6-collection.png` });
    await page.reload();
    await page.getByTestId('adv-collection').waitFor();
    check(/collection · \d+\/\d+/.test(await page.getByTestId('adv-collection').innerText()), 'collection count persists after reload');
    check(/replay for fun/.test(await page.getByTestId('adv-daily').innerText()), 'daily result recorded (replay label)');

    // resume a run in progress after reload
    await page.getByTestId('adv-free').click();
    await page.locator('[data-testid^="adv-choice-"]:not([disabled])').first().click();
    await page.getByTestId('adv-continue').click();
    await page.reload();
    await page.getByTestId('adv-resume').waitFor();
    check(await page.getByTestId('adv-resume').isVisible(), 'unfinished holiday can be resumed after reload');
    await page.getByTestId('adv-resume').click();
    await page.getByTestId('hud').waitFor();
    const resumedDay = await page.getByTestId('hud-day').innerText();
    check(/Day 1\/5/i.test(resumedDay), `resumed at the right day (${resumedDay})`);

    // back to the puzzle
    await page.getByTestId('adv-back').click();
    await page.getByTestId('adv-back').click();
    await page.getByTestId('start').waitFor();
    check(true, 'back to the original game');
    check(errors.length === 0, `no console errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
    await context.close();
  }
  await browser.close();
} catch (e) {
  failures.push(e.message);
  console.error(e);
} finally {
  server.kill();
}
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll adventure e2e checks passed.');
