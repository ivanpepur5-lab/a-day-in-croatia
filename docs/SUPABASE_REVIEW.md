# Supabase — status and review notes

**Status: disabled.** `src/services/supabase.js` only turns on when `VITE_ENABLE_SUPABASE=true` **and** both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set. Gameplay never depends on it.

Points to decide before enabling `supabase/schema.sql`:

1. **Scores can be forged.** The insert policy is `with check (true)` and the client sends its own `total`. Anyone with the anon key can post any score. Options: recompute the score server-side from `plan` (an Edge Function or a Postgres function running the same scoring rules), or treat the table as untrusted analytics only.
2. **Player identity** is a random ID generated in the browser (`player_id`), so `unique (player_id, date_key)` doesn't stop repeat submissions under new IDs.
3. **No rate limiting** on inserts.
4. **`date_key` is supplied by the client.** Validate it server-side against the current puzzle day in Europe/Zagreb (see `src/engine/daily.js`), and check that `challenge_id` matches that day.
5. **The `daily_distribution` view** is readable by `anon` with `security_invoker = false`. That's acceptable because it only exposes counts, but confirm this is intended.
6. **Personal data:** none is collected beyond the random ID. Document this in a privacy note before launch.
