import 'server-only';
import { Pool } from 'pg';

// In dev, Next.js re-evaluates modules on every change. Keeping the pool on
// globalThis stops it from opening a new set of connections each time.
const globalForPg = globalThis as unknown as { pgPool?: Pool };

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

export const pool =
  globalForPg.pgPool ??
  new Pool({
    // Hosted databases (Neon, Supabase, RDS...) usually need ?sslmode=require
    // at the end of this URL.
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}
