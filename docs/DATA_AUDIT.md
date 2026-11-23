# Data audit — 23 November 2026

Every player-facing fact in `src/data/locations.js` has one of three statuses:

| Status | Meaning |
|---|---|
| **verified** | Read on an official source on the date shown, with the URL recorded. |
| **unverified** | A real-world claim that has **not** been confirmed on an official source. It is labelled "Unverified" in the app, and `toVerify` lists where to check it. |
| **estimate** | A game value (visit time, travel time, cost) chosen for play. It is not a real-world claim. |

The gameplay numbers (`durationMin`, `costPerPerson`) were **not changed**, so scoring and balance are identical to the previous version.

## Verified (official sources, checked 2026-11-23)

| Location | Fact | Value | Source |
|---|---|---|---|
| Salona | Adult ticket | €8 (combined ticket with the Archaeological Museum in Split: €10, valid 7 days) | https://www.armus.hr/muzej/posjet/cijena-ulaznica-i-strucnog-vodstva |
| Salona | Opening hours (Tusculum) | 1 Jun–30 Sep daily 9:00–20:00; 1 Oct–31 May daily 9:00–18:00; closed on public holidays | https://www.armus.hr/muzej/posjet |
| Salona | Bus | Promet Split line 5A lists Solin on its route | https://www.promet-split.hr/linije/mreza-linija-prigradskog-prometa |
| Klis | Bus | Promet Split line 22: Split – Klis | same |
| Trogir | Bus | Promet Split line 37: Split – Airport – Trogir | same |
| Omiš | Bus | Promet Split line 60: Split – Omiš – Ravnički most | same |
| Omiš | Activities | Omiš tourist board lists kayaking, rafting, canyoning and zipline in the Cetina canyon (no prices given) | https://www.visitomis.hr/kanjon-rijeke-cetine |

Salona's game cost (€8 per person) matches the official adult ticket. It is the only cost marked **verified**.

## Unverified (labelled in the app)

| Location | Claim | Where to verify | Why it is not verified |
|---|---|---|---|
| Diocletian's Palace | Palace streets free; cathedral and substructure tickets | https://visitsplit.com/en/448/diocletian-palace | The site serves a bot-verification page to automated requests. We did not attempt to bypass it. |
| Marjan | Free access | https://www.marjan-parksuma.hr/ | Host not reachable from the audit environment |
| Bačvice | Free public beach | https://visitsplit.com/en/ | Bot verification (as above) |
| Klis | Ticket price and hours | https://www.tvrdavaklis.com/ (reported as official by a search result; not confirmed) | Host not reachable |
| Trogir | Kamerlengo ticket and hours | https://www.muzej-grada-trogira.hr/, https://www.visittrogir.hr/ | Not found on the pages reached |
| Trogir | UNESCO World Heritage status | https://whc.unesco.org/en/list/810 | whc.unesco.org returned HTTP 403 to automated requests |
| Krka | Ticket prices, hours, transport from Split | https://npkrka.hr/ | Host not reachable. **np-krka.hr now redirects to npkrka.hr.** |

## Estimates (game values)

- Visit times for all locations.
- Travel times and fares between locations. These come from the distance model in `src/engine/travel.js`, not from timetables.
- Costs for the Palace (€12), Klis (€10), Trogir (€6), Omiš kayak (€30) and Krka (€30). Marjan and Bačvice are assumed free.

## Findings worth knowing

- **mgst.net** (previously the Split City Museum) now hosts an unofficial WordPress travel blog. It was **not** used as a source.
- **np-krka.hr** redirects to **npkrka.hr**.
- Search results suggest Krka's prices are strongly seasonal (low off-season, much higher in July–August). The flat €30 game estimate should be revisited once the official price list can be read.

## To finish the audit

Allow these hosts in the build environment (or check them by hand): `npkrka.hr`, `www.marjan-parksuma.hr`, `www.tvrdavaklis.com`, `www.muzej-grada-trogira.hr`. Then check visitsplit.com and whc.unesco.org in a normal browser. When a fact is confirmed, change its status to `verified` and add `source` and `verifiedOn`. The tests in `tests/data.test.js` enforce this structure.
