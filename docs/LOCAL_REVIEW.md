# Local review checklist — Croatia Adventure

Croatia Adventure is fiction, but its humour depends on Dalmatian culture sounding **right to a local**. A Croatian reviewer (ideally from Split or the Dalmatian coast) should check everything below before an external playtest is widened or the game launches.

**How to review:**
- Read the full script in [`ADVENTURE_SCRIPT.md`](ADVENTURE_SCRIPT.md). It is generated from the game data, so it is always complete.
- Tick each item here.
- For every item, answer three questions:
  1. Is it **true** (or clearly framed as legend or exaggeration)?
  2. Is the **Croatian** correct and natural?
  3. Would a local find it **funny, or at least fair** — not offensive or cringeworthy?

**Ids** in `code` are event or tip ids, so you can find them in `src/adventure/data/` or in the script.

## 1. Croatian words and phrases

- [ ] Greetings and basics: *Bok, Dobar dan, Dobro jutro, Dobra večer, Hvala, Molim, Živjeli, Nema problema, Laku noć, Doviđenja*. Spelling, and whether people really use them like this (`croatian-basics`, `bench-committee`, `lost-in-translation`).
  - [ ] Should the bench greeting be **“Dobra večer”** (standard) or **“Dobar večer”** (common colloquial in Dalmatia)? (`bench-committee`)
- [ ] **“Ravno pa lijevo”** for “straight on, then left” (`asked-directions`).
- [ ] **“Ajme”** as a heckle at boće, and **“ajme, lijepo”** at Bačvice (`bocce-rematch`, `bacvice-night`).
- [ ] **“More svijetli”** for a glowing sea (`sea-glow`).
- [ ] **“Pegica”** as a natural name for a spotted dog (`dalmatian-dog`).
- [ ] **“Dušo”**, **“prijatelju”** and **“Splićanin”** used as terms of address or identity.
- [ ] Food and drink terms: *burek, pekara, marenda, soparnik, pašticada, blitva, gradele, peka, fritule, pršut, travarica, rakija, bevanda, prošek, skradinski rižot*.
- [ ] **“Đir”** for the evening waterfront stroll (`evening-dir`, tip `dir`).
- [ ] **“Fjaka”** and **“pomalo”** — tone and meaning.
- [ ] **“Domaće”** — “home-made”, used for wine, oil and rakija.
- [ ] **“Kuver”** as the word for a restaurant cover charge.
- [ ] **“Posuda”** — is this the natural word for Marija's container (versus *zdjela, tegla, kutija*)?

## 2. Customs and habits presented as real (tip cards)

These appear as real-world tips and must be accurate. They are also listed as *flagged* in `docs/UNVERIFIED.md`.

- [ ] **Return a dish full, not empty** (`posuda`, `posuda-return`, `duje-mother`). Is this a real and recognisable custom?
- [ ] **Tipping** — not obligatory; rounding up is appreciated; cash is easiest (`tipping`, `bill-tip`).
- [ ] **Jugo** blamed for headaches, bad moods and bad decisions (`jugo`, `jugo-day`).
  - [ ] The waiter's line that couples wait for the jugo to pass before arguing — fair as a joke?
- [ ] **Bevanda** = wine (usually red) with plain water, in Dalmatia (`bevanda`).
- [ ] **Prošek** ≠ prosecco (`prosek`).
- [ ] **Boćanje / balote** — the description and the culture of arguing over measurements (`bocanje`).
- [ ] **Fešta** for a village saint, with a tombola. Is a whole pršut a believable top prize? (`festa`, `village-festa`)
- [ ] **Wrists and neck first** before swimming — “grandmother science” (`water-cold`). Recognisable?
- [ ] **Burek with drinking yoghurt** as breakfast or hangover cure (`pekara`, `morning-after`).
- [ ] **Peškarija has no flies because of the sulphur springs** — is this genuinely what locals say? (`peskarija`)
- [ ] **Rubbing Grgur Ninski's toe** for luck (`grgur-toe`).
- [ ] **The Brač stone and White House claim** — the game frames it as a beloved local story, not fact. Is the framing fair? (`white-house-stone`)
- [ ] **The Dubrovnik stone-head challenge** near the Franciscan monastery — location and rules (`maskeron`).
- [ ] **Buža bars** reached through openings in Dubrovnik's walls (`buza`, `buza-door`).
- [ ] **Blaca hermitage** — telescope, books and piano in the museum (`blaca`).
- [ ] **Visovac** reached by excursion boat inside the park (`visovac`).
- [ ] **Skradinski rižot** often has to be ordered in advance (`skradin-risotto`).
- [ ] **Hvar's theatre** above the Arsenal, founded in 1612 (`hvar-theatre`).
- [ ] **Radovan's portal** in Trogir: Adam and Eve, and the months (`radovan-portal`).
- [ ] **FKK signposting** for naturist beaches (`fkk`).
- [ ] **Sustipan** as a quiet pine headland past the marina in Split (`sustipan`).

## 3. Rules that need an official source

Do not ship these as unqualified fact without confirming them.

- [ ] **Sunday trading limits** since July 2023, with exemptions for ports, stations, airports and petrol stations (`sunday-shops`).
- [ ] **Swimwear and shirtless fines in Hvar Town** — the game names no amount (`swimwear-rule`).
- [ ] **No swimming at Krka's waterfalls** (`krka-no-swim`, `krka-swim`).
- [ ] **Liquids in hand luggage** — the game gives only general advice to check airline and airport rules (`pack-liquids`).

## 4. Jokes about places and people

- [ ] **Split vs Zagreb banter** (`zagreb-couple`; Duje's “I would never move to Zagreb”). Affectionate, or too much?
- [ ] **Hajduk as a religion**; strangers kissing on the cheek when Hajduk scores (`hajduk-night`, tip `hajduk`).
- [ ] **Dalmatian aunts, mothers and grandmothers** — the WhatsApp group, the “small lunch” for 31, the bench committee, Duje's mother. Warm, or a lazy stereotype?
- [ ] **“A small lunch / five minutes / I'm on my way”** as Dalmatian figures of speech.
- [ ] **Cousin Ante**, who has every side business on the coast (sunbeds, boats, souvenirs, transfers, “Other”). Funny, or unfair to people working in tourism?
- [ ] **Igor the commission-driven concierge** and **Hvar yachts and “vibes”** (`igor-upsell`, `hvar-yacht`).
- [ ] **Waiters, fish “per kg” and the silver tray** (`fish-mystery`, `shirt-fish`). Is the joke fair to honest restaurants? (The tip explains the real practice.)
- [ ] **Omiš pirates vs Venetians**; “never cheer for Venice in Omiš” (`pirate-battle`). Is a pirate-battle show plausible enough to stay as fiction?
- [ ] **The rental-company “goat list”** and goats with right of way (`mirror-inspection`, `real-goat`).
- [ ] **Brian in the Hawaiian shirt** — he has deliberately no nationality. Keep it that way?
- [ ] **Other nationalities mentioned in passing**: the nine-year-old from Graz, “half of Germany” at Krka, “wiser than half of Munich”, the Italian couple, “very French”, “very Italian”. Fine, or remove?
- [ ] **Duje's lines about the Romans, Napoleon-era French rule and Dubrovnik's diplomacy** — historically fair as one-liners?

## 5. Duje — character consistency

Duje is a witty Split local in his thirties. He is sarcastic about tourists but fiercely loyal to the player. Running threads: his mother, his cousin Ante, Hajduk, Ivana from the bakery, coffee, and his hatred of rushing.

- [ ] Does Duje sound like **one person** across the script, and like someone from Split?
- [ ] Is his sarcasm **affectionate** — never mean to the player for making a good choice?
- [ ] Is the **Ivana storyline** (he can't speak to the baker he likes) charming rather than awkward?
- [ ] Is the **Sustipan scene**, where he drops the jokes for a moment, believable?

## 6. Added in the story-memory pass

- [ ] **Duje's farewell** (`duje-farewell`): does the goodbye feel warm and Dalmatian rather than sentimental? Is “…Pomalo. That's all.” a good last line?
- [ ] **Regional “next time” tips** — Zagreb (Upper Town, Dolac), Istria (Motovun, Rovinj, truffles, olive oil), Plitvice (UNESCO, no swimming), Zadar (Sea Organ, Greeting to the Sun). Accurate, and fair to each region?
- [ ] Duje admitting Istrian olive oil “might be as good as ours” and Zagreb coffee being good: fun regional banter, or not?
- [ ] **The Venetian actor** (`venetian-actor`): the paper lion of St Mark on the dessert, and the “Capitano” autograph.
- [ ] **The Zagreb couple returning** (`zagreb-return`): “Classic Split. You are one of them now.”
- [ ] **Duje's morning memories** (in `src/adventure/data/memory.js`): natural? Too many references to his mother?
- [ ] **Promises in the report**, e.g. “Promised Grandpa in Omiš a briškula rematch. He is still on the bench.”

## 7. Sign-off

| Reviewer | From | Date | Sections reviewed | Notes |
|---|---|---|---|---|
| | | | | |
