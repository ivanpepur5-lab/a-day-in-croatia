# A Day in Croatia

A mobile-first daily travel puzzle. Everyone gets the same challenge each day, for example:

> You have 8 hours in Split, a budget of €75 for two people, and no rental car. Build the best possible day by selecting and arranging four experiences.

You pick 4 of 8 experiences, drag them into order, and get a score out of 100 that shows exactly how it was worked out. Then you can share the result.

> **Partly verified data.** Every price, hour and transport fact is labelled **✓ Verified** (official source, link and last-verified date), **⚠ Needs re-check** (an old verification or an expired price list), **? Unverified**, or **≈ Estimate** (a game value, never shown as an official price). Visit times and travel times are always estimates.
>
> **Updating prices, hours or transport:** edit `src/data/travel-data.json` (no code changes needed), then run `npm run audit`. Guide: [docs/EDITING_DATA.md](docs/EDITING_DATA.md). Open items: [docs/UNVERIFIED.md](docs/UNVERIFIED.md).

## New: Croatia Adventure (prototype)

A five-day narrative holiday game with humour, branching choices, ten endings, a narrator who remembers your mistakes, achievements and 56 collectible **real-world Local Insider tips**. Open it at `/#adventure`, or from the card on the puzzle's intro. It's a separate mode, and the puzzle below is unchanged. Design, rules and accuracy policy: [docs/ADVENTURE.md](docs/ADVENTURE.md).

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run audit      # validate travel data (missing sources, stale dates) and regenerate docs/UNVERIFIED.md
npm run audit:check  # same, exits 1 on errors (use before deploying)
npm test           # unit tests (Vitest); timezone tests also re-run under TZ=America/Los_Angeles and TZ=Pacific/Kiritimati
npm run build
node scripts/e2e-adventure.mjs   # Croatia Adventure phone playthrough (after a build)
npm run test:e2e   # plays the game at 360/390/430 px widths with real touch drag, against the build (needs Playwright on the machine)
# to check that the share domain appears on images:
VITE_SITE_URL=https://play.example.org npm run build && E2E_SITE_URL=https://play.example.org npm run test:e2e
```

## Gameplay

1. **Mission:** time window, budget, party size, transport and requirements.
2. **Pick:** choose exactly 4 of 8 cards. Live time and cost estimates appear in the bottom dock.
3. **Arrange:** drag the handle (or use the ↑/↓ buttons) to set the order. The timeline, travel legs, time and budget meters and requirement checks all update live. The day always starts and ends at Split Riva.
4. **Results:** an animated score, a breakdown of each part, your **exact rank among all 1,680 possible plans** (ties shown), the highest score possible that day, an optional reveal of the best plan, stats and streak, and a countdown to the next challenge.
5. **Share:** a PNG result card in two formats, **Story 1080×1920** (Instagram/Facebook Stories, WhatsApp Status) and **Post 1080×1350** (feeds, chats). It shows photo tiles of your route. The on-screen preview is the exported image itself. Plus spoiler-light share text.

### Daily challenge timing

There is one puzzle day for everyone, defined in **Europe/Zagreb** time. The challenge changes at midnight in Croatia, whatever timezone the device is in. If a tab stays open past midnight, the app shows a "new challenge" banner instead of mixing days. A saved result only counts for the exact puzzle number and challenge it was played on.

### Production URL on share cards

Set `VITE_SITE_URL=https://your-domain` in Netlify. Without it, Netlify builds fall back to the site's main URL (`URL`). The URL is never taken from `window.location`, and localhost/non-https values are rejected. If no URL is configured, none is printed.

You get one official attempt per day. Practice rounds don't change your official score.

## Scoring (deterministic, 0–100)

| Component | Max | Rule |
|---|---|---|
| Time efficiency | 40 | Time spent at experiences ÷ 75% of available time (capped at 40). Finishing late costs 1 point per 2 minutes. |
| Budget management | 25 | 20 points for staying within budget, plus up to 5 for keeping 20% in reserve. Overspending reduces the 20 linearly to 0 at 25% over budget. |
| Route efficiency | 20 | Fastest possible travel time for the same 4 stops ÷ your travel time. |
| Mission | 15 | Split equally between the challenge's requirements. |

Each component is rounded to a whole number, and the total is their sum. All constants live in `src/engine/scoring.js` and are shown in-game under "How to play".

**Travel model** (`src/engine/travel.js`): road km = straight-line km × 1.3. Legs up to 2.5 km are walked at 4.5 km/h and are free. Longer legs are estimated buses: 15 min wait + the first 15 km at 28 km/h + the rest at 50 km/h, rounded up to 5 min, with an illustrative fare of €2 + €0.10/km per person. This is a model, not a timetable.

## Project structure

```
src/
  data/        locations.js (8 Split-region locations, illustrative), challenges.js (daily rotation)
  config.js    production site URL (for share output)
  data/photos.js  licensed photo metadata
  engine/      pure game logic, no React
    analysis.js      exhaustive analysis: exact rank, max score, best plans
    travel.js        leg estimates
    itinerary.js     timed plan, totals, constraints, formatters
    scoring.js       the 4 score components + ratings
    requirements.js  mission rule types
    solver.js        exhaustive best plan and percentile
    daily.js         puzzle number, challenge of the day (local date, DST-safe)
    selection.js     pick and reorder rules
    gameReducer.js   intro → pick → arrange → results state machine
    share.js         share text
  services/    storage.js (localStorage), supabase.js (optional), shareImage.js (canvas PNG), pwa.js
  ui/          screens/, components/, art/ (illustrated destination posters), hooks.js
  styles/      app.css
tests/         engine.test.js
scripts/       e2e.mjs (phone playthrough), icons.mjs (PNG icons from SVG)
supabase/      schema.sql
public/        manifest, service worker, icons
```

## Photography

All destination and hero images are real photographs from Wikimedia Commons (`src/data/photos.js`, files in `public/images/photos/`). Each has its author, licence and source recorded, and credits are shown in the app. See [docs/PHOTO_CREDITS.md](docs/PHOTO_CREDITS.md). The SVG posters in `src/ui/art/` are used only if a photo fails to load. `npm run og` regenerates the 1200×630 link-preview image (`public/og-image.jpg`).

## Adding challenges

Add an entry to `CHALLENGES` in `src/data/challenges.js`. Requirement types are `category` (with `min`), `startWith` and `finishWith`. The test suite checks that every challenge has a valid best plan scoring at least 90 with all requirements met.

## PWA and offline

`public/manifest.webmanifest` and `public/sw.js` (registered only in production builds) make the app installable. Pages are fetched network-first so the daily puzzle stays fresh, and assets use stale-while-revalidate. Progress is stored in `localStorage`. Only the plan order is saved, and scores are always recomputed by the engine.

## Supabase (disabled)

The game works fully without a backend. The Supabase adapter stays **off** until `supabase/schema.sql` has been reviewed (open points are in [docs/SUPABASE_REVIEW.md](docs/SUPABASE_REVIEW.md)). Turning it on requires `VITE_ENABLE_SUPABASE=true` plus the URL and anon key.

## Deploying to Netlify

`netlify.toml` configures `npm run build`, publishes `dist`, adds an SPA fallback, and sets long-lived caching for hashed assets and `no-cache` for `sw.js`. Connect the repository and deploy. No paid APIs, and no AI calls during gameplay.
