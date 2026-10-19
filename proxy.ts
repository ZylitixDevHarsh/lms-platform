import { auth0 } from './lib/auth0';

export async function proxy(request: Request) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all requests except:
     * - Next.js static files
     * - Next.js image optimization
     * - favicon, sitemap, and robots files
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
