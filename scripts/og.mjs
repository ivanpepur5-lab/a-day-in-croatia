// Renders public/og-image.jpg (1200×630 link preview for WhatsApp/Facebook/X)
// from the licensed hero photo, using the pre-installed Playwright Chromium.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = fileURLToPath(new URL('..', import.meta.url));
const f = (p) => `file://${root}${p}`;
const html = `<!doctype html><html><head><style>
@font-face{font-family:F;src:url(${f('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2')});font-weight:100 900}
@font-face{font-family:F;font-style:italic;src:url(${f('node_modules/@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2')});font-weight:100 900}
@font-face{font-family:M;src:url(${f('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')});font-weight:200 800}
*{margin:0}body{width:1200px;height:630px;position:relative;overflow:hidden;font-family:M;color:#fff}
img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 55%}
.s{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,34,51,.88) 0%,rgba(10,34,51,.55) 45%,rgba(10,34,51,0) 75%)}
.t{position:absolute;left:72px;top:150px}
.b{font-weight:800;letter-spacing:.22em;font-size:22px;color:#f3d9b8}
h1{font-family:F;font-weight:600;font-size:96px;line-height:.95;letter-spacing:-.03em;margin-top:18px}
h1 em{font-weight:400}
p{font-family:F;font-style:italic;font-size:32px;margin-top:22px;opacity:.95}
.c{position:absolute;right:12px;bottom:10px;font-size:13px;padding:3px 8px;border-radius:6px;background:rgba(10,34,51,.6)}
</style></head><body><img src="${f('public/images/photos/split-hero-1920.jpg')}">
<div class="s"></div><div class="t"><div class="b">THE DAILY TRAVEL PUZZLE</div><h1>A Day in<br><em>Croatia</em></h1><p>Can you plan the perfect day in Split?</p></div>
<div class="c">Photo: Bernard Gagnon · CC BY-SA 4.0</div></body></html>`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const file = join(mkdtempSync(join(tmpdir(), 'og-')), 'og.html');
writeFileSync(file, html);
await page.goto(`file://${file}`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${root}public/og-image.jpg`, type: 'jpeg', quality: 86 });
await browser.close();
console.log('og-image written');
