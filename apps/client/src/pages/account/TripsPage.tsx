import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

export function TripsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-stone">My trips</h1>
      <p className="mt-1 text-sm text-stone/60">Signed in as {user?.username}.</p>

      <div className="mt-8 rounded-xl border border-dashed border-stone/20 p-10 text-center">
        <p className="text-stone/70">No trips yet.</p>
        <p className="mt-1 text-sm text-stone/50">
          Build a day-by-day itinerary and it will show up here.
        </p>
        <Link
          to="/planner"
          className="mt-4 inline-block rounded-full bg-stone px-5 py-2 text-sm font-medium text-snow hover:bg-accent"
        >
          Plan a trip
        </Link>
      </div>
    </div>
  );
}
