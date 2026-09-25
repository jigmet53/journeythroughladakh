import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

const navLinks = [
  { to: '/places', label: 'Explore' },
  { to: '/packages', label: 'Packages' },
  { to: '/guide', label: 'Guide' },
  { to: '/ai', label: 'Ask AI' },
];

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-night" />
      <path d="M4 25l8.5-14 5 8 3.5-5 7 11z" className="fill-sand" />
      <circle cx="23" cy="9" r="2.5" className="fill-ember" />
    </svg>
  );
}

/** Height is fixed (h-16) because the home hero slides underneath it with a
 * matching negative margin. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const isHome = useLocation().pathname === '/';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  // Over the home hero the bar is see-through with light text; anywhere else,
  // or once the page scrolls, it becomes a solid light bar.
  const overlay = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkTone = (isActive: boolean) =>
    overlay
      ? isActive
        ? 'border-ember text-ember'
        : 'border-transparent text-snow/90 hover:text-ember'
      : isActive
        ? 'border-accent text-accent'
        : 'border-transparent text-stone/80 hover:text-accent';

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        overlay
          ? 'border-transparent bg-gradient-to-b from-night/60 to-transparent'
          : `bg-snow/95 backdrop-blur ${scrolled ? 'border-stone/10 shadow-md' : 'border-transparent'}`
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className={`flex items-center gap-2.5 font-display text-lg font-semibold ${
            overlay ? 'text-snow' : 'text-stone'
          }`}
        >
          <LogoMark />
          <span className="hidden sm:inline">Journey Through Ladakh</span>
          <span className="sm:hidden">Journey Ladakh</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `border-b-2 py-1 text-sm font-medium transition-colors ${linkTone(isActive)}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin/inbox" className={`text-sm font-medium ${overlay ? 'text-snow/90 hover:text-ember' : 'text-stone/80 hover:text-accent'}`}>
                  Inbox
                </Link>
              )}
              <Link
                to="/account/trips"
                className={`text-sm font-medium ${overlay ? 'text-snow/90 hover:text-ember' : 'text-stone/80 hover:text-accent'}`}
              >
                {user?.username}
              </Link>
              <button
                onClick={() => logout()}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  overlay
                    ? 'border-snow/40 text-snow hover:bg-snow/10'
                    : 'border-stone/20 text-stone hover:border-accent hover:text-accent'
                }`}
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`px-2 text-sm font-medium ${overlay ? 'text-snow/90 hover:text-ember' : 'text-stone/80 hover:text-accent'}`}
            >
              Log in
            </Link>
          )}
          <Link
            to="/planner"
            className="rounded-full bg-ember px-5 py-2 text-sm font-semibold text-night transition hover:brightness-110"
          >
            Plan a trip
          </Link>
        </div>

        <button
          className={`rounded-md p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember md:hidden ${
            overlay ? 'text-snow' : 'text-stone'
          }`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="flex flex-col gap-1 border-t border-stone/10 px-4 pb-4 pt-2 md:hidden">
          {[...navLinks, { to: '/planner', label: 'Plan a Trip' }].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2.5 text-sm font-medium hover:bg-sand/30 ${
                  isActive ? 'bg-sand/20 text-accent' : 'text-stone/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin/inbox" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-stone/80 hover:bg-sand/30">
                  Inbox
                </Link>
              )}
              <Link
                to="/account/trips"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-stone/80 hover:bg-sand/30"
              >
                My trips
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-stone/80 hover:bg-sand/30"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-full bg-night px-3 py-2.5 text-center text-sm font-medium text-snow"
            >
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
