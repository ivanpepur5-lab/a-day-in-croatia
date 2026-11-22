/**
 * Optional Supabase integration (prepared, not required).
 *
 * Enabled only when both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
 * at build time. Uses the PostgREST HTTP API directly, so no SDK is bundled.
 * Table definition: supabase/schema.sql
 *
 * Gameplay never depends on this — every call fails soft.
 */
const url = import.meta.env?.VITE_SUPABASE_URL;
const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

function headers() {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Submit an official daily result.
 * @param {{playerId:string, dateKey:string, puzzleNumber:number, challengeId:string,
 *          order:string[], total:number, components:Record<string,number>}} row
 */
export async function submitResult(row) {
  if (!isSupabaseConfigured) return { ok: false, skipped: true };
  try {
    const res = await fetch(`${url}/rest/v1/daily_results`, {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal,resolution=ignore-duplicates' },
      body: JSON.stringify({
        player_id: row.playerId,
        date_key: row.dateKey,
        puzzle_number: row.puzzleNumber,
        challenge_id: row.challengeId,
        plan: row.order,
        total: row.total,
        components: row.components,
      }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

/** Global score distribution for a day (from the `daily_distribution` view). */
export async function fetchDistribution(dateKey) {
  if (!isSupabaseConfigured) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/daily_distribution?date_key=eq.${encodeURIComponent(dateKey)}&select=bucket,players`,
      { headers: headers() },
    );
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
