export const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '';
export const ALGOLIA_SEARCH_API_KEY =
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? '';
export const ALGOLIA_INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? 'lms_courses';

export function isAlgoliaSearchConfigured(): boolean {
  return Boolean(ALGOLIA_APP_ID && ALGOLIA_SEARCH_API_KEY);
}
