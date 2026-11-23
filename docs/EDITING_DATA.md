# Editing travel data (no code changes needed)

Every price, opening hour, transport detail, bus fare and source lives in **one file**:

```
src/data/travel-data.json
```

Edit it, then run:

```bash
npm run audit         # report + regenerate docs/UNVERIFIED.md and docs/VERIFIED_SOURCES.md
npm run audit:check   # fails if anything is wrong (missing source, bad date, …)
npm test              # optional: full test suite
```

You can edit the file on GitHub in your browser (pencil icon), including from a phone. Netlify rebuilds the site when the change is merged.

> Names, descriptions, photos and map positions are in `src/data/locations.js` and `src/data/photos.js`. Change those only if the place itself changes.

---

## The three statuses

| `status` | Use it when | Required fields | How the app shows it |
|---|---|---|---|
| `verified` | You read it on an **official** source (operator, museum, park, transport company, official tourist board) | `source`, `verifiedOn` | Green **✓ Verified · date**, with a source link |
| `unverified` | It's a real-world claim you have **not** confirmed | `checkAt` (where to verify) | Orange **? Unverified**, with "Check:" links |
| `estimate` | It's a value chosen for the game | `checkAt` for prices, hours, transport and access | Grey **≈ Estimate**. Prices always show "≈ … est.", never as official |

The app adds a fourth state automatically: **⚠ Needs re-check**. A `verified` item gets it when its `verifiedOn` is older than the review window (`meta.defaultReviewDays`, 180 days, or the item's own `reviewDays`), or when its `validUntil` date has passed. It still shows the price, but in amber with "needs re-check".

Dates are always `YYYY-MM-DD`.

---

## 1. Sources

Every link is defined **once**, under `sources`, and referenced by its id:

```json
"sources": {
  "armus-prices": {
    "label": "Archaeological Museum in Split — ticket prices",
    "url": "https://www.armus.hr/muzej/posjet/cijena-ulaznica-i-strucnog-vodstva",
    "publisher": "Archaeological Museum in Split",
    "official": true
  }
}
```

If a website moves, change the `url` here and every fact using it updates. URLs must start with `https://`.

## 2. A location's game price and visit time

```json
"locations": {
  "klis": {
    "price": {
      "perPerson": 10,
      "status": "estimate",
      "note": "Estimated fortress entry; the official price was not verified.",
      "checkAt": ["klis-fortress-site"]
    },
    "visitMinutes": { "value": 60, "status": "estimate", "note": "Game estimate of a typical visit…" },
    "facts": [ … ]
  }
}
```

- `perPerson` is in EUR **per person**. The game multiplies it by the party size.
- `perPerson` and `visitMinutes.value` **are used for scoring**. Changing them changes scores and rankings, so do it deliberately. The audit and `npm test` show the new best possible scores.

### Turning an estimated price into a verified one

1. Add the price as a verified **fact** (see below), e.g. `"value": "€10 (children €5)"`.
2. In `price`, set `"status": "verified"`, `"source"`, `"verifiedOn"`, and `"fact": "<that fact's id>"`, and remove `checkAt`.
3. Set `perPerson` to the official adult price.

The audit rejects a "verified" price whose fact doesn't contain exactly `€<perPerson>`. This stops an estimate being labelled official by mistake.

## 3. Facts (opening hours, transport, access, other prices)

```json
{
  "id": "opening-hours",
  "type": "hours",
  "label": "Opening hours",
  "value": "1 Jun–30 Sep: daily 9:00–20:00",
  "status": "verified",
  "source": "armus-hours",
  "verifiedOn": "2026-11-23",
  "validUntil": "2026-12-31",
  "note": "Optional extra context shown under the fact."
}
```

| Field | Notes |
|---|---|
| `id` | Unique within the location, lowercase-with-dashes |
| `type` | `price`, `hours`, `transport`, `access` or `info`. The first four count as **important travel facts** and must always link to a source (`source`, or `checkAt` when not verified) |
| `label`, `value` | What the player reads |
| `status` | `verified`, `unverified` or `estimate` |
| `source` + `verifiedOn` | Required for `verified` |
| `checkAt` | List of source ids, required for unverified or estimated important facts |
| `validFrom` / `validUntil` | Optional. Use `validUntil` for price lists for a specific year: after that date the fact shows "Needs re-check" |
| `reviewDays` | Optional. Overrides the 180-day review window for this item |

### Example: verifying Klis opening hours

```json
{
  "id": "opening-hours",
  "type": "hours",
  "label": "Opening hours",
  "value": "Daily 9:00–19:00 (June–September)",
  "status": "verified",
  "source": "klis-fortress-site",
  "verifiedOn": "2026-12-02"
}
```

## 4. Bus fares

```json
"fares": {
  "source": "promet-fares-2026",
  "verifiedOn": "2026-11-23",
  "validFrom": "2026-06-01",
  "gameColumn": "online",
  "municipalities": { "split-riva": "Split", "salona": "Solin", "krka": null, … },
  "pairs": [
    { "between": ["Split", "Solin"], "online": 1.75, "driver": 3.5, "validityMinutes": 75 }
  ]
}
```

- Prices are **per person**: `online` is the value card / ticket office / online fare, and `driver` is the fare bought from the driver.
- The game charges `gameColumn` × party size, and shows it as `2 × €1.75 = €3.50 fare ✓`.
- Journeys between municipalities not listed in `pairs` use an estimated fare, shown as `≈ … est.`.
- When a new price list comes out, update the numbers, `verifiedOn`, `validFrom` and the `source` URL.

## What the audit checks

**Errors** (`npm run audit:check` fails):
- A verified item with no `source` or `verifiedOn`.
- An unknown source id, or a source URL that isn't https.
- A malformed date, or a `verifiedOn` date in the future.
- An unverified or estimated important fact (or game price) without `checkAt`.
- A `source` on an item that isn't verified.
- A "verified" game price that no fact backs.
- Invalid statuses, duplicate ids, invalid fares or duplicate fare pairs.
- A game location with no data.

**Warnings** (`npm run audit -- --strict` fails):
- `STALE`: verified longer ago than the review window.
- `EXPIRED`: `validUntil` has passed.
- `EXPIRES_SOON`: `validUntil` is within 30 days.
- `SOURCE_UNUSED`: a source that nothing references.

To see what will be due for re-checking at a future date, run `npm run audit -- --today=2027-06-01`.
