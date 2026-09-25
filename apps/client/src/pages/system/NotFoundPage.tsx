import { Link } from 'react-router-dom';
import { Photo } from '../../components/ui/Photo';
import { Seo } from '../../components/seo/Seo';

export function NotFoundPage() {
  return (
    <section className="relative isolate flex min-h-[32rem] items-center justify-center overflow-hidden bg-stone px-4 py-24 text-center text-snow">
      <Seo title="Page not found" description="This page could not be found." path="/404" />
      <Photo id="baralacha-la" alt="" />
      <div className="absolute inset-0 bg-stone/70" />
      <div className="relative max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand">Error 404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Lost on the high pass</h1>
        <p className="mt-3 text-snow/85">
          That page doesn't exist — the link may be old or mistyped. Head back to somewhere you can
          find your way from.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-snow hover:opacity-90">
            Go home
          </Link>
          <Link
            to="/places"
            className="rounded-full border border-snow/40 px-6 py-2.5 text-sm font-medium text-snow hover:border-snow hover:bg-snow/10"
          >
            Explore Ladakh
          </Link>
        </div>
      </div>
    </section>
  );
}
