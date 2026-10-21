import { NextResponse } from 'next/server';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { upsertUser } from '@/lib/db/progress';

// Reads its config from environment variables:
//   AUTH0_DOMAIN         e.g. your-tenant.us.auth0.com   (no https://)
//   AUTH0_CLIENT_ID
//   AUTH0_CLIENT_SECRET
//   AUTH0_SECRET         random 32-byte hex: `openssl rand -hex 32`
//   APP_BASE_URL         e.g. http://localhost:3000
export const auth0 = new Auth0Client({
  // Runs once, right after Auth0 sends the user back to /auth/callback.
  // You MUST return a response: the SDK no longer redirects for you here.
  httpTimeout: 15000,
  async onCallback(error, context, session) {
    if (error) {
      console.error('Auth0 callback error:', error);
      return new NextResponse('Login failed. Please go to /auth/login and try again.', {
        status: 500,
      });
    }

    if (session) {
      try {
        const { sub, email, name, picture } = session.user;
        await upsertUser({ sub, email, name, picture });
      } catch (e) {
        // Never block a successful login because the DB hiccuped.
        // The server actions upsert the user again as a safety net.
        console.error('upsertUser failed during login:', e);
      }
    }

    return NextResponse.redirect(
      new URL(context.returnTo || '/', process.env.APP_BASE_URL),
    );
  },
});
