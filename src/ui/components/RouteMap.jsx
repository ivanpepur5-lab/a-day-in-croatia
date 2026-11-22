import { LOCATIONS, CATEGORIES } from '../../data/locations.js';

/**
 * Schematic (not to-scale cartography) map of the region: all destinations
 * are projected from their coordinates; the planned route is drawn on top.
 */
const W = 360;
const H = 220;
const PAD = 26;

/**
 * Distance-compressed polar projection around Split: bearings are true, but
 * distance from the hub is scaled by r^0.35 so nearby stops stay readable
 * while far ones (Krka) still fit.
 */
const ORIGIN = { lat: 43.5075, lng: 16.44 };
const KM_PER_DEG_LAT = 111.32;
const kmPerDegLng = KM_PER_DEG_LAT * Math.cos((ORIGIN.lat * Math.PI) / 180);
const EXP = 0.35;

function polar({ lat, lng }) {
  const x = (lng - ORIGIN.lng) * kmPerDegLng;
  const y = (lat - ORIGIN.lat) * KM_PER_DEG_LAT;
  const r = Math.hypot(x, y);
  if (r === 0) return { x: 0, y: 0 };
  const k = r ** EXP / r;
  return { x: x * k, y: y * k };
}

const raw = LOCATIONS.map((l) => polar(l.coords)).concat([{ x: 0, y: 0 }]);
const box = {
  minX: Math.min(...raw.map((p) => p.x)),
  maxX: Math.max(...raw.map((p) => p.x)),
  minY: Math.min(...raw.map((p) => p.y)),
  maxY: Math.max(...raw.map((p) => p.y)),
};
const scale = Math.min((W - PAD * 2) / (box.maxX - box.minX), (H - PAD * 2) / (box.maxY - box.minY));
const offX = (W - (box.maxX - box.minX) * scale) / 2;
const offY = (H - (box.maxY - box.minY) * scale) / 2;

function project(coords) {
  const p = polar(coords);
  return { x: offX + (p.x - box.minX) * scale, y: offY + (box.maxY - p.y) * scale };
}

export default function RouteMap({ hub, orderedIds = [], compact = false }) {
  const points = [hub, ...orderedIds.map((id) => LOCATIONS.find((l) => l.id === id)), hub].map((p) => ({
    ...p,
    ...project(p.coords),
  }));
  const path = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const hubPt = project(hub.coords);
  return (
    <figure className={`routemap ${compact ? 'routemap--compact' : ''}`}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Schematic route map">
        <defs>
          <pattern id="rm-grid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" fill="none" className="routemap__grid" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#rm-grid)" />
        <text x={W - 12} y={H - 12} textAnchor="end" className="routemap__sea">
          Adriatic Sea
        </text>
        {orderedIds.length > 0 && <path d={path} className="routemap__route" />}
        {LOCATIONS.map((l) => {
          const { x, y } = project(l.coords);
          const idx = orderedIds.indexOf(l.id);
          const on = idx >= 0;
          return (
            <g key={l.id} className={on ? 'routemap__stop is-on' : 'routemap__stop'}>
              <circle cx={x} cy={y} r={on ? 10 : 4} />
              {on && (
                <text x={x} y={y + 3.5} textAnchor="middle" className="routemap__num">
                  {idx + 1}
                </text>
              )}
              {(!compact || on) && (
                <text x={x} y={y - (on ? 15 : 9)} textAnchor="middle" className="routemap__name">
                  {l.short}
                </text>
              )}
              <title>{`${CATEGORIES[l.category].emoji} ${l.name}`}</title>
            </g>
          );
        })}
        <g className="routemap__hub">
          <rect x={hubPt.x - 6} y={hubPt.y - 6} width="12" height="12" rx="3" transform={`rotate(45 ${hubPt.x} ${hubPt.y})`} />
        </g>
      </svg>
      <figcaption>Schematic map · distances compressed, not for navigation</figcaption>
    </figure>
  );
}
