import { useState } from 'react';
import LocationArt from '../art/LocationArt.jsx';
import { creditLine, webpOf } from '../../data/photos.js';

/**
 * Destination imagery: a licensed photograph (see data/photos.js), falling
 * back to the illustrated poster only if the photo is missing or fails to load.
 *
 * variant: 'thumb' (small tiles) | 'card' (default) | 'hero'
 * credit:  true → overlay the photographer + licence line
 */
export default function Media({
  location,
  photo: photoProp,
  artId,
  className = '',
  label,
  variant = 'card',
  credit = false,
  priority = false,
}) {
  const photo = photoProp ?? location?.photo;
  const [failed, setFailed] = useState(false);

  if (photo?.src && !failed) {
    const src = variant === 'thumb' ? photo.thumb : photo.src;
    const srcSet =
      variant === 'thumb'
        ? undefined
        : [`${photo.thumb} 480w`, `${photo.src} 1200w`, photo.large && `${photo.large} 1920w`]
            .filter(Boolean)
            .join(', ');
    const sizes = variant === 'hero' ? '100vw' : variant === 'card' ? '(min-width: 960px) 25vw, 50vw' : undefined;
    return (
      <figure className={`media media--photo ${className}`}>
        <picture>
          <source
            type="image/webp"
            srcSet={srcSet ? srcSet.replace(/\.jpg/g, '.webp') : webpOf(src)}
            sizes={srcSet ? sizes : undefined}
          />
          <img
            src={src}
            srcSet={srcSet}
            sizes={srcSet ? sizes : undefined}
            alt={label ?? photo.alt ?? location?.name ?? ''}
            loading={priority ? 'eager' : 'lazy'}
            fetchpriority={priority ? 'high' : undefined}
            decoding="async"
            onError={() => setFailed(true)}
          />
        </picture>
        {credit && (
          <figcaption className="media__credit">
            <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">
              {creditLine(photo)}
            </a>
          </figcaption>
        )}
      </figure>
    );
  }
  return (
    <div className={`media ${className}`}>
      <LocationArt id={artId ?? location?.id} title={label} />
    </div>
  );
}
