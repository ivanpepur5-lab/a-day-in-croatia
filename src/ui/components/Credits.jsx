import { PHOTOS } from '../../data/photos.js';
import { LOCATIONS, AUDIT_DATE } from '../../data/locations.js';

const PLACE_NAMES = {
  'split-hero': 'Split waterfront (title image)',
  ...Object.fromEntries(LOCATIONS.map((l) => [l.id, l.name])),
};

/** Photo attribution (required by CC BY / CC BY-SA) and the data sources used. */
export default function Credits() {
  const verifiedSources = new Map();
  for (const loc of LOCATIONS) {
    for (const f of loc.facts) {
      if (f.status === 'verified') verifiedSources.set(f.source.url, f.source.label);
    }
  }
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

      <h3 className="howto__h">Verified data sources</h3>
      <p className="howto__p">Checked on {AUDIT_DATE}. Every fact in the game is labelled verified, unverified or estimate.</p>
      <ul className="credits__sources">
        {[...verifiedSources].map(([url, label]) => (
          <li key={url}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
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
