import { NavigateFunction } from 'react-router-dom';

/**
 * Scroll to an element by ID
 * @param anchor - Anchor ID (e.g., 'features', 'specs')
 * @param offset - Offset from top (default: 100 for navbar)
 */
const scrollToAnchor = (anchor: string, offset: number = 100) => {
  const element = document.getElementById(anchor);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    return true;
  }
  return false;
};

/**
 * Navigate to a route and optionally scroll to an anchor
 * @param navigate - React Router navigate function
 * @param path - Route path (e.g., '/product', '/about')
 * @param anchor - Optional anchor ID (e.g., 'features', 'specs')
 */
export const navigateToSection = (
  navigate: NavigateFunction,
  path: string,
  anchor?: string
) => {
  const currentPath = window.location.pathname;
  const isSamePage = currentPath === path;

  // If we're on the same page and anchor is provided, just scroll
  if (isSamePage && anchor) {
    // Try immediately, then retry after a short delay
    if (!scrollToAnchor(anchor)) {
      setTimeout(() => scrollToAnchor(anchor), 100);
    }
    return;
  }

  // Navigate to the route
  navigate(path);

  // If anchor is provided, scroll to it after navigation
  if (anchor) {
    // Try multiple times with increasing delays to handle page loading
    const attempts = [100, 300, 500, 1000];
    attempts.forEach((delay) => {
      setTimeout(() => {
        scrollToAnchor(anchor);
      }, delay);
    });
  } else {
    // Scroll to top if no anchor
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }
};
