import 'server-only';
import { groq } from 'next-sanity';
import { client } from '@/lib/sanity/client';

export type CourseSearchRecord = {
  objectID: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  instructorName: string;
  level: string;
  keywords: string[];
  moduleTitles: string[];
  lessonTitles: string[];
  lessonText: string;
};

type SanityIndexCourse = {
  _id: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  descriptionText?: string;
  learningOutcomes?: string[];
  instructorName?: string;
  level?: string;
  category?: string | null;
  moduleTitles?: (string | null)[];
  lessons?: {
    title?: string | null;
    body?: string | null;
  }[] | null;
};

export const COURSE_SEARCH_INDEX_QUERY = groq`
  *[_type == "course" && defined(slug.current)]{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    "descriptionText": pt::text(description),
    learningOutcomes,
    instructorName,
    level,
    "category": category->title,
    "moduleTitles": modules[].title,
    "lessons": modules[].lessons[]->{
      title,
      "body": pt::text(content)
    }
  }
`;

function unique(values: (string | null | undefined)[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );
}

export function toCourseSearchRecord(course: SanityIndexCourse): CourseSearchRecord {
  const lessonTitles = unique((course.lessons ?? []).map((lesson) => lesson.title));
  const moduleTitles = unique(course.moduleTitles ?? []);
  const keywords = unique([
    course.category,
    course.level,
    course.instructorName,
    ...(course.learningOutcomes ?? []),
    ...moduleTitles,
    ...lessonTitles,
  ]);
  const lessonText = unique((course.lessons ?? []).map((lesson) => lesson.body))
    .join('\n')
    .slice(0, 8000);

  return {
    objectID: course._id,
    title: course.title ?? '',
    slug: course.slug ?? '',
    description: course.shortDescription ?? course.descriptionText ?? '',
    category: course.category ?? '',
    instructorName: course.instructorName ?? '',
    level: course.level ?? '',
    keywords,
    moduleTitles,
    lessonTitles,
    lessonText,
  };
}

export async function fetchCourseSearchRecords(): Promise<CourseSearchRecord[]> {
  const courses = await client.fetch<SanityIndexCourse[]>(
    COURSE_SEARCH_INDEX_QUERY,
  );
  return courses.map(toCourseSearchRecord);
}
