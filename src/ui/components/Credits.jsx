import { PHOTOS } from '../../data/photos.js';
import { LOCATIONS, AUDIT_DATE } from '../../data/locations.js';
import { FARE_SOURCE, PROMET_FARES } from '../../data/fares.js';
import { formatCheckDate } from '../../data/verification.js';
import { stateOf, DataLegend } from './Status.jsx';

const PLACE_NAMES = {
  'split-hero': 'Split waterfront (title image)',
  ...Object.fromEntries(LOCATIONS.map((l) => [l.id, l.name])),
};

/** Photo attribution (required by CC BY / CC BY-SA) and the data sources used. */
export default function Credits() {
  // url → { label, latest verification date }
  const verifiedSources = new Map();
  const counts = { verified: 0, stale: 0, unverified: 0, estimate: 0 };
  for (const loc of LOCATIONS) {
    for (const f of [loc.price, loc.visit, ...loc.facts]) {
      counts[stateOf(f).state] += 1;
      if (f.status === 'verified' && f.source) {
        const prev = verifiedSources.get(f.source.url);
        if (!prev || prev.date < f.verifiedOn) verifiedSources.set(f.source.url, { label: f.source.label, date: f.verifiedOn });
      }
    }
  }
  verifiedSources.set(FARE_SOURCE.url, { label: FARE_SOURCE.label, date: FARE_SOURCE.verifiedOn });
  return (
    <div className="credits">
      <h3 className="howto__h">Photography</h3>
      <p className="howto__p">
        All photographs come from Wikimedia Commons. They were resized for the web and are shown cropped.
      </p>
      <ul className="credits__list" data-testid="photo-credits">
        {Object.entries(PHOTOS).map(([id, p]) => (
          <li key={id}>
            <img src={p.thumb} alt="" loading="lazy" />
            <div>
              <strong>{PLACE_NAMES[id] ?? id}</strong>
              <span>
                <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {p.title.replace(/_/g, ' ')}
                </a>
              </span>
              <span>
                by {p.author} ·{' '}
                {p.licenseUrl ? (
                  <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer">
                    {p.license}
                  </a>
                ) : (
                  p.license
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="howto__h">Data quality</h3>
      <ul className="quality" data-testid="data-quality">
        <li className="quality--verified">
          <strong>{counts.verified + Object.keys(PROMET_FARES).length}</strong> verified
        </li>
        <li className="quality--stale">
          <strong>{counts.stale}</strong> need re-check
        </li>
        <li className="quality--unverified">
          <strong>{counts.unverified}</strong> unverified
        </li>
        <li className="quality--estimate">
          <strong>{counts.estimate}</strong> estimates
        </li>
      </ul>
      <p className="howto__p">Last audit: {formatCheckDate(AUDIT_DATE)}. Verified counts include {Object.keys(PROMET_FARES).length} official bus fares.</p>
      <DataLegend />

      <h3 className="howto__h">Verified data sources</h3>
      <ul className="credits__sources">
        {[...verifiedSources].map(([url, { label, date }]) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {label}
            </a>{' '}
            <span className="credits__date">· last verified {formatCheckDate(date)}</span>
          </li>
        ))}
      </ul>
      <p className="howto__p">
        Travel times come from a simple distance model, not from timetables. Promet Split lines are listed only where the
        official network page names them.
      </p>
    </div>
  );
}
