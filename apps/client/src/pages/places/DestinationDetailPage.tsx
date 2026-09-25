import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { destinationsApi } from '../../services/destinations.api';
import { DestinationCard } from '../../components/places/DestinationCard';
import { Gallery } from '../../components/ui/Gallery';
import { PageHero } from '../../components/ui/PageHero';
import { Seo } from '../../components/seo/Seo';
import { destinationImagery, photoSrc } from '../../data/imagery';
import { buildBreadcrumbList, buildTouristDestination } from '../../utils/structuredData';

export function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => destinationsApi.bySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Loading destination">
        <div className="h-[22rem] animate-pulse bg-sand/40 sm:h-[26rem]" />
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 sm:px-6">
          <div className="h-4 w-full animate-pulse rounded bg-sand/30" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-sand/30" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-sand/30" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-stone">Destination not found</h1>
        <p className="mt-2 text-stone/60">It may have been moved or removed.</p>
        <Link to="/places" className="mt-6 inline-block rounded-full bg-stone px-6 py-2.5 text-sm font-medium text-snow hover:bg-accent">
          Back to Explore
        </Link>
      </div>
    );
  }

  const imagery = destinationImagery[data.slug];
  const hasCoords = data.latitude != null && data.longitude != null;
  const facts = [
    data.altitudeMeters != null && { label: 'Altitude', value: `${data.altitudeMeters.toLocaleString()} m` },
    data.distanceFromLeh != null && { label: 'From Leh', value: `${data.distanceFromLeh} km` },
    data.bestTime && { label: 'Best time', value: data.bestTime },
  ].filter((f): f is { label: string; value: string } => !!f);

  return (
    <article>
      <Seo
        title={data.name}
        description={data.summary}
        path={`/places/${data.slug}`}
        image={data.heroImageUrl ?? (imagery ? photoSrc(imagery.hero) : undefined)}
        jsonLd={[
          buildTouristDestination(data),
          buildBreadcrumbList([
            { name: 'Explore', path: '/places' },
            { name: data.name, path: `/places/${data.slug}` },
          ]),
        ]}
      />

      <PageHero
        photo={imagery?.hero ?? 'hero-indus-road'}
        src={data.heroImageUrl}
        eyebrow={data.category?.name}
        title={data.name}
        subtitle={data.summary}
        size="lg"
      >
        <nav aria-label="Breadcrumb" className="mt-4 text-sm text-snow/70">
          <Link to="/places" className="hover:text-snow">
            Explore
          </Link>{' '}
          / <span className="text-snow">{data.name}</span>
        </nav>
      </PageHero>

      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        {(facts.length > 0 || data.howToReach) && (
          <dl className="relative z-10 -mt-6 grid grid-cols-1 gap-x-6 gap-y-4 rounded-2xl border border-stone/10 bg-white p-5 shadow-lg sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-stone/50">{f.label}</dt>
                <dd className="mt-0.5 font-display text-lg font-semibold text-stone">{f.value}</dd>
              </div>
            ))}
            {data.howToReach && (
              <div className="sm:col-span-3">
                <dt className="text-xs font-medium uppercase tracking-wider text-stone/50">How to reach</dt>
                <dd className="mt-0.5 text-stone/80">{data.howToReach}</dd>
              </div>
            )}
          </dl>
        )}

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-stone">Overview</h2>
          <p className="mt-3 text-lg leading-relaxed text-stone/80">{data.overview}</p>
        </section>

        {imagery && imagery.gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-semibold text-stone">Gallery</h2>
            <Gallery ids={imagery.gallery} />
          </section>
        )}

        {hasCoords && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-semibold text-stone">Map</h2>
            <div className="h-80 overflow-hidden rounded-2xl border border-stone/10">
              <MapContainer
                center={[data.latitude!, data.longitude!]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[data.latitude!, data.longitude!]}>
                  <Popup>{data.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </section>
        )}

        <p className="mt-8 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-stone/70">
          <strong className="font-semibold text-stone">Before you travel:</strong> road conditions,
          permits, and safety information change frequently — confirm current status with the
          relevant local authority.
        </p>

        {data.related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-5 font-display text-2xl font-semibold text-stone">Related destinations</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {data.related.map((r) => (
                <DestinationCard key={r.id} destination={{ ...r, categoryName: r.category?.name }} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
