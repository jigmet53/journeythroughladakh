import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { destinationsApi } from '../../services/destinations.api';
import { DestinationCard } from '../../components/places/DestinationCard';

export function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => destinationsApi.bySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-stone/60">Loading…</div>;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-stone">Destination not found</h1>
        <Link to="/places" className="mt-4 inline-block text-accent hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  const hasCoords = data.latitude != null && data.longitude != null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="mb-4 text-sm text-stone/50">
        <Link to="/places" className="hover:text-accent">
          Explore
        </Link>{' '}
        / {data.name}
      </nav>

      <header className="mb-8">
        {data.category && (
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            {data.category.name}
          </span>
        )}
        <h1 className="mt-1 font-display text-3xl font-semibold text-stone sm:text-4xl">{data.name}</h1>
        <p className="mt-3 text-lg text-stone/70">{data.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-stone/10 bg-sand/10 p-4 text-sm sm:grid-cols-4">
          {data.altitudeMeters != null && (
            <div>
              <dt className="text-stone/50">Altitude</dt>
              <dd className="font-medium text-stone">{data.altitudeMeters.toLocaleString()}m</dd>
            </div>
          )}
          {data.distanceFromLeh != null && (
            <div>
              <dt className="text-stone/50">From Leh</dt>
              <dd className="font-medium text-stone">{data.distanceFromLeh} km</dd>
            </div>
          )}
          {data.bestTime && (
            <div>
              <dt className="text-stone/50">Best time</dt>
              <dd className="font-medium text-stone">{data.bestTime}</dd>
            </div>
          )}
          {data.howToReach && (
            <div className="col-span-2 sm:col-span-4">
              <dt className="text-stone/50">How to reach</dt>
              <dd className="font-medium text-stone">{data.howToReach}</dd>
            </div>
          )}
        </dl>
      </header>

      <section className="prose prose-stone max-w-none">
        <h2 className="font-display text-xl font-semibold text-stone">Overview</h2>
        <p className="text-stone/80">{data.overview}</p>
      </section>

      {hasCoords && (
        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl font-semibold text-stone">Map</h2>
          <div className="h-80 overflow-hidden rounded-xl border border-stone/10">
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

      <p className="mt-6 rounded-lg bg-sand/20 p-4 text-sm text-stone/60">
        Road conditions, permits, and safety information change frequently — confirm current
        status with the relevant local authority before you travel.
      </p>

      {data.related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-stone">Related destinations</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.related.map((r) => (
              <DestinationCard key={r.id} destination={{ ...r, categoryName: r.category?.name }} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
