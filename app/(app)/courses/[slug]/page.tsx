import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PortableText, type PortableTextBlock } from 'next-sanity';
import {
  Clock,
  Layers,
  Target,
  ChevronRight,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CategoryBadge } from '@/components/courses/category-badge';
import { DifficultyBadge } from '@/components/courses/difficulty-badge';
import { LessonListItem } from '@/components/learning/lesson-list-item';
import { EnrollButton } from '@/components/courses/enroll-button';
import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import { COURSE_DETAIL_QUERY, COURSE_SLUGS_QUERY } from '@/lib/sanity/queries';
import {
  CATEGORIES,
  type Category,
  type Course,
  type Lesson,
  type SanityContentItem,
} from '@/types';
import { mapLessonContent } from '@/lib/mappers/lesson-content';

// Re-fetch from Sanity at most once a minute.
const REVALIDATE = { next: { revalidate: 60 } };

// Schema stores level as 'beginner' | 'intermediate' | 'advanced'.
const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

// Lesson shapes match the courses list page.
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

// Mirrors COURSE_DETAIL_QUERY exactly.
type SanityCourseDetail = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: PortableTextBlock[]; // full description (Portable Text)
  learningOutcomes?: string[];
  image?: Parameters<typeof urlFor>[0];
  level?: keyof typeof LEVEL_LABELS; // stored lowercase in the schema
  featured?: boolean;
  instructorName?: string;
  instructorTitle?: string | null;
  instructorAvatar?: Parameters<typeof urlFor>[0];
  category?: string | null; // query returns category->title (a string)
  lessonCount?: number;
  totalMinutes?: number | null;
  modules?: SanityModule[];
};

function isCategory(value: string | null | undefined): value is Category {
  return CATEGORIES.some((category) => category === value);
}

function formatMinutes(total?: number | null) {
  if (!total) return undefined;
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function mapLessons(lessons?: SanityLesson[]): Lesson[] {
  return (lessons ?? [])
    .filter((l): l is NonNullable<SanityLesson> => l !== null)
    .map(
      (l): Lesson => ({
        id: l._id,
        slug: l.slug,
        title: l.title,
        type: l.type,
        durationMinutes: l.durationMinutes,
        content: mapLessonContent(l.content),
      }),
    );
}

async function getCourse(slug: string): Promise<Course | null> {
  const c = await client.fetch<SanityCourseDetail | null>(
    COURSE_DETAIL_QUERY,
    { slug },
    REVALIDATE,
  );
  if (!c) return null;

  const modules = (c.modules ?? []).map((m) => ({
    title: m.title,
    lessons: mapLessons(m.lessons),
  }));

  return {
    id: c._id,
    slug: c.slug,
    title: c.title,
    description: c.shortDescription ?? '',
    longDescription: c.description,
    category: isCategory(c.category) ? c.category : undefined,
    difficulty: LEVEL_LABELS[c.level ?? 'beginner'] ?? LEVEL_LABELS.beginner,
    thumbnail: c.image ? urlFor(c.image).width(1200).height(675).url() : '',
    instructor: {
      name: c.instructorName ?? 'Unknown instructor',
      title: c.instructorTitle ?? undefined,
      avatar: c.instructorAvatar
        ? urlFor(c.instructorAvatar).width(96).height(96).url()
        : '',
    },
    duration: formatMinutes(c.totalMinutes),
    objectives: c.learningOutcomes ?? [],
    featured: c.featured,
    modules,
    // Flat list, same as the list page builds it.
    lessons: modules.flatMap((m) => m.lessons),
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(COURSE_SLUGS_QUERY);
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const courseModules = course.modules ?? [];

  const lessonCount = courseModules.reduce(
    (n, m) => n + (m.lessons?.length ?? 0),
    0,
  );

  // Running lesson number across modules (module 2 continues from module 1).
  // Named `courseModules` / `courseModule` because `module` is reserved by
  // Next's ESLint rule (@next/next/no-assign-module-variable).
  const modulesWithOffset = courseModules.map((m, i) => ({
    ...m,
    startIndex: courseModules
      .slice(0, i)
      .reduce((n, prev) => n + (prev.lessons?.length ?? 0), 0),
  }));

  return (
    <div>
      {/* Hero with thumbnail */}
      <div className="relative border-b border-border bg-secondary/30">
        <PageContainer className="py-6 sm:py-10">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/courses" className="hover:text-foreground">
              Courses
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{course.title}</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
              {course.thumbnail && (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              )}
            </div>

            <div className="flex flex-col">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {course.category && <CategoryBadge category={course.category} />}
                <DifficultyBadge difficulty={course.difficulty} />
              </div>
              <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                {course.title}
              </h1>
              {course.description && (
                <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                  {course.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                {course.duration && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  {course.instructor.avatar ? (
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                      {course.instructor.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {course.instructor.name}
                  </p>
                  {course.instructor.title && (
                    <p className="truncate text-xs text-muted-foreground">
                      {course.instructor.title}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                {/* Enroll with course.id (the Sanity _id) in PostgreSQL */}
                <EnrollButton course={course} />
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Body: about + objectives + lessons */}
      <PageContainer className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-10">
          <div className="space-y-6">
            {course.longDescription && course.longDescription.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <h2 className="font-display text-base font-semibold text-foreground">
                    About this course
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-foreground/90 [&_h2]:mt-4 [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-semibold [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
                    <PortableText value={course.longDescription} />
                  </div>
                </CardContent>
              </Card>
            )}

            {(course.objectives?.length ?? 0) > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-base font-semibold text-foreground">
                      Learning objectives
                    </h2>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {course.objectives?.map((obj, i) => (
                      <li key={i} className="flex gap-2.5 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
                          {i + 1}
                        </span>
                        <span className="text-foreground/90">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Link
              href="/courses"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to all courses
            </Link>
          </div>

          {/* Lessons, grouped by module */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h2 className="font-display text-base font-semibold text-foreground">
                  Course lessons
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                {course.duration && ` · ${course.duration}`}
              </span>
            </div>

            {lessonCount === 0 ? (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Lessons for this course are coming soon.
              </p>
            ) : (
              <div className="space-y-4">
                {modulesWithOffset.map((courseModule, moduleIndex) => (
                  <div
                    key={`${courseModule.title}-${moduleIndex}`}
                    className="rounded-lg border border-border bg-card p-2"
                  >
                    <p className="px-2 pb-1 pt-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {courseModule.title}
                    </p>
                    <div className="space-y-1">
                      {courseModule.lessons?.map((lesson, i) => (
                        <LessonListItem
                          key={lesson.id}
                          href={`/learn/${course.slug}/${lesson.slug}`}
                          title={lesson.title}
                          duration={
                            lesson.durationMinutes
                              ? `${lesson.durationMinutes} min`
                              : undefined
                          }
                          index={courseModule.startIndex + i + 1}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
