import { urlFor } from '@/lib/sanity/image';
import { mapLessonContent } from '@/lib/mappers/lesson-content';
import {
  CATEGORIES,
  type Category,
  type Course,
  type Lesson,
  type SanityContentItem,
} from '@/types';

export const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

export type SanityLessonRef = {
  _id: string;
  title: string;
  slug: string;
  type: 'video' | 'article';
  durationMinutes?: number;
  content?: SanityContentItem[] | null;
} | null;

export type SanityCourseCard = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  image?: Parameters<typeof urlFor>[0];
  level?: keyof typeof LEVEL_LABELS;
  featured?: boolean;
  instructorName?: string;
  instructorTitle?: string | null;
  instructorAvatar?: Parameters<typeof urlFor>[0];
  category?: string | { title: string } | null;
  totalMinutes?: number | null;
  modules?: { title: string; lessons?: SanityLessonRef[] }[];
};

function isCategory(value: string | null | undefined): value is Category {
  return CATEGORIES.some((category) => category === value);
}

function categoryTitle(
  category: SanityCourseCard['category'],
): string | undefined {
  if (!category) return undefined;
  if (typeof category === 'string') return category;
  return category.title;
}

export function formatMinutes(total?: number | null) {
  if (!total) return undefined;
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function mapLessons(lessons?: SanityLessonRef[]): Lesson[] {
  return (lessons ?? [])
    .filter((l): l is NonNullable<SanityLessonRef> => l !== null)
    .map(
      (l): Lesson => ({
        id: l._id,
        slug: l.slug,
        title: l.title,
        type: l.type,
        durationMinutes: l.durationMinutes,
        content: mapLessonContent(l.content ?? undefined),
      }),
    );
}

export function mapSanityCourse(c: SanityCourseCard): Course {
  const modules = (c.modules ?? []).map((m) => ({
    title: m.title,
    lessons: mapLessons(m.lessons),
  }));
  const category = categoryTitle(c.category);

  return {
    id: c._id,
    slug: c.slug,
    title: c.title,
    description: c.shortDescription ?? '',
    category: isCategory(category) ? category : undefined,
    difficulty: LEVEL_LABELS[c.level ?? 'beginner'] ?? LEVEL_LABELS.beginner,
    thumbnail: c.image ? urlFor(c.image).width(800).height(450).url() : '',
    instructor: {
      name: c.instructorName ?? 'Unknown instructor',
      title: c.instructorTitle ?? undefined,
      avatar: c.instructorAvatar
        ? urlFor(c.instructorAvatar).width(96).height(96).url()
        : '',
    },
    duration: formatMinutes(c.totalMinutes),
    featured: c.featured,
    modules,
    lessons: modules.flatMap((m) => m.lessons ?? []),
  };
}
