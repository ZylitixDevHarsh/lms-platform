import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import { CoursesView } from '@/components/courses/courses-view';
import { CATEGORY_LIST_QUERY, COURSE_LIST_QUERY } from '@/lib/sanity/queries';
import { PortableTextBlock } from 'next-sanity';
import { CATEGORIES, Category, Course, DIFFICULTIES, Difficulty, Lesson, SanityContentItem } from '@/types';
import { mapLessonContent } from '@/lib/mappers/lesson-content';

// Re-fetch from Sanity at most once a minute.
const REVALIDATE = { next: { revalidate: 60 } };

type SanityLesson = {
  _id: string;
  title: string;
  slug: string;
  type: 'video' | 'article';
  durationMinutes?: number;
  content?: SanityContentItem[];
  videoUrl?: string;
} | null;

type SanityModule = {
  title: string;
  lessons?: SanityLesson[];
};

type SanityCourse = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  longDescription?: PortableTextBlock[];
  image?: Parameters<typeof urlFor>[0];
  level?: string;
  instructorName?: string;
  instructorTitle?: string;
  instructorAvatar?: Parameters<typeof urlFor>[0];
  category?: {
    title: string;
    slug: string;
  };
  duration?: string;
  objectives?: string[];
  featured?: boolean;
  modules?: SanityModule[];
  lessonTitles?: (string | null)[];
  moduleTitles?: (string | null)[];
};

function isCategory(value: string | undefined): value is Category {
  return CATEGORIES.some((category) => category === value);
}

function isDifficulty(value: string | undefined): value is Difficulty {
  return DIFFICULTIES.some((difficulty) => difficulty === value);
}

export default async function CoursesPage() {
  const [raw, categories] = await Promise.all([
    client.fetch<SanityCourse[]>(COURSE_LIST_QUERY, {}, REVALIDATE),
    client.fetch<{ title: string }[]>(CATEGORY_LIST_QUERY, {}, REVALIDATE),
  ]);

  // Map Sanity documents to the shape your UI already uses.
  // Rename keys here if your `Course` type differs.
  const courses: Course[] = raw.map((c) => ({
    id: c._id,
    slug: c.slug,
    title: c.title,
    description: c.shortDescription ?? '',

    longDescription: c.longDescription,

    category: isCategory(c.category?.title)
      ? c.category?.title
      : undefined,

    difficulty: isDifficulty(c.level) ? c.level : 'Beginner',

    thumbnail: c.image
      ? urlFor(c.image).width(800).height(450).url()
      : '',

    instructor: {
      name: c.instructorName ?? 'Unknown instructor',
      title: c.instructorTitle,
      avatar: c.instructorAvatar
        ? urlFor(c.instructorAvatar).width(96).height(96).url()
        : '',
    },

    duration: c.duration,
    objectives: c.objectives,
    featured: c.featured,
    lessonTitles: (c.lessonTitles ?? []).filter(
      (title): title is string => Boolean(title),
    ),
    moduleTitles: (c.moduleTitles ?? []).filter(
      (title): title is string => Boolean(title),
    ),

    modules: (c.modules ?? []).map((m) => ({
      title: m.title,

      lessons: (m.lessons ?? [])
        .filter((l): l is NonNullable<typeof l> => l !== null)
        .map(
          (l): Lesson => ({
            id: l._id,
            slug: l.slug,
            title: l.title,
            type: l.type,
            durationMinutes: l.durationMinutes,
            content: mapLessonContent(l.content),
          }),
        ),
    })),

    lessons: (c.modules ?? []).flatMap((m) =>
      (m.lessons ?? [])
        .filter((l): l is NonNullable<typeof l> => l !== null)
        .map(
          (l): Lesson => ({
            id: l._id,
            slug: l.slug,
            title: l.title,
            type: l.type,
            durationMinutes: l.durationMinutes,
            content: mapLessonContent(l.content),
          }),
        ),
    ),
  }));
  console.log('-------', courses.length);

  return (
    <CoursesView
      courses={courses}
      categories={categories.map((c) => c.title)}
    />
  );
}
