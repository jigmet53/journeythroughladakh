import { Link } from 'react-router-dom';

const columns = [
  {
    heading: 'Explore',
    links: [
      { to: '/places', label: 'Destinations' },
      { to: '/packages', label: 'Trip packages' },
      { to: '/guide', label: 'Travel guide' },
    ],
  },
  {
    heading: 'Plan',
    links: [
      { to: '/planner', label: 'Trip planner' },
      { to: '/ai', label: 'Ask the AI assistant' },
      { to: '/account/trips', label: 'My trips' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact us' },
      { to: '/credits', label: 'Photo credits' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-night text-snow/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-xl font-semibold text-snow">Journey Through Ladakh</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed">
              A digital travel companion for the Land of High Passes — destinations, itineraries,
              and an AI assistant grounded in verified local knowledge.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-ember">{col.heading}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="hover:text-snow hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-snow/10 pt-6 text-xs text-snow/50">
          <p>© {new Date().getFullYear()} Journey Through Ladakh</p>
          <p className="flex gap-4">
            <Link to="/privacy" className="hover:text-snow hover:underline">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-snow hover:underline">
              Terms
            </Link>
          </p>
        </div>
        <div className="mt-4 text-xs leading-relaxed text-snow/50">
          <p>
            Travel information on this site is editorial and AI-assisted — always confirm permits,
            road conditions, and safety details with the relevant local authority before you travel.
          </p>
          <p className="mt-2">
            Photographs are freely licensed from Wikimedia Commons and credited to their
            photographers — <Link to="/credits" className="underline hover:text-snow">see all credits</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}
