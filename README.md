# A Day in Croatia

A mobile-first daily travel puzzle. Everyone gets the same challenge each day, for example:

> You have 8 hours in Split, a budget of €75 for two people, and no rental car. Build the best possible day by selecting and arranging four experiences.

You pick 4 of 8 experiences, drag them into order, and get a score out of 100 that shows exactly how it was worked out. Then you can share the result.

> ⚠️ **Illustrative sample data.** Visit durations, prices and travel times are game estimates. They are **not** live prices, opening hours or public transport timetables. Every location is marked `verified: false` until someone checks it against official sources.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # engine unit tests (Vitest)
npm run build
npm run test:e2e   # plays a full game on an emulated iPhone against the build (needs Playwright installed on the machine)
```

## Gameplay

1. **Mission:** time window, budget, party size, transport and requirements.
2. **Pick:** choose exactly 4 of 8 cards. Live time and cost estimates appear in the bottom dock.
3. **Arrange:** drag the handle (or use the ↑/↓ buttons) to set the order. The timeline, travel legs, time and budget meters and requirement checks all update live. The day always starts and ends at Split Riva.
4. **Results:** an animated score, a breakdown of each part, a comparison with all 1,680 possible plans, an optional reveal of the best plan, stats and streak, and a countdown to the next challenge.
5. **Share:** a PNG result card (uses the Web Share API, or downloads the image if that isn't available) and spoiler-free share text.

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
  engine/      pure game logic, no React
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

## Adding photography

Cards currently show original SVG illustrations (`src/ui/art/LocationArt.jsx`). To use real, licensed photos, put an image in `public/images/` and set the location's `photo` field:

```js
photo: { src: '/images/marjan.jpg', credit: 'Photo: Name / CC BY-SA 4.0', license: 'CC BY-SA 4.0' }
```

The credit is shown on the image. Only use images whose licence you have checked.

## Adding challenges

Add an entry to `CHALLENGES` in `src/data/challenges.js`. Requirement types are `category` (with `min`), `startWith` and `finishWith`. The test suite checks that every challenge has a valid best plan scoring at least 90 with all requirements met.

## PWA and offline

`public/manifest.webmanifest` and `public/sw.js` (registered only in production builds) make the app installable. Pages are fetched network-first so the daily puzzle stays fresh, and assets use stale-while-revalidate. Progress is stored in `localStorage`. Only the plan order is saved, and scores are always recomputed by the engine.

## Supabase (optional)

The game works fully without a backend. To collect global results:

1. Run `supabase/schema.sql` in your Supabase project.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`).

Official results are then posted to `daily_results`, and `fetchDistribution()` reads the anonymous `daily_distribution` view. No SDK is bundled; it calls the PostgREST API with `fetch`.

## Deploying to Netlify

`netlify.toml` configures `npm run build`, publishes `dist`, adds an SPA fallback, and sets long-lived caching for hashed assets and `no-cache` for `sw.js`. Connect the repository and deploy. No paid APIs, and no AI calls during gameplay.
