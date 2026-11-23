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
| Events | **104**: 66 everyday and place events, 25 consequence callbacks, 12 hidden discoveries, 1 finale |
| Multi-day storylines | 17 (see below) |
| Activities | 25 across 7 destinations |
| Endings | 10 |
| Local Insider tips | 86: 10 verified with official sources, 76 editorial, of which 10 are flagged for review; 4 introduce regions beyond Dalmatia |
| Story memory | 6 characters with relationships, 8 kinds of promise, 26 morning memories + “yesterday” callbacks, a personal farewell |
| Achievements | 6 |

## Story memory (gameplay & quality pass)

The holiday is now one continuous story. Four connected systems (`src/adventure/data/memory.js` and `events/finale.js`):

1. **Relationships.** Choices can carry `rel: { marija: 2 }`. Six characters track how they feel about you: Duje, Marija, Luka, Igor, Ante and Brian.
   - The outcome sheet shows it at once: “🤝 Marija liked that”, “😬 Ante noticed that”.
   - Relationships unlock or close later content. Ante only reveals his empire to good customers, and Marija's cousin network goes quiet if you lost her container. Luka greets you differently depending on how you left things.
2. **Promises.** Some choices make a promise: Sunday lunch with the wedding aunt, Marija's container, the peka, a briškula rematch, the boće rematch, fishing with Pegica, coming back next year. Later choices keep or break them. Anything still open when you fly home counts as broken, except open-ended promises like “come back next year”. Shown as 🤞 / ✅ / 💔 in the outcome sheet and in the report. The share text counts kept and broken promises.
3. **Duje remembers.** Most mornings Duje brings up something from an earlier day: a hidden place you *actually* went to, a promise you are neglecting (“somewhere in Omiš an old man is sitting on a bench with a deck of cards”), a character you met, or yesterday's most memorable moment.
   - Each memory is used once, only on a later morning, and only for choices you really made (tested).
   - Runs get about 2–3 memories each, and 94–100% of runs get at least one.
4. **The last evening.** Every holiday that reaches day 5 ends with Duje's farewell (`finale: true` always wins the last slot). He looks back at *your* two biggest moments and the promise or person that matters most. Then you choose:
   - promise to come back;
   - ask where to go next time — he picks **Zagreb, Istria, Plitvice or Zadar** from how you played, and you get a real tip card for that region;
   - say nothing and watch the sea together.

**Unusual decisions pay off later:** cheering for Venice in Omiš gets you a free dinner from the actor, and siding with Zagreb brings the couple back (and introduces the capital).

**The report** now also shows **People you met** (with a status from the relationship score, e.g. “Ante gives you the ‘family price’”) and **Promises**.

## Duje: character guide

Duje is the narrator, a Split local in his thirties, named after Sveti Duje, the city's patron saint. He is fiction; his tips link to real Local Insider cards.

- **Voice:** short sentences, deadpan, one punchline. He is sarcastic about tourists in general but fiercely loyal to *you*. He is never mean when you make a good choice.
- **Running threads**, so he feels like one person across 300+ lines:
  - his **mother**, who hears everything and judges everything;
  - his **cousin Ante**, who runs every side business on the coast;
  - **Hajduk**;
  - **Ivana from the bakery**, whom he can't talk to;
  - **coffee and pomalo**, and his hatred of rushing.
- **Naturally sarcastic, not constantly:** some lines are plain, warm or quiet (the farewell can end with a single “…Pomalo.”). This pass rewrote 20 lines that used generated-sounding formulas (“Very X. Very Y.”, “the most Dalmatian … in existence”).
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

From `node scripts/adventure-sim.mjs 18000` (six strategies × 3,000 runs), after this pass:

| Ending | All runs | Random play |
|---|---|---|
| Island Explorer | 21.6% | 20.3% |
| Budget Master | 18.4% | 19.4% |
| Tourist Disaster | 15.4% | 1.2% |
| Local Insider | 13.3% | 2.5% |
| Fjaka Champion | 10.1% | 20.8% |
| Happy Holidaymaker | 8.2% | 24.7% |
| Professional Ferry Hostage | 5.8% | 3.4% |
| Adopted by Dalmatia | 4.7% | 1.9% |
| Croatia Legend | 1.3% | 3.0% |
| Three-Kilo Fish Legend | 1.2% | 2.7% |

**By strategy:**

| Strategy | Most common endings |
|---|---|
| Thrifty | Budget Master 66% |
| Island-chasing | Island Explorer 83%, Ferry Hostage 12% |
| Local | Local Insider 48%, Adopted 18% |
| Careful | Fjaka 31%, Insider 24%, Budget 22% |
| Deliberately bad | **Disaster 89.6%** |

**Accommodation:** the boutique hotel cost €80 a night and was a trap. 60% of random players and 100% of fun-seekers ended up sleeping on a bench (see the play-test log). At **€65** it is still the risky luxury option (24% of random boutique guests run out of money) but no longer an obviously bad choice. Hostel €25 / recover 20, apartment €45 / recover 30, boutique €65 / recover 40.

**“10 endings” vs “7 endings”** (from the previous pass): the old summary sentence was written before three endings were added. It was stale text, not a missing ending.

**Bad play:** about 90% of deliberately bad runs end in disaster (89.6% now), but random play ends in disaster only about 1%, so the overall disaster rate comes almost entirely from bad play.

**Every ending is reachable through actual gameplay:** `node scripts/adventure-endings.mjs` records a real legal run for each ending (`tests/fixtures/ending-paths.json`), and a test replays all ten.

**Repetition between runs:** the event overlap between two runs of the same strategy is 0.09–0.15 (Jaccard). All 104 events and all 86 tips are reachable.

**Storyline payoffs** (share of triggering runs in which the payoff appears): Marija's container 100%, boće 99%, Luka 99%, ham 97%, Pegica 93%, sunglasses 93%, Duje & Ivana 93%, wedding aunt 89%, Brian 87%, mirror 86%, fish 80%, sea urchin 81%, grandpa 79%, sunburn 78%, peka 73%, party boat 65%.
- **Ante's reveal is now relationship-gated** (you need to have been a good customer twice): 25% of runs that meet him.
- **Peka:** when it can't be collected before you fly home, it becomes a broken promise (“somewhere, a peka waits”).

## Play-test log

### Gameplay & quality pass (story memory)

**Inspection first.** Automated checks over 3,000 runs:
- **Money accounting is exact.** €500 + every change − every night paid = money left. This is now a permanent test.
- I compared each Verified tip with its source text before changing anything.

**Real bugs found and fixed:**

| Bug | How it was found | Fix |
|---|---|---|
| The night summary claimed the full recovery (“⚡ +30”) even when energy was capped at 100: **wrong in 65% of nights** | Invariant check over 12,000 nights | Shows the real gain, or “already fully rested” (tested) |
| **The boutique hotel was a trap**: bench nights for 60% of random and 100% of fun runs | Money simulation per base | €80 → €65 a night |
| Winning at briškula led to the nephew saying he saw “the napkin map in your pocket”, but only *listening* gives you a napkin | Reading the chaotic transcript | Two versions of the scene; the briškula “rematch tomorrow” is now a real promise |
| Duje said “my voice is still gone from the match” to a player who took a quiet walk instead | Chaotic transcript | Memories check the choice you made, not the event you saw (tested) |
| The same applied to every hidden place (Duje “remembered” places you declined to visit) | Code review after the above | Fixed |
| Brian quoted advice about Ante to players who never met Ante, and credited the player for advice they never gave | Chaotic transcript | Lines built from what actually happened |
| Duje said “Ante says you’re a good customer” to players who never bought anything | Normal transcript | Separate line for difficult customers |
| Day 1 header said “Somewhere over the Adriatic” above a photo of Split, while Duje says “Welcome to Split Airport” | Mobile review | “Split Airport · Kaštela” |
| The Dubrovnik hidden discovery could no longer happen (an evening event in a city you only reach on the last evening) | Reachability test | Moved to the afternoon |
| 17 memory flags were recorded and never used again | Flag audit | Now feed Duje's memories, Brian's lines and the report |
| Five **Verified** tips said more than their sources (airport “between Split and Trogir”, Krka “all land sites”, Kamerlengo description, Omiš pirate history, Salona “Roman capital”, “where the river meets the sea”) | Comparing each tip with its stored source text | Verified text trimmed to exactly what the source says; pirate history moved to a new Editorial card |

**Five personas played in full** (`node scripts/adventure-transcript.mjs <seed> normal|cheap|fun|chaos|local`):

| Persona | Ending | What I noticed |
|---|---|---|
| Normal tourist (car + apartment + big fish + party boat) | Happy Holidaymaker, €1 left | A funny, believable spiral. Duje recalled the fish and Ante. It exposed the “good customer” bug. |
| Budget tourist | Budget Master, €368 | Calm and pleasant; fewer big moments, so the report leans on the diary. |
| Adventurous (fun) | Island Explorer | Very eventful. Island-chasing is predictable (83% Island Explorer). |
| Chaotic | Fjaka Champion | Exposed three memory bugs (above). After the fixes, Brian's finale and the farewell reflect the chaos. |
| Local discoveries | Adopted by Dalmatia | The strongest run: the container promise was kept, the konoba with no name was remembered on day 5, and the farewell mentioned Marija crying. |

### Earlier passes

| Found while playing | Fix |
|---|---|
| A run saw too few events for stories to develop | Evening slot (two events per day) |
| The urchin “success” still added “stepped on a sea urchin” | Dice branches carry their own report moment |
| Callbacks fired the same day as their seed | Payoffs require an earlier day (tested) |
| Ante, Brian, Duje's date and Luka rarely paid off | Follow-ups made into callbacks |
| Happiness saturated near 90 | Lower gains per event |

**Still weak (honest list):**
- Generic evening events (the bill, bevanda, the fešta) recur most for regular players.
- Thrifty and island-chasing play are predictable.
- Dubrovnik is only reachable on day 5.
- Several storylines can stack on days 3–5.
- The humour still needs a local reviewer ([`LOCAL_REVIEW.md`](LOCAL_REVIEW.md)).

## Local Insider tips: review of all 86

Labels shown to the player: **Story** (fiction) vs **Real-world tip**. Each tip card is then marked:

| Label | Meaning | Rules |
|---|---|---|
| ✓ **Verified** | An official source in `src/data/travel-data.json` **directly** supports every claim in the tip text | Source id and date; the audit warns when stale. Background that the source does not state goes into a separate Editorial card |
| ✎ **Editorial** | General knowledge: language, food, culture, practical habits | **No prices, times, durations or distances** (test-enforced); listed in `docs/UNVERIFIED.md` |
| ✎ + review flag | Editorial tips stating a rule, custom or local claim (Sunday trading, Hvar swimwear rule, no swimming at Krka or Plitvice, returning dishes full, tipping, jugo, the Peškarija lore, skradinski rižot, the stone head) | Listed under “Flagged for review before launch” and in `LOCAL_REVIEW.md` |

**This pass:**
- The 10 Verified tips were checked word by word against their stored sources, and five were trimmed (see the bug table).
- New Editorial card: *The pirates of Omiš*.
- New **regional cards** — Zagreb, Istria, Plitvice and Zadar — gradually introduce the rest of Croatia through Duje's “next time” advice and the Zagreb couple. They are general, durable facts, with no prices or times.

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
  data/events/finale.js     Duje's farewell, the Venice and Zagreb payoffs
  data/memory.js            promises, cast (relationships), Duje's morning memories
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
