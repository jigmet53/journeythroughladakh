import { useCallback, useEffect, useRef, useState } from 'react';
import { photos, type PhotoId } from '../../data/photos';
import { photoSrc } from '../../data/imagery';
import { Photo } from './Photo';
import { Link } from 'react-router-dom';

/** Thumbnail grid that opens a full-screen viewer. Esc closes, ←/→ navigate,
 * and focus returns to the thumbnail that opened it. */
export function Gallery({ ids }: { ids: PhotoId[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    opener.current?.focus();
  }, []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? i : (i + delta + ids.length) % ids.length)),
    [ids.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  if (ids.length === 0) return null;
  const active = openIndex !== null ? photos[ids[openIndex]] : null;

  return (
    <>
      <div className={`grid grid-cols-2 gap-3 ${ids.length === 2 ? '' : 'sm:grid-cols-3'}`}>
        {ids.map((id, i) => (
          <button
            key={id}
            type="button"
            onClick={(e) => {
              opener.current = e.currentTarget;
              setOpenIndex(i);
            }}
            aria-label={`View photo: ${photos[id].alt}`}
            className={`group relative overflow-hidden rounded-xl bg-sand/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              i === 0 && ids.length > 2 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-[4/3]'
            }`}
          >
            <Photo
              id={id}
              sizes="(min-width: 640px) 33vw, 50vw"
              className="transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex flex-col bg-stone/95 p-4"
          onClick={close}
        >
          <div className="flex justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="rounded-full p-2 text-snow hover:bg-snow/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {ids.length > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute left-0 z-10 rounded-full bg-stone/60 p-3 text-snow hover:bg-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
            )}
            <img
              src={photoSrc(ids[openIndex])}
              alt={active.alt}
              className="max-h-full max-w-full rounded-lg object-contain"
            />
            {ids.length > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute right-0 z-10 rounded-full bg-stone/60 p-3 text-snow hover:bg-stone focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          <p className="pt-3 text-center text-sm text-snow/80" onClick={(e) => e.stopPropagation()}>
            {active.alt}
            <span className="mx-2 text-snow/40">·</span>
            <Link to="/credits" onClick={close} className="underline hover:text-snow">
              {active.author}, {active.license}
            </Link>
          </p>
        </div>
      )}
    </>
  );
}
