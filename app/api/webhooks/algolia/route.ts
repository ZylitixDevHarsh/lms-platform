import { NextResponse } from 'next/server';
import { reindexCourses } from '@/lib/algolia/reindex';

function isAuthorized(request: Request): boolean {
  const secret = process.env.ALGOLIA_WEBHOOK_SECRET;
  if (!secret) return false;

  const header =
    request.headers.get('authorization') ??
    request.headers.get('x-algolia-webhook-secret');
  const bearer = header?.startsWith('Bearer ') ? header.slice(7) : header;
  const query = new URL(request.url).searchParams.get('secret');

  return bearer === secret || query === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await reindexCourses();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error('Algolia reindex failed:', error);
    return NextResponse.json(
      { error: 'Failed to reindex courses' },
      { status: 500 },
    );
  }
}
