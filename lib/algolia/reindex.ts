import 'server-only';
import { algoliasearch } from 'algoliasearch';
import { ALGOLIA_APP_ID, ALGOLIA_INDEX_NAME } from '@/lib/algolia/config';
import { fetchCourseSearchRecords } from '@/lib/algolia/records';

export function isAlgoliaAdminConfigured(): boolean {
  return Boolean(ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_API_KEY);
}

export async function reindexCourses(): Promise<{ count: number }> {
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY;
  if (!ALGOLIA_APP_ID || !adminKey) {
    throw new Error('Algolia admin credentials are not set');
  }

  const records = await fetchCourseSearchRecords();
  const client = algoliasearch(ALGOLIA_APP_ID, adminKey);

  await client.setSettings({
    indexName: ALGOLIA_INDEX_NAME,
    indexSettings: {
      searchableAttributes: [
        'title',
        'lessonTitles',
        'keywords',
        'moduleTitles',
        'description',
        'category',
        'instructorName',
        'lessonText',
      ],
      attributesToRetrieve: [
        'objectID',
        'title',
        'slug',
        'description',
        'category',
        'lessonTitles',
      ],
    },
  });

  await client.replaceAllObjects({
    indexName: ALGOLIA_INDEX_NAME,
    objects: records,
    waitForTasks: true,
  });

  return { count: records.length };
}
