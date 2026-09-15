import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

const navLinks = [
  { to: '/places', label: 'Explore' },
  { to: '/packages', label: 'Packages' },
  { to: '/planner', label: 'Plan a Trip' },
  { to: '/ai', label: 'Ask AI' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b border-stone/10 bg-snow/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-lg font-semibold text-stone">
          Journey Through Ladakh
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-accent ${
                  isActive ? 'text-accent' : 'text-stone/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/account/trips" className="text-sm font-medium text-stone/80 hover:text-accent">
                {user?.username}
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-full border border-stone/20 px-4 py-1.5 text-sm font-medium text-stone hover:border-accent hover:text-accent"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-stone px-4 py-1.5 text-sm font-medium text-snow hover:bg-accent"
            >
              Log in
            </Link>
          )}
        </div>

        <button
          className="text-stone md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-stone/10 px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-stone/80 hover:bg-sand/30"
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="rounded-md px-2 py-2 text-left text-sm font-medium text-stone/80 hover:bg-sand/30"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-stone/80 hover:bg-sand/30"
            >
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
