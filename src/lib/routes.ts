// Path-based routing for the single-page app. Each route id maps to one real URL so
// pages can be shared, bookmarked and opened directly (the .htaccess SPA fallback
// serves index.html for every path).

export const ROUTE_PATHS: Record<string, string> = {
  'future-innovators': '/',
  ibk: '/ibk',
  challenges: '/competition',
  workflow: '/workflow',
  events: '/events',
  about: '/about',
  'for-schools': '/for-schools',
  'how-it-works': '/how-it-works',
  lgr22: '/curriculum',
  register: '/register',
  ideas: '/ideas',
  admin: '/admin',
  vxo: '/vxo',
  'vxo-register': '/vxo/register',
  'vxo-ideas': '/vxo/ideas',
};

// Event subdomains that only show their own routes, so visitors stay on that event.
// The first route is the fallback for every other path (.htaccess also redirects the
// subdomain's root to it).
const HOST_ROUTES: Record<string, string[]> = {
  'vxo.iniac.se': ['vxo', 'vxo-register', 'vxo-ideas'],
};

const hostRoutes = (): string[] | undefined => HOST_ROUTES[window.location.hostname.toLowerCase()];

// Old addresses that should keep working.
const PATH_ALIASES: Record<string, string> = {
  '/future-innovators': 'future-innovators',
  '/home': 'future-innovators',
  '/challenges': 'challenges',
  '/lgr22': 'lgr22',
  '/vfi': 'future-innovators',
};

const normalizePath = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path) || '/';

const resolvePath = (path: string): string => {
  const p = normalizePath(path).toLowerCase();
  const match = Object.entries(ROUTE_PATHS).find(([, routePath]) => routePath === p);
  return match ? match[0] : PATH_ALIASES[p] || 'future-innovators';
};

export const routeFromPath = (path: string): string => {
  const route = resolvePath(path);
  const allowed = hostRoutes();
  return allowed && !allowed.includes(route) ? allowed[0] : route;
};

export const pathForRoute = (route: string): string => ROUTE_PATHS[route] || '/';

/** True for links that leave the app (other sites, email, phone). */
export const isExternalHref = (href: string): boolean => /^(https?:|mailto:|tel:)/i.test(href);

/**
 * Turns an in-site link such as "/register?tab=association" or "/ibk#join" into the
 * `route#section` target and register tab that the app navigator understands.
 */
export const hrefToTarget = (href: string): { target: string; tab: string | null } => {
  const url = new URL(href, window.location.origin);
  const route = routeFromPath(url.pathname);
  const section = url.hash.replace(/^#/, '');
  return { target: section ? `${route}#${section}` : route, tab: url.searchParams.get('tab') };
};

/**
 * Resolves the starting route from the current URL, including legacy `?route=` links
 * (QR codes and shared links) and the `?idea=` campaign links.
 */
export const initialRouteFromLocation = (): { route: string; tab: string | null } => {
  const params = new URLSearchParams(window.location.search);
  const allowed = hostRoutes();
  if (allowed) {
    // Campaign links (?idea=) open the event's own voting page.
    const ideasRoute = `${allowed[0]}-ideas`;
    if (params.get('idea') && allowed.includes(ideasRoute)) return { route: ideasRoute, tab: null };
    return { route: routeFromPath(window.location.pathname), tab: params.get('tab') };
  }

  const legacy = params.get('route');
  const tab = params.get('tab');

  if (legacy === 'volunteer') return { route: 'register', tab: 'volunteer' };
  if (legacy === 'association') return { route: 'register', tab: 'association' };
  if (legacy && ROUTE_PATHS[legacy]) return { route: legacy, tab };
  if (legacy === 'home') return { route: 'future-innovators', tab: null };
  if (params.get('idea')) return { route: 'ideas', tab: null };

  return { route: routeFromPath(window.location.pathname), tab };
};
