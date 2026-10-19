import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import { CoursesView } from '@/components/courses/courses-view';
import { CATEGORY_LIST_QUERY, COURSE_LIST_QUERY } from '@/lib/sanity/queries';

// Re-fetch from Sanity at most once a minute.
const REVALIDATE = { next: { revalidate: 60 } };

const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

type SanityCourse = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image?: Parameters<typeof urlFor>[0];
  level?: keyof typeof LEVEL_LABELS;
  instructorName?: string;
  instructorAvatar?: string;
  category?: { title: string; slug: string };
};

export default async function CoursesPage() {
  const startTime = Date.now();


  const [raw, categories] = await Promise.all([
    client.fetch<SanityCourse[]>(COURSE_LIST_QUERY, {}, REVALIDATE),
    client.fetch<{ title: string }[]>(CATEGORY_LIST_QUERY, {}, REVALIDATE),
  ]);

  // Map Sanity documents to the shape your UI already uses.
  // Rename keys here if your `Course` type differs.
  const courses = raw.map((c) => ({
    id: c._id,
    slug: c.slug,
    title: c.title,
    description: c.shortDescription,
    category: c.category?.title ?? 'Uncategorised',
    difficulty: LEVEL_LABELS[c.level ?? 'beginner'],
    instructor: {
      name: c.instructorName ?? 'Unknown instructor',
      avatar: c.instructorAvatar
        ? urlFor(c.instructorAvatar).width(96).height(96).url()
        : undefined,
      title: ''
    },
    thumbnail: c.image ? urlFor(c.image).width(800).height(450).url() : '',
  }));

  return (
    <CoursesView
      courses={courses}
      categories={categories.map((c) => c.title)}
    />
  );
}
