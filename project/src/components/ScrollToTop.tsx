import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Without this, React Router preserves scroll position across navigations,
// so e.g. clicking a restaurant card near the bottom of a long list opens
// the detail page already scrolled halfway down instead of at the top.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
