import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-stone/10 bg-stone text-snow/80">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-snow">Journey Through Ladakh</p>
            <p className="mt-1 max-w-sm text-sm">
              A digital travel companion for the Land of High Passes — destinations, itineraries,
              and an AI assistant grounded in verified local knowledge.
            </p>
          </div>
          <nav className="flex gap-6 text-sm">
            <Link to="/places" className="hover:text-snow">
              Explore
            </Link>
            <Link to="/packages" className="hover:text-snow">
              Packages
            </Link>
            <Link to="/planner" className="hover:text-snow">
              Plan a Trip
            </Link>
            <Link to="/ai" className="hover:text-snow">
              Ask AI
            </Link>
          </nav>
        </div>
        <p className="mt-8 text-xs text-snow/50">
          Travel information on this site is editorial and AI-assisted — always confirm permits,
          road conditions, and safety details with the relevant local authority before you travel.
        </p>
      </div>
    </footer>
  );
}
