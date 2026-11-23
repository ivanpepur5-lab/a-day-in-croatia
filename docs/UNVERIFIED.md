# Remaining unverified information

Generated from `src/data/locations.js` and `src/data/fares.js` by `npm run audit` (audit date 2026-11-23).

## Unverified real-world claims

These are labelled **Unverified** in the app. Each lists where to check it.

| Location | Field | Shown as | Where to verify | Note |
|---|---|---|---|---|
| Diocletian's Palace | Entry to palace streets | Free (unverified) | [Split Tourist Board — Diocletian Palace](https://visitsplit.com/en/448/diocletian-palace) | Not confirmed: the official page uses a bot check that this audit could not pass. |
| Diocletian's Palace | Cathedral & substructure tickets and hours | Not verified | [Split Tourist Board — Diocletian Palace](https://visitsplit.com/en/448/diocletian-palace) | mgst.net, previously used for the Split City Museum, now hosts an unofficial travel blog and was not used. |
| Diocletian's Palace | UNESCO World Heritage status | Historical Complex of Split with the Palace of Diocletian (unverified in this audit) | [UNESCO World Heritage List](https://whc.unesco.org/en/list/97) | UNESCO’s site refused automated access during the audit. |
| Marjan Hill | Access rules | Free to walk (unverified); park rules not verified | [Marjan Forest Park (public institution)](https://www.marjan-parksuma.hr/)<br>[Split Tourist Board — notice on visitor access to Marjan](https://visitsplit.com/hr/7391/important-notice-visitor-access-in-marjan-forest-park) | The Split Tourist Board has published a visitor-access notice for Marjan; its content could not be read (bot check). |
| Marjan Hill | Parking | Not verified | [Marjan Forest Park (public institution)](https://www.marjan-parksuma.hr/) |  |
| Bačvice Beach | Access | Public beach, free (unverified) | [Split Tourist Board](https://visitsplit.com/en/) | The tourist board site uses a bot check that this audit did not bypass. |
| Bačvice Beach | Facilities & sunbed hire | Not verified | [Split Tourist Board](https://visitsplit.com/en/) |  |
| Klis Fortress | Ticket price | Not verified | [Klis Fortress (reported official site)](https://www.tvrdavaklis.com/) | The official site could not be reached from the audit environment. |
| Klis Fortress | Opening hours | Not verified | [Klis Fortress (reported official site)](https://www.tvrdavaklis.com/) |  |
| Krka National Park | Opening hours | Not verified | [Krka National Park](https://npkrka.hr/) | Opening hours are not in the price list, and the park’s web pages could not be read from the audit environment. |
| Krka National Park | Public transport from Split | Not verified | [Krka National Park](https://npkrka.hr/) | No Promet Split line serves Skradin or Lozovac (checked against the official line list). |
| Krka National Park | Recommended visit duration | Not verified | [Krka National Park](https://npkrka.hr/) | The game uses 3h as an estimate. |

## Game estimates (not real-world claims)

| Location | Field | Value | Note |
|---|---|---|---|
| Diocletian's Palace | Spend on paid sights | ≈ €12 per person | Game estimate; ticket prices were not verified. |
| Diocletian's Palace | Time on site | 1h 30m | Game estimate of a typical visit; not an official recommendation. |
| Marjan Hill | Time on site | 1h 30m | Game estimate of a typical visit; not an official recommendation. |
| Marjan Hill | Cost used in game | €0 per person | Assumed free to walk |
| Bačvice Beach | Time on site | 1h 30m | Game estimate of a typical visit; not an official recommendation. |
| Bačvice Beach | Cost used in game | €0 per person | Assumed free public beach (sunbed hire extra) |
| Salona | Time on site | 1h 15m | Game estimate of a typical visit; not an official recommendation. |
| Klis Fortress | Entry | ≈ €10 per person | Game estimate; ticket price not verified. |
| Klis Fortress | Time on site | 1h | Game estimate of a typical visit; not an official recommendation. |
| Trogir | Time on site | 1h 30m | Game estimate of a typical visit; not an official recommendation. |
| Omiš & Cetina | Kayak trip price | ≈ €30 per person | Private operators set prices; not verified. |
| Omiš & Cetina | Time on site | 2h 30m | Game estimate of a typical visit; not an official recommendation. |
| Krka National Park | Game cost | ≈ €30 per person | The game has no seasons, so it keeps one estimated price. Official 2026 adult prices are listed above. |
| Krka National Park | Time on site | 3h | Game estimate of a typical visit; not an official recommendation. |

### Bus journeys without an official fare (estimated in game)

- Klis – Krka (Skradin)
- Klis – Trogir
- Krka (Skradin) – Omiš
- Krka (Skradin) – Solin
- Krka (Skradin) – Split
- Krka (Skradin) – Trogir
- Omiš – Trogir

### Always estimated

- **Travel times** for every leg come from the distance model in `src/engine/travel.js`, not from timetables.
- **Time on site** for every location.

---
**12 unverified facts** remain.
