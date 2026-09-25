import type { ReactNode } from 'react';
import type { PhotoId } from '../../data/photos';
import { Photo } from '../ui/Photo';
import { PhotoCredit } from '../ui/PhotoCredit';

interface AuthLayoutProps {
  photo: PhotoId;
  /** Headline over the photo panel; wrap an accent word in <em>. */
  panelTitle: ReactNode;
  panelText: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Split screen for login/register: a photo panel on wide screens, the form
 * alone on phones. */
export function AuthLayout({ photo, panelTitle, panelText, title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative isolate hidden overflow-hidden bg-night text-snow lg:block">
        <Photo id={photo} alt="" priority sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/20" />
        <div className="relative flex h-full flex-col justify-end p-12 pb-16">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-ember">
            <span className="h-px w-8 bg-ember" aria-hidden="true" />
            Journey Through Ladakh
          </p>
          <h2 className="mt-4 max-w-md font-display text-5xl font-medium leading-tight [&_em]:font-medium [&_em]:text-ember">
            {panelTitle}
          </h2>
          <p className="mt-4 max-w-sm text-snow/75">{panelText}</p>
        </div>
        <PhotoCredit id={photo} />
      </div>

      <div className="flex items-center justify-center bg-snow px-4 py-14 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="font-display text-4xl font-medium text-stone">{title}</h1>
          <p className="mt-2 text-stone/60">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
