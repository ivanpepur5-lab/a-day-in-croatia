# Croatia Adventure (playtest build)

A five-day narrative holiday game, built as a **separate mode** next to the original *A Day in Croatia* puzzle. Open it at `/#adventure`, or from the card on the puzzle's intro screen. The puzzle itself is unchanged.

## The loop

You start with **€500, 5 days, 100 energy and 50 happiness**.

1. **Day 0: choose your base.** Hostel (Luka), apartment (Marija) or boutique hotel (Igor). The choice is permanent, and each base has its own characters and storylines.
2. **Each of the 5 days has four decisions:**

   | Time of day | Decision |
   |---|---|
   | ☀️ Morning | **Travel.** The route branches: Split → Trogir, Omiš or Krka → Hvar, Brač or the mainland → stay, island-hop or go back → Dubrovnik or a farewell day in Split. |
   | 🕛 Midday | **Activity.** Three of the destination's activities, picked per seed so replays differ. |
   | 🌤️ Afternoon | **Event.** Drawn from the event library. |
   | 🌙 Evening | **Evening event.** A second slot with its own pool: dinners, bars, the đir, fešte, storms, night swims and confessions from Duje. |

   Then the **night**: you pay for your bed and recover energy. If you can't afford it, you sleep on a bench. Going to bed exhausted costs happiness.

   If energy or happiness hits 0, the holiday ends immediately in **Tourist Disaster**.
3. **Ending and holiday report card.** See below.

A run is **21 decisions** (base + 5 × 4), about 8–12 minutes on a phone.

## Content at a glance

| | Count |
|---|---|
| Events | **101**: 66 everyday and place events, 23 consequence callbacks, 12 hidden discoveries |
| Multi-day storylines | 17 (see below) |
| Activities | 25 across 7 destinations |
| Endings | 10 |
| Local Insider tips | 81: 10 verified with official sources, 71 editorial, of which 9 are flagged for review |
| Achievements | 6 |

## Duje: character guide

Duje is the narrator, a Split local in his thirties, named after Sveti Duje, the city's patron saint. He is fiction; his tips link to real Local Insider cards.

- **Voice:** short sentences, deadpan, one punchline. He is sarcastic about tourists in general but fiercely loyal to *you*. He is never mean when you make a good choice.
- **Running threads**, so he feels like one person across 300+ lines:
  - his **mother**, who hears everything and judges everything;
  - his **cousin Ante**, who runs every side business on the coast;
  - **Hajduk**;
  - **Ivana from the bakery**, whom he can't talk to;
  - **coffee and pomalo**, and his hatred of rushing.
- **Catchphrases:** “I don't make the rules. My grandfather made the rules.” “I'm not saying I told you. I'm saying it again.”
- **The one sincere moment:** the hidden *Sustipan* scene, where he stops joking.

A test enforces that **every event choice has a Duje reaction**.

## Storylines: decisions that connect different days

Pending consequences (`priority` callbacks) jump the queue, so a storyline reliably pays off on a **later day**. A test checks that a payoff never fires on the same day as its seed.

| Storyline | How it starts | How it comes back | Pays off* |
|---|---|---|---|
| The three-kilo fish | Point at the biggest fish | Waiters along the coast recognise you → *Fish Legend* ending; Brian can dethrone you | 85% |
| The rental mirror | Squeeze through a Roman lane | The rental company calls (pay, charm, or blame a goat → a real goat on an island road) | 86% |
| Peka | Pre-order it | It's ready tomorrow, possibly on another island | 90% |
| The wedding | Dance with the procession | The aunt finds you → lunch for 31 → *Adopted by Dalmatia* | 81% |
| Pirate grandpa | Listen in Omiš | His nephew on a ferry → secret cove; grandpa boos Venice at the pirate battle | 80% |
| Party boat · Sunburn · Sea urchin | The obvious mistake | The morning after · the backpack strap · the stairs | 67–79% |
| **Cousin Ante** | “Special price for family” | Taxi boat → souvenir stall → sunglasses stall → *the Ante Network* (meet his mother) | 47% (needs 2+ meetings) |
| **Brian in the Hawaiian shirt** | The airport bus or lost in a town | At the fish tray → day 5: he teaches *your* advice to new tourists | 82% |
| **Duje & Ivana** | Be Duje's wingman at the bakery | He asks for advice (coffee, picigin or serenade) → day 5: did it work? | 98% |
| **Marija's container** | Stuffed peppers in a container | Return it full, empty, or confess you lost it | 100% |
| **Boćanje** | Make up a fourth player | The boćari network finds you in another town | 99% |
| **Pegica the Dalmatian** | Follow the dog | Fishing with her owner (and a lesson about the three-kilo fish) | 93% |
| **Sunglasses** | Drop them in the harbour | Squint mode → buy from… Ante | 93% |
| **The ham** | Win the fešta tombola | You own a whole pršut → give it away or carry it like a pet → it's in your suitcase on day 5 | 98% |
| **Luka's guitar** | Hold it during his night swim | He comes back: “my manager, I booked us a gig” | 99% |
| Your base | Marija, Luka or Igor | The cousin network, the busking duet, Igor's “exclusive experience” | — |

\*Share of runs that triggered the storyline in which the payoff appeared (`node scripts/adventure-sim.mjs`).

Other cross-day links:
- Rubbing **Grgur's toe** in Split improves your luck in later dice rolls (tombola, boće, diving, giving directions).
- Speaking Croatian (*phrases*) unlocks being **mistaken for a local** and the **door in Dubrovnik's wall**.
- Eating at two konobas unlocks the **konoba with no name**.

## Hidden discoveries (12) — made to feel rewarding

Hidden events need something from the player first: local trust, curiosity, Croatian phrases, earlier discoveries or adventure. When you find one:
- a purple **🔎 Hidden discovery** banner shows *“New hidden discovery for your album · 3 of 12 found so far”*;
- it gives a big happiness boost and a **top-ranked moment** for the report card (rank 8–11, so it usually leads your story);
- it unlocks permanently in the **Hidden discoveries album** in the Collection.

Locked entries show a **hint** (e.g. “At Krka, earn enough local trust and a boatman may take you further upriver”), which gives players a concrete goal for the next run.

The discoveries: the beach with no name, Hajduk match night, the other Duje (the cathedral), Radman's mills, Visovac, the Blaca hermits, the door in Dubrovnik's wall, the konoba with no name, the glowing sea, the pirates' lookout above Omiš, Sustipan (Duje's thinking spot) and **Duje's mother**.

## Endings and the holiday story

Ten endings, checked in this order (the first match wins):

| Ending | Condition |
|---|---|
| Tourist Disaster | energy 0, happiness ≤ 25, or broke and unhappy |
| Croatia Legend | score ≥ 1100, happiness ≥ 78, 5+ places, 15+ tips **and at least one hidden discovery** |
| Adopted by Dalmatia | adopted by 2+ families or networks, 2+ konobas, happy |
| The Three-Kilo Fish Legend | owned the fish story along the coast |
| Professional Ferry Hostage | stayed when the wind kept you on the island |
| Island Explorer | both islands, or island-hopping with a wind-cancelled sailing |
| Local Insider | local insider score ≥ 22 |
| Budget Master | €150+ left and happy |
| Fjaka Champion | energy ≥ 75 and happy |
| Happy Holidaymaker | everything else |

**The holiday report card** makes every finish personal and shareable:
- **A story title** from the run's best moment, e.g. *“The Ham”*, *“The Goat Defence”*, *“Duje's Love Story”*, *“The Night the Sea Glowed”*. If no moment has a headline, it falls back to one per ending.
- **Duje's verdict**, a one-liner per ending.
- **A five-day diary**: one line per day, using the day's best moment, or a past-tense line for what you did (“Gave a speech to the lizards in Salona's amphitheatre”).
- **Top 3 moments** and fun stats (coffee hours, rakija toasts, run-ins with Ante, hidden places).

The share text and share card both lead with the ending, the story title and the verdict.

## Balance report

From `node scripts/adventure-sim.mjs 24000` (six strategies × 4,000 runs):

| Ending | All runs | Random play |
|---|---|---|
| Island Explorer | 19.9% | 18.9% |
| Budget Master | 16.5% | 16.8% |
| Tourist Disaster | 16.4% | 2.5% |
| Local Insider | 14.2% | 3.3% |
| Happy Holidaymaker | 9.8% | 27.2% |
| Fjaka Champion | 8.9% | 17.5% |
| Professional Ferry Hostage | 5.6% | 4.0% |
| Adopted by Dalmatia | 5.5% | 2.4% |
| Croatia Legend | 1.7% | 4.0% |
| Three-Kilo Fish Legend | 1.6% | 3.4% |

**Play style drives the ending:**

| Strategy | Most common endings |
|---|---|
| Thrifty | Budget Master 61% |
| Island-chasing (“fun”) | Island Explorer 74%, Ferry Hostage 11% |
| Local | Local Insider 47%, Adopted 20% |
| Careful | Insider 27%, Fjaka 25%, Budget 19% |
| Deliberately bad | **Disaster 90.9%** |

### “10 endings” vs “7 endings”

The previous version of this document said random play “spreads across all **seven** endings”. That sentence was written before the last pass added three endings (Adopted by Dalmatia, Three-Kilo Fish Legend, Professional Ferry Hostage) and was never updated. It was a **stale sentence, not a missing ending**: the simulator already counted all ten.

The old balance was also weaker than that summary suggested:
- Croatia Legend was reached by **8%** of all runs (12% of random runs) — not “the rarest”.
- Fish Legend was actually the rarest, at 1.2%.
- Deliberately bad play still became a Croatia Legend 1.7% of the time.

The current tuning (stricter Legend, adoption needing two families, lower happiness gains per event because there are now twice as many events) gives every ending a real share. Legend is genuinely rare (1.7% overall, 4% for random play, 0.1% for bad play).

### Verifying “about 90% Tourist Disaster for deliberately bad play”

- **Before this pass:** 3,562 of 4,000 bad runs ended in disaster = **89.1%** ✓. But those 3,562 runs were **96%** of *all* disasters in the simulation (3,712 of 20,000 runs = 18.6% overall). Random play ended in disaster only 2.3% of the time. So the 90% figure was correct, but the overall 18.6% disaster rate came almost entirely from the deliberately bad strategy.
- **Now:** **90.9%** of bad runs end in disaster, and disasters are **16.4% of all runs**, of which 92% come from bad play. Random play ends in disaster 2.5% of the time, and careful play 0.8%. Bad runs mostly end by **exhaustion on day 4–5** (17.8 decisions on average instead of 21), which is the intended “you overdid it” story.

### Every ending is reachable through actual gameplay

`node scripts/adventure-endings.mjs` plays real runs (legal choices only, real dice) until each ending has been reached. It saves the seed and the exact choice sequence to `tests/fixtures/ending-paths.json`, and a test **replays all ten** through the engine. Every ending was found within the first 28 runs.

### Repetition between runs

- **Event overlap:** the average share of events two runs of the same strategy have in common (Jaccard) is **0.08–0.10**. Two holidays share fewer than one event in ten.
- **Most common events:** generic evening events (the bill, bevanda, rakija, the fešta) appear in about 26% of runs; no event appears in more than 27%.
- **Rarest events:** Dubrovnik afternoon events (1–2%, because Dubrovnik is only reachable on day 5) and *Mistaken for a Local* (0.6%, a reward for speaking Croatian).

## Play-test log (this pass)

I read eight full transcripts end to end (`node scripts/adventure-transcript.mjs <seed> <first|last|cheap|fun|local|bad|car|island>`). What I found and fixed:

| Found while playing | Fix |
|---|---|
| With one event a day, a run saw 5 of the events, and callbacks crowded out new situations | An evening slot (two events per day, separate pools); a run now sees 10 events |
| The urchin “success” still added “Stepped on a sea urchin” to the report | Dice branches can carry their own report moment |
| The fish callback always said “in Split”, even if you ate the fish in Trogir | It remembers where you ate it |
| The sunburn and urchin callbacks could fire on the same evening (“tomorrow, when you put your backpack on…”) | Payoffs require an earlier day (tested) |
| Morning-type callbacks (“at first light…”) appeared in the afternoon | Rewritten to fit the time of day |
| Ante's boat appeared *after* the reveal of his whole empire | The order is enforced |
| Report diary said “wandered the palace” on a Salona day | The diary uses what you actually did, in the past tense |
| Ante, Brian, Duje's date and Luka paid off in only 5–49% of triggering runs | Follow-ups made into callbacks; now 47–99% |
| Happiness saturated near 90 for every strategy with 10 events | Gains per event lowered (0.85 → 0.6) |

**Still repetitive or weak (honest list):**
- Generic evening events are the most frequent. They are well written but recur across runs for regular players.
- **Thrifty play is a little predictable** (Budget Master 61%) and **island-chasing even more so** (Island Explorer 74%). This is intended, but worth testing with real players.
- Dubrovnik content is under-seen because it's day-5 only.
- Within a single run, several storylines can stack on days 3–5. Usually that's a feature (busy, connected days); occasionally it means one more callback than ideal.
- The humour needs a **local review**: see [`LOCAL_REVIEW.md`](LOCAL_REVIEW.md) and the full script in [`ADVENTURE_SCRIPT.md`](ADVENTURE_SCRIPT.md).

## Local Insider tips: review of all 81

Every card has the tip, **why it matters**, and an accuracy label:

| Label | Meaning | Rules |
|---|---|---|
| ✓ **Verified** | Backed by an official source in `src/data/travel-data.json` (Promet Split fares, Krka 2026 price list, the Trogir and Omiš tourist boards, the Archaeological Museum in Split) | Source id and date; the audit warns when stale |
| ✎ **Editorial** | General knowledge: language, food, culture, practical habits | **No prices, times, durations or distances** (enforced by a test); listed in `docs/UNVERIFIED.md` |
| ✎ + review flag | Editorial tips that state a **rule, custom or local claim** (Sunday trading, the Hvar swimwear rule, no swimming at Krka, returning a dish full, tipping, jugo, the Peškarija “no flies” lore, skradinski rižot, the Dubrovnik stone head) | Listed under “Flagged for review before launch” in `docs/UNVERIFIED.md` and in `LOCAL_REVIEW.md` |

**Review of the original 56:**
- *Radman's Mills*: removed “medieval” from the fortress description, because the source doesn't say it.
- *Hvar from above* and *King's Landing*: rewritten to be useful, not just trivia (when to go; which places fans look for).
- No other factual problems found.

**Overlaps checked:** *Go early*, *June and September* and *the cruise-ship rhythm* cover time of day, season and Dubrovnik specifically, so they're kept as three cards. The most-awarded cards (*pekara*, *go early*) are each given by five choices; repeats show as “Local Insider tip” rather than “New”.

**25 new tips** were added, each tied to a real situation in the new events: taxi-boat prices, tipping, Sunday shops, church dress, swimwear, packing liquids, FKK, jugo, boćanje, returning dishes, the Dalmatian dog, fešta, bevanda, prošek, Peškarija, Grgur's toe, Radovan's portal, the đir, no swimming at Krka, skradinski rižot, Hvar's theatre, the stone head, Visovac, Blaca and the buža bars.

## Daily challenge

The daily seed is `daily-YYYY-MM-DD`, using the same puzzle day as the original game (it changes at midnight in Croatia). Every random draw is derived from `(seed, day, purpose)`, so everyone who makes the same choices sees the same events and outcomes. Only the first daily result counts.

## Files

```
src/adventure/
  data/world.js             shared constants (destinations, helpers)
  data/story.js             narrator, bases, travel, activities, core events, achievements, endings
  data/events/storylines.js multi-day threads (Ante, Brian, Ivana, container, boće, Pegica, ham, …)
  data/events/everyday.js   situations that can happen anywhere (jugo, FKK, Sunday, tipping, …)
  data/events/places.js     place-specific events (Peškarija, Radovan's portal, zipline, maškeron, …)
  data/events/hidden.js     hidden discoveries with hints
  data/tips.js              Local Insider tips (verified / editorial / flagged)
  engine/game.js            deterministic engine (two event slots per day)
  engine/report.js          holiday report card: title, verdict, diary, moments, stats
  services/progress.js      collection, secrets album, daily results, autosave
  services/shareCard.js     share text + canvas card
  ui/                       Hud, TipCard, EndingScreen (with playtest log), Collection (with secrets album)
scripts/adventure-sim.mjs        balance, variety and storyline report
scripts/adventure-endings.mjs    proves every ending is reachable; writes tests/fixtures/ending-paths.json
scripts/adventure-transcript.mjs prints a full readable run
scripts/adventure-script.mjs     writes docs/ADVENTURE_SCRIPT.md for reviewers
scripts/e2e-adventure.mjs        phone playthrough at 360/390/430 px
```

## Adding content

- **Event:** add it to the right file in `data/events/`. Give it `where`, an optional `when(state)`, a `slot` (`'day'` or `'evening'`), a `weight` and 2–3 `choices`. Each choice needs `effects`, a `result`, a `duje` line and an optional `tip`. Run `npm test`, which fails if the event is unreachable, a choice has no Duje line, two choices have identical consequences, or text is copied from another event.
- **Storyline payoff:** store the seed day with `'@day'` and require `before(s, 'flag')`. Use `kind: 'callback', priority: true`.
- **Tip:** if it states a price, it must be `verified` with a source. Rules and customs use `R('what to check')`. Every tip must be awarded by at least one choice.
- After content changes, run `node scripts/adventure-endings.mjs` (re-records the ending paths) and `node scripts/adventure-script.mjs`.
