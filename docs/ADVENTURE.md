# Croatia Adventure (prototype)

A five-day narrative holiday game, built as a **separate mode** alongside the original *A Day in Croatia* puzzle. Open it at `/#adventure`, or from the card on the puzzle's intro screen. The puzzle itself is unchanged.

## The loop

You start with **€500, 5 days, 100 energy and 50 happiness**.

1. **Day 0: choose your base.** Hostel, apartment or boutique hotel. Each has a different nightly cost and energy recovery, and the choice is permanent.
2. **Each of the 5 days:**
   1. **Travel decision.** It determines the destination, and the route branches: Split → Trogir, Omiš or Krka → Hvar, Brač or the mainland → stay, island-hop or go back → Dubrovnik or a farewell day in Split.
   2. **Activity decision.** Three activities per destination, picked per seed so replays differ.
   3. **Event.** Drawn from 27 events, filtered by destination and by conditions such as having a rental car, low energy, many local points or the last day. Each event has 2–3 choices, and some contain a seeded dice roll (🎲 risky).
   4. **Consequences.** Money, energy, happiness, adventure, local points and flags.
   5. **Night.** You pay for your bed and recover energy. If you can't afford it, you sleep on a bench. Going to bed exhausted costs happiness.

   If energy or happiness hits 0, the holiday ends immediately in **Tourist Disaster**.
3. **Ending.** The first matching ending in this order wins: Tourist Disaster, Croatia Legend, Island Explorer, Local Insider, Budget Master, Fjaka Champion, Happy Holidaymaker.
4. **Score screen.** It shows a transparent breakdown, achievements, the tips found and a share card (Story 9:16 or Post 4:5).

Tracked throughout and always visible in the HUD: money, energy, happiness, adventure ★, local insider 🗝️, tips found, the day and time of day (morning, afternoon, evening), and destination progress (7 dots).

## Daily challenge

The daily seed is `daily-YYYY-MM-DD`, using the same puzzle day as the original game (it changes at midnight in Croatia). Every random draw (event choice, activity selection, dice rolls) is derived from `(seed, day, purpose)`, so **everyone who makes the same choices sees exactly the same events and outcomes**. The first daily result is recorded. Replays and free play (random seed) don't change it.

## Local Insider tips

There are 47 collectible cards in 7 categories: Local Secrets, Tourist Traps, Dalmatian Life, Food & Drinks, Island Life, Survival Mode and Hidden Croatia. Every card has the tip, **why it matters**, and an accuracy label:

| Label | Meaning | Rules |
|---|---|---|
| ✓ **Verified** | Backed by an official source from `src/data/travel-data.json` (Promet Split fares, Krka 2026 price list, Trogir and Omiš tourist boards, Archaeological Museum in Split) | Source id and date; the audit warns when it's stale or expired |
| ✎ **Editorial** | General knowledge: language, food, culture, practical habits | **No prices, times, durations or distances**, enforced by a test. Listed in `docs/UNVERIFIED.md` for periodic human review |

Story text is always labelled **Story**, and the in-game money is fictional (the title screen says so). Tip cards are labelled **Real-world tip**. A test checks that every price mentioned in a tip is a verified one.

The collection, achievements, endings discovered and daily results are stored on the device (`localStorage`, key `adic:adventure:v1`). An unfinished holiday can be resumed after a reload.

## Achievements

Konoba Expert, Island Survivor, Local Explorer, Market Master, Budget Genius, Croatian Legend.

## Balance

`node scripts/adventure-sim.mjs 20000` plays thousands of runs with five strategies: random, cheap, fun, local and deliberately bad. In the current tuning, play style drives the ending:
- **Local play** usually ends in Local Insider.
- **Thrifty play** ends in Budget Master or Local Insider.
- **Island-chasing** ends in Island Explorer.
- **Bad decisions** end in Tourist Disaster about 90% of the time.
- **Random play** spreads across all seven endings, with Croatia Legend the rarest.

The tests assert that every ending, event, achievement and tip is reachable, that no ending exceeds 50% of runs, and that there are no dead ends (a free "improvise" option appears when you can't afford anything).

The balance knobs are `BALANCE` in `src/adventure/engine/game.js`. Happiness gains have diminishing returns, energy costs ×1.25, and there's a tired-at-night penalty.

## Files

```
src/adventure/
  data/story.js        destinations, bases, travel/activities/events, achievements, endings (fiction)
  data/tips.js         Local Insider tips (real-world, verified or editorial)
  engine/game.js       pure, deterministic engine: newGame / getStep / choose / computeScore
  services/progress.js collection, daily results, autosave
  services/shareCard.js share text + canvas card (same identity as the puzzle card)
  ui/                  Hud, TipCard, EndingScreen, Collection
  AdventureApp.jsx     screens and flow (lazy-loaded at #adventure)
  adventure.css
tests/adventure.test.js
scripts/e2e-adventure.mjs  phone playthrough at 360/390/430 px
scripts/adventure-sim.mjs  balance simulator
```

## Adding content

- **Event:** add an object to `EVENTS` with `where`, an optional `when(state)`, a `weight` and 2–3 `choices`, each with `effects`, `result` and an optional `tip`. Run `npm test`: it fails if the event is unreachable, has no consequences, or references an unknown tip.
- **Tip:** add it to `TIPS`. If it states a price, rule or schedule, it must be `verified` with a source from `travel-data.json`. Otherwise mark it `editorial` and keep numbers out. Every tip must be awarded by at least one choice.
