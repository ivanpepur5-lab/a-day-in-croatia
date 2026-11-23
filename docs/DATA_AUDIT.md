# Data audit — 23 November 2026 (updated)

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

## Unverified (labelled in the app)

| Location | Claim | Where to verify | Why it is not verified |
|---|---|---|---|
| Diocletian's Palace | Palace streets free; cathedral and substructure tickets | https://visitsplit.com/en/448/diocletian-palace | The site serves a bot-verification page to automated requests. We did not attempt to bypass it. |
| Marjan | Free access | https://www.marjan-parksuma.hr/ | Host not reachable from the audit environment |
| Bačvice | Free public beach | https://visitsplit.com/en/ | Bot verification (as above) |
| Klis | Ticket price and hours | https://www.tvrdavaklis.com/ (reported as official by a search result; not confirmed) | Host not reachable |
| Krka | Ticket prices, hours, transport from Split | https://npkrka.hr/ | Host not reachable. **np-krka.hr now redirects to npkrka.hr.** |

## Estimates (game values)

- Visit times for all locations.
- Travel times and fares between locations. These come from the distance model in `src/engine/travel.js`, not from timetables.
- Costs for the Palace (€12), Klis (€10), Omiš kayak (€30) and Krka (€30). Marjan and Bačvice are assumed free.
- Bus fares for journeys the Promet Split price list doesn't cover.

## Findings worth knowing

- **mgst.net** (previously the Split City Museum) now hosts an unofficial WordPress travel blog. It was **not** used as a source.
- **np-krka.hr** redirects to **npkrka.hr**.
- Search results suggest Krka's prices are strongly seasonal (low off-season, much higher in July–August). The flat €30 game estimate should be revisited once the official price list can be read.

## To finish the audit

These need a normal browser or extra network permission, so they're left for a manual check:
- npkrka.hr (Krka prices and hours)
- www.marjan-parksuma.hr (Marjan access)
- www.tvrdavaklis.com (Klis ticket and hours)
- visitsplit.com (Diocletian's Palace and Bačvice; it runs a bot check)

Until then, those facts stay **unverified**, with their source URLs kept in the data. When a fact is confirmed, change its status to `verified` and add `source` and `verifiedOn`. The tests in `tests/data.test.js` enforce this structure.
