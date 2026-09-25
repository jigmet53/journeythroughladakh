import { useEffect, useRef, useState } from 'react';
import { photos, type PhotoId } from '../../data/photos';
import { photoSrc, photoSrcSet } from '../../data/imagery';

interface PhotoProps {
  /** A curated photo from the catalog. */
  id?: PhotoId;
  /** An explicit URL (e.g. an admin-set heroImageUrl). Wins over `id`. */
  src?: string | null;
  alt?: string;
  sizes?: string;
  /** Above-the-fold image: load eagerly and at high priority. */
  priority?: boolean;
  className?: string;
}

/** Fills its nearest `relative` parent. Fades in once loaded and degrades to a
 * placeholder if there is no image or it fails, so a broken URL never leaves a
 * broken-image icon in the layout. */
export function Photo({ id, src, alt, sizes = '100vw', priority = false, className = '' }: PhotoProps) {
  const url = src ?? (id ? photoSrc(id) : null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setStatus('loading');
    // Cached images can finish before React attaches onLoad.
    if (ref.current?.complete && ref.current.naturalWidth > 0) setStatus('loaded');
  }, [url]);

  if (!url || status === 'error') {
    return (
      <div
        role="img"
        aria-label={alt ?? (id ? photos[id].alt : 'No photo available')}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sand/60 via-sand/30 to-sky/40 text-stone/30"
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M3 19l6-10 4 6 3-4 5 8H3z" strokeLinejoin="round" />
          <circle cx="17" cy="6" r="1.5" />
        </svg>
      </div>
    );
  }

  return (
    <img
      ref={ref}
      src={url}
      srcSet={!src && id ? photoSrcSet(id) : undefined}
      sizes={!src && id ? sizes : undefined}
      alt={alt ?? (id ? photos[id].alt : '')}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      // React 18 only forwards the lowercase attribute (`fetchPriority` is React 19).
      {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
        status === 'loaded' ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  );
}
