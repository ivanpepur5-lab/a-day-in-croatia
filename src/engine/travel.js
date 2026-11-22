/**
 * Deterministic travel-time model (no car).
 *
 * ⚠️ These are ESTIMATES derived from straight-line distance — not public
 * transport timetables or fares. The model is intentionally simple so that
 * players can reason about it:
 *
 *   roadKm  = straight-line km × DETOUR_FACTOR
 *   walk    if roadKm ≤ WALK_MAX_KM   → roadKm at WALK_KMH, free
 *   transit otherwise                → WAIT_MIN + the first REGIONAL_THRESHOLD_KM
 *                                      at LOCAL_KMH + the rest at REGIONAL_KMH,
 *                                      rounded up to 5 minutes (continuous, so a
 *                                      farther stop is never quicker to reach),
 *                                      illustrative fare per person
 */

export const TRAVEL_MODEL = {
  DETOUR_FACTOR: 1.3,
  WALK_MAX_KM: 2.5,
  WALK_KMH: 4.5,
  WAIT_MIN: 15,
  LOCAL_KMH: 28, // urban / suburban bus estimate
  REGIONAL_KMH: 50, // intercity coach estimate
  REGIONAL_THRESHOLD_KM: 15,
  FARE_BASE_EUR: 2,
  FARE_PER_KM_EUR: 0.1,
};

const EARTH_RADIUS_KM = 6371;
const toRad = (deg) => (deg * Math.PI) / 180;

/** Great-circle distance in km. */
export function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

const roundUpTo = (value, step) => Math.ceil(value / step) * step;
const roundToHalf = (value) => Math.round(value * 2) / 2;

/**
 * Estimate a single leg between two points.
 * @returns {{mode:'walk'|'transit', km:number, minutes:number, costPerPerson:number}}
 */
export function estimateLeg(fromCoords, toCoords, model = TRAVEL_MODEL) {
  const km = haversineKm(fromCoords, toCoords) * model.DETOUR_FACTOR;
  if (km <= model.WALK_MAX_KM) {
    return {
      mode: 'walk',
      km: Math.round(km * 10) / 10,
      minutes: Math.max(1, Math.ceil((km / model.WALK_KMH) * 60)),
      costPerPerson: 0,
    };
  }
  const localKm = Math.min(km, model.REGIONAL_THRESHOLD_KM);
  const regionalKm = Math.max(0, km - model.REGIONAL_THRESHOLD_KM);
  const rideMinutes = (localKm / model.LOCAL_KMH) * 60 + (regionalKm / model.REGIONAL_KMH) * 60;
  const minutes = roundUpTo(model.WAIT_MIN + rideMinutes, 5);
  return {
    mode: 'transit',
    km: Math.round(km * 10) / 10,
    minutes,
    costPerPerson: roundToHalf(model.FARE_BASE_EUR + km * model.FARE_PER_KM_EUR),
  };
}

export const MODE_LABELS = {
  walk: { label: 'Walk', emoji: '🚶' },
  transit: { label: 'Bus (est.)', emoji: '🚌' },
};
