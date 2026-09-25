import { Link } from 'react-router-dom';
import { photos, type PhotoId } from '../../data/photos';

/** Attribution caption required by the photos' CC licences; links to the full
 * credits page. By default it sits in the bottom-right of a `relative` photo
 * container; `inline` places it in normal flow instead. */
export function PhotoCredit({
  id,
  className = '',
  inline = false,
}: {
  id: PhotoId;
  className?: string;
  inline?: boolean;
}) {
  const p = photos[id];
  return (
    <Link
      to="/credits"
      title={`${p.alt} — ${p.author}, ${p.license}. View photo credits.`}
      className={`${
        inline ? 'inline-block' : 'absolute bottom-2 right-3 z-10'
      } max-w-full truncate rounded-full bg-night/50 px-2.5 py-1 text-[11px] text-snow/90 backdrop-blur-sm hover:bg-night/70 ${className}`}
    >
      Photo: {p.author} · {p.license}
    </Link>
  );
}
