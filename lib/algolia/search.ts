import { algoliasearch } from 'algoliasearch';
import {
  ALGOLIA_APP_ID,
  ALGOLIA_INDEX_NAME,
  ALGOLIA_SEARCH_API_KEY,
  isAlgoliaSearchConfigured,
} from '@/lib/algolia/config';

export type CourseSearchHit = {
  objectID: string;
  title?: string;
  slug?: string;
  matchedLessonTitles?: string[];
};

export async function searchCourses(
  query: string,
): Promise<CourseSearchHit[] | null> {
  const q = query.trim();
  if (!q) return null;
  if (!isAlgoliaSearchConfigured()) return null;

  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);
  const { hits } = await client.searchSingleIndex<CourseSearchHit>({
    indexName: ALGOLIA_INDEX_NAME,
    searchParams: {
      query: q,
      hitsPerPage: 50,
      attributesToRetrieve: ['objectID', 'title', 'slug', 'lessonTitles'],
      attributesToHighlight: [],
    },
  });

  return hits.map((hit) => ({
    objectID: hit.objectID,
    title: hit.title,
    slug: hit.slug,
    matchedLessonTitles: Array.isArray(
      (hit as CourseSearchHit & { lessonTitles?: string[] }).lessonTitles,
    )
      ? (hit as CourseSearchHit & { lessonTitles?: string[] }).lessonTitles
      : undefined,
  }));
}
