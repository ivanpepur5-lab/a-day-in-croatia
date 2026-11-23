# Data audit — 23 November 2026 (round 4)

> **Round 4:** all editable data moved to `src/data/travel-data.json` (guide: [EDITING_DATA.md](EDITING_DATA.md)). `npm run audit` now validates sources, dates and validity periods. The app shows four states: ✓ Verified · ⚠ Needs re-check · ? Unverified · ≈ Estimate.

> Complete, auto-generated lists: **[VERIFIED_SOURCES.md](VERIFIED_SOURCES.md)** (23 verified facts plus 9 official fares, each with source URL and date) and **[UNVERIFIED.md](UNVERIFIED.md)** (12 unverified facts plus all game estimates). Regenerate them with `npm run audit`.

Every player-facing fact in `src/data/locations.js` has one of three statuses:

| Status | Meaning |
|---|---|
| **verified** | Read on an official source on the date shown, with the URL recorded. |
| **unverified** | A real-world claim that has **not** been confirmed on an official source. It is labelled "Unverified" in the app, and `toVerify` lists where to check it. |
| **estimate** | A game value (visit time, travel time, cost) chosen for play. It is not a real-world claim. |

Scoring formulas are unchanged. Two kinds of game value now use verified official numbers instead of estimates:
- **Bus fares:** the official Promet Split fares, wherever the price list covers the journey.
- **Trogir:** the Kamerlengo adult ticket, €7 instead of the €6 estimate.

The best possible score is unchanged for all three challenges (98 / 96 / 94).

## Verified (official sources, checked 2026-11-23)

| Location | Fact | Value | Source |
|---|---|---|---|
| Salona | Adult ticket | €8 (combined ticket with the Archaeological Museum in Split: €10, valid 7 days) | https://www.armus.hr/muzej/posjet/cijena-ulaznica-i-strucnog-vodstva |
| Salona | Opening hours (Tusculum) | 1 Jun–30 Sep daily 9:00–20:00; 1 Oct–31 May daily 9:00–18:00; closed on public holidays | https://www.armus.hr/muzej/posjet |
| Salona | Getting there | A few minutes on foot from the Hotel Salona Palace stop (bus line 1) | https://www.armus.hr/muzej/posjet/kako-do-muzeja-zbirki |
| Salona | Highlights | Amphitheatre (second half of the 2nd century), early-Christian complex at Manastirine | https://www.armus.hr/muzej/povijest-muzeja/prirucna-zbirka-i-lokalitet-salona/lokaliteti-salona |
| Trogir | Kamerlengo adult ticket | €7 (students and children 5–16: €3; under 5 free) | https://www.visittrogir.hr/en/tourist/attractions/kamerlengo-fortress (published as an image; no year stated; uploaded March 2025) |
| Trogir | Kamerlengo hours | Apr 10–18 · May 9–20 · Jun–Aug 9–22 · Sep 9–20 · Oct–Nov 10–18, daily (Dec–Mar not listed) | same |
| Trogir | UNESCO | Inscribed on the World Heritage List in 1997 | https://www.visittrogir.hr/en/tourist/faq |
| Omiš | Activities | Kayaking, rafting, canyoning and zipline in the Cetina canyon (no prices) | https://www.visitomis.hr/kanjon-rijeke-cetine |
| Omiš | Location and buses | 25 km south-east of Split; a direct line from Split's main bus station on average every half hour | https://www.visitomis.hr/korisne-informacije |
| Omiš | Highlight | 14th-century Mirabela fortress, about 5 min walk from the central square | https://www.visitomis.hr/omis-u-1-3-ili-7-dana/omis-u-1-dan |
| Klis / Trogir / Omiš | Bus lines | Promet Split line 22 (Split – Klis), 37 (Split – Airport – Trogir), 60 (Split – Omiš – Ravnički most) | https://www.promet-split.hr/linije/mreza-linija-prigradskog-prometa |

| Krka | Adult entrance 2026 (all land sites) | Jan–Mar & Nov–Dec €7 · Apr, May & Oct €20 · Jun–Sep €40 (€30 after 15:00) | https://www.np-krka.hr/wp-content/uploads/CJENIK-2026.-ENG.pdf (official price list, created 16 Nov 2026) |
| Krka | Children 7–18, 2026 | €4 / €12 / €15 (€11.25 after 15:00 Jun–Sep); under 7 free | same |
| Krka | Included in ticket | Boat Skradin – Skradinski buk – Skradin and bus Lozovac – Skradinski buk – Lozovac, 1 Apr – 31 Oct | same |
| Klis | Line 22 route | Terminal Sukoišan – Ul. Domovinskog rata – ZNG – Solin – Đurini – Gornja Rupotina – Megdan – Klis; departures timed from HNK | https://www.promet-split.hr/vozni-red/urbano-podrucje/linijaid/61877 (valid from 7 Sep 2026) |
| Marjan | Line 12 route | Sv. Frane – Obala kneza Branimira – Šetalište Ivana Meštrovića (Kaštelet, Kašjuni) – Mediteranski institut – Bene | https://www.promet-split.hr/vozni-red/split/linijaid/61864 (valid from 27 Oct 2026) |

**Krka game cost:** the game keeps its single €30 estimate because it has no seasons. Picking one month's price would change the game design. The official seasonal prices are shown as verified facts next to it.

### Official bus fares (Promet Split, valid from 1 June 2026)

Source: the single-ticket price list PDF linked from https://www.promet-split.hr/cjenik/cjenik-putnih-karata. The column headers were confirmed by rendering the PDF.

| Journey | Online / ticket office | From the driver | Ticket valid |
|---|---|---|---|
| Split – Solin | €1.75 | €3.50 | 75 min |
| Split – Klis | €2.00 | €4.00 | 90 min |
| Split – Trogir | €2.50 | €5.00 | 105 min |
| Split – Omiš | €2.50 | €5.00 | 105 min |
| Solin – Klis | €1.75 | €3.50 | 75 min |
| Solin – Trogir | €2.00 | €4.00 | 90 min |
| Solin – Omiš | €2.00 | €4.00 | 90 min |
| Omiš – Klis | €1.75 | €3.50 | 75 min |
| Split – Split | €1.50 | €3.00 | 60 min |

The game charges the **online / ticket-office** fare per person for these legs, shown as "fare ✓". Klis – Trogir, Trogir – Omiš and anything to Krka aren't in the list, so those fares stay estimates ("est."). Bus **times** are always model estimates, not timetable data.

## Transport pricing review (round 3)

- **Per person:** every fare is stored per person in `src/data/fares.js`, with both columns from the official list: `online` (value card / ticket office / online) and `driver` (bought from the driver, double the price), plus ticket validity.
- **Fare used for scoring:** each leg uses the **online / ticket-office** fare, multiplied by the party size. The arrange screen shows this as `2 × €1.75 = €3.50 fare ✓`, and the tooltip also gives the driver fare.
- **Estimates:** legs without a published fare show `2 × ≈€4.50 = €9 est.`.
- **Budget split:** the budget panel separates entry costs, official-fare bus costs and estimated bus costs for the party.
- **Tests:** they check that every leg's party total equals the per-person fare × 2, that verified and estimated subtotals add up to the transport total, and one exact day priced entirely from the official list.
- **Times:** bus times are still model estimates. The timetables list departure times but not ride durations per stop, so no times were taken from them.

## Unverified (labelled in the app)

See **[UNVERIFIED.md](UNVERIFIED.md)** for the generated, complete list. In short:
- **Krka:** opening hours, public transport from Split and the recommended visit duration. npkrka.hr pages can't be reached from here; only the price-list PDF could be read.
- **Klis:** ticket price and opening hours (tvrdavaklis.com can't be reached).
- **Marjan:** access rules and parking (marjan-parksuma.hr can't be reached; the visitsplit.com notice is behind a bot check).
- **Diocletian's Palace:** whether the streets are free, cathedral and substructure tickets and hours, and the UNESCO listing (visitsplit.com bot check; whc.unesco.org returns 403).
- **Bačvice:** access and facilities (visitsplit.com bot check).

## Estimates (game values)

- Visit times for all locations.
- Travel times and fares between locations. These come from the distance model in `src/engine/travel.js`, not from timetables.
- Costs for the Palace (€12), Klis (€10), Omiš kayak (€30) and Krka (€30). Marjan and Bačvice are assumed free.
- Bus fares for journeys the Promet Split price list doesn't cover.

## Findings worth knowing

- **mgst.net** (previously the Split City Museum) now hosts an unofficial WordPress travel blog. It was **not** used as a source.
- **np-krka.hr** redirects its web pages to **npkrka.hr**. The price-list PDF was read at the np-krka.hr address linked as its source.
- **Krka prices are strongly seasonal:** €7 in winter and €40 in summer for adults in 2026. The game's flat €30 is labelled an estimate.
- **Bus departure points:** Promet Split lines 1 and 22 time their departures from the HNK/Sukoišan area, not the Riva. The game's travel times are estimates from the Riva and don't include walking to these stops.

## To finish the audit

These need a normal browser or extra network permission, so they're left for a manual check:
- npkrka.hr (Krka opening hours, transport, visit duration)
- www.marjan-parksuma.hr (Marjan access)
- www.tvrdavaklis.com (Klis ticket and hours)
- visitsplit.com (Diocletian's Palace and Bačvice; it runs a bot check)

Until then, those facts stay **unverified**, with their source URLs kept in the data. When a fact is confirmed, change its status to `verified` and add `source` and `verifiedOn`. The tests in `tests/data.test.js` enforce this structure.
