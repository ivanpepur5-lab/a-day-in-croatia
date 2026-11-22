import LocationArt from '../art/LocationArt.jsx';

/**
 * Destination imagery. Uses a licensed photo when `location.photo` is set
 * (see README → "Adding photography"), otherwise the illustrated poster.
 */
export default function Media({ location, artId, className = '', label }) {
  const photo = location?.photo;
  if (photo?.src) {
    return (
      <figure className={`media ${className}`}>
        <img src={photo.src} alt={label ?? location.name} loading="lazy" decoding="async" />
        {photo.credit && <figcaption className="media__credit">{photo.credit}</figcaption>}
      </figure>
    );
  }
  return (
    <div className={`media ${className}`}>
      <LocationArt id={artId ?? location?.id} title={label} />
    </div>
  );
}
