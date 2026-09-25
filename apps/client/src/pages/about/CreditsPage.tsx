import { Photo } from '../../components/ui/Photo';
import { Seo } from '../../components/seo/Seo';
import { photos, type PhotoId } from '../../data/photos';

export function CreditsPage() {
  const ids = Object.keys(photos) as PhotoId[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Seo
        title="Photo credits"
        description="Photographers and licences for the images used on Journey Through Ladakh."
        path="/credits"
      />
      <h1 className="font-display text-3xl font-semibold text-stone sm:text-4xl">Photo credits</h1>
      <p className="mt-3 max-w-2xl text-stone/70">
        Every photograph on this site is freely licensed and comes from Wikimedia Commons. Thank you
        to the photographers below. Images are resized and compressed for the web; no other changes
        have been made. Each licence link explains how you may reuse the photo.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {ids.map((id) => {
          const p = photos[id];
          return (
            <li key={id} className="overflow-hidden rounded-2xl border border-stone/10 bg-white">
              <div className="relative aspect-[16/9] bg-sand/40">
                <Photo id={id} sizes="(min-width: 640px) 50vw, 100vw" />
              </div>
              <div className="p-4 text-sm">
                <p className="text-stone/80">{p.alt}</p>
                <p className="mt-2 text-stone/60">
                  By <span className="font-medium text-stone">{p.author}</span> ·{' '}
                  <a href={p.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {p.license}
                  </a>{' '}
                  ·{' '}
                  <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Original
                  </a>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
