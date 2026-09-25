import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** React Router keeps the scroll position across route changes and does not
 * follow #anchors on its own. Reset to the top on navigation, or, when the URL
 * has a #hash (e.g. /guide#altitude), scroll to that element. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    // Wait a frame so the new route's content is in the DOM.
    const frame = requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
