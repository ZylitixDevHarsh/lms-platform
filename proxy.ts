import { NextResponse, type NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

// Pages anyone can open without logging in.
// Add '/' here if you want a public landing page.
const PUBLIC_PAGES: string[] = [];

// API routes that must work without a user session
// (e.g. Sanity revalidation webhook, payment webhooks).
const PUBLIC_API_PREFIXES = ['/api/revalidate', '/api/webhooks'];

function matches(pathname: string, routes: string[]) {
  return routes.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

// Next.js 16: file is proxy.ts and the export is `proxy`.
// On Next.js 14/15 name the file middleware.ts and export `middleware`.
export async function proxy(request: NextRequest) {
  // Let the Auth0 SDK mount /auth/login, /auth/logout, /auth/callback,
  // /auth/profile, etc. and refresh the session cookie.
  const authResponse = await auth0.middleware(request);

  const { pathname, search } = request.nextUrl;

  // Auth routes are fully handled by the SDK.
  if (pathname.startsWith('/auth')) {
    return authResponse;
  }

  // Always-open routes.
  if (matches(pathname, PUBLIC_PAGES) || matches(pathname, PUBLIC_API_PREFIXES)) {
    return authResponse;
  }

  // Everything else needs a session.
  const session = await auth0.getSession(request);

  if (!session) {
    // API callers get a 401, not an HTML redirect.
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const loginUrl = new URL('/auth/login', request.nextUrl.origin);
    loginUrl.searchParams.set('returnTo', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Return the SDK's response so rolling-session cookies are kept.
  return authResponse;
}

export const config = {
  // Run on every route except Next internals and static files.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?)$).*)',
  ],
};
