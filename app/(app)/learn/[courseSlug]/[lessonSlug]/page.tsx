import { cache } from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ChevronRight,
  FileText,
  LayoutDashboard,
  PlayCircle,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { LessonContent } from '@/components/learning/lesson-content';
import {
  LessonSidebar,
  LessonNavButtons,
} from '@/components/learning/lesson-sidebar';
import { MarkCompleteToggle } from '@/components/courses/enroll-button';
import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import { LESSON_PAGE_QUERY, LESSON_PARAMS_QUERY } from '@/lib/sanity/lesson-query';
import {
  CATEGORIES,
  type Category,
  type Course,
  type Lesson,
  type SanityContentItem,
} from '@/types';
import { mapLessonContent } from '@/lib/mappers/lesson-content';
import { LessonProgress } from '@/components/learning/lesson-progres';
import { HydrateCourse } from '@/components/learning/hydrate-course';
import { auth0 } from '@/lib/auth0';
import { isEnrolled, touchLastLesson } from '@/lib/db/progress';

// Re-fetch from Sanity at most once a minute.
const REVALIDATE = { next: { revalidate: 60 } };

const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

type SanityLesson = {
  _id: string;
  title: string;
  slug: string;
  type: 'video' | 'article';
  durationMinutes?: number;
  videoUrl?: string | null; // only present for the current lesson
  content?: SanityContentItem[] | null; // only present for the current lesson
} | null;

type SanityLessonPageCourse = {
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
  category?: string | null;
  modules?: { title: string; lessons?: SanityLesson[] }[];
};

function isCategory(value: string | null | undefined): value is Category {
  return CATEGORIES.some((category) => category === value);
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
        content: mapLessonContent(l.content ?? undefined),
      }),
    );
}

type VideoSource =
  | { kind: 'embed'; src: string }
  | { kind: 'file'; src: string }
  | { kind: 'link'; src: string };

// Classifies a video URL: YouTube/Vimeo -> iframe embed, direct file -> <video>,
// anything else -> plain link (so an unknown host never breaks the page).
function getVideoSource(url: string): VideoSource {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const parts = u.pathname.split('/').filter(Boolean);
      const id =
        u.searchParams.get('v') ??
        (['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : null);
      if (id) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1);
      if (id) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean).find((p) => /^\d+$/.test(p));
      if (id) return { kind: 'embed', src: `https://player.vimeo.com/video/${id}` };
    }
    if (/\.(mp4|webm|ogg|mov)$/i.test(u.pathname)) {
      return { kind: 'file', src: url };
    }
  } catch {
    // invalid URL: fall through to link
  }
  return { kind: 'link', src: url };
}

// cache() so generateMetadata and the page share a single fetch per request.
const getLessonPageData = cache(
  async (courseSlug: string, lessonSlug: string) => {
    const c = await client.fetch<SanityLessonPageCourse | null>(
      LESSON_PAGE_QUERY,
      { courseSlug, lessonSlug },
      REVALIDATE,
    );
    if (!c) return null;

    const modules = (c.modules ?? []).map((m) => ({
      title: m.title,
      lessons: mapLessons(m.lessons),
    }));
    const lessons = modules.flatMap((m) => m.lessons);

    const course: Course = {
      id: c._id,
      slug: c.slug,
      title: c.title,
      description: c.shortDescription ?? '',
      category: isCategory(c.category) ? c.category : undefined,
      difficulty: LEVEL_LABELS[c.level ?? 'beginner'] ?? LEVEL_LABELS.beginner,
      thumbnail: c.image ? urlFor(c.image).width(800).height(450).url() : '',
      instructor: {
        name: c.instructorName ?? 'Unknown instructor',
        title: c.instructorTitle ?? undefined,
        avatar: c.instructorAvatar
          ? urlFor(c.instructorAvatar).width(96).height(96).url()
          : '',
      },
      featured: c.featured,
      modules,
      lessons,
    };

    // Raw data for the current lesson (the mapped Lesson type may not carry these).
    const rawLessons = (c.modules ?? []).flatMap((m) => m.lessons ?? []);
    const current = rawLessons.find((l) => l?.slug === lessonSlug);
    const videoUrl = current?.videoUrl ?? null;
    const hasContent = (current?.content?.length ?? 0) > 0;

    return { course, videoUrl, hasContent };
  },
);

export async function generateStaticParams() {
  const rows = await client.fetch<
    { courseSlug: string; lessonSlugs?: (string | null)[] | null }[]
  >(LESSON_PARAMS_QUERY);

  return rows.flatMap((row) =>
    (row.lessonSlugs ?? [])
      .filter((s): s is string => Boolean(s))
      .map((lessonSlug) => ({ courseSlug: row.courseSlug, lessonSlug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const data = await getLessonPageData(courseSlug, lessonSlug);
  const lesson = data?.course.lessons?.find((l) => l.slug === lessonSlug);
  if (!data || !lesson) return {};
  return { title: `${lesson.title} · ${data.course.title}` };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;

  const data = await getLessonPageData(courseSlug, lessonSlug);
  if (!data) notFound();

  const { course, videoUrl, hasContent } = data;
  const lessons = course.lessons ?? [];

  const lessonIndex = lessons.findIndex((l) => l.slug === lessonSlug);
  if (lessonIndex < 0) notFound();

  const lesson = lessons[lessonIndex];
  const nextLesson = lessons[lessonIndex + 1] ?? null;
  const nextHref = nextLesson ? `/learn/${course.slug}/${nextLesson.slug}` : null;

  const session = await auth0.getSession();
  if (!session?.user?.sub) {
    redirect(`/auth/login?returnTo=/learn/${courseSlug}/${lessonSlug}`);
  }
  if (!(await isEnrolled(session.user.sub, course.id))) {
    redirect(`/courses/${course.slug}`);
  }
  await touchLastLesson(session.user.sub, course.id, lesson.id);

  const isVideo = lesson.type === 'video';
  const videoSource = isVideo && videoUrl ? getVideoSource(videoUrl) : null;

  return (
    <PageContainer className="py-4 sm:py-8" size="wide">
      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/courses/${course.slug}`}
          className="max-w-[180px] truncate hover:text-foreground sm:max-w-none"
        >
          {course.title}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{lesson.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        <LessonSidebar course={course} currentLessonSlug={lesson.slug} />

        <article className="min-w-0">
          <HydrateCourse course={course} />
          <div className="mb-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              {isVideo ? (
                <PlayCircle className="h-3.5 w-3.5" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              {isVideo ? 'Video' : 'Article'} · Lesson {lessonIndex + 1} of{' '}
              {lessons.length}
              {lesson.durationMinutes ? ` · ${lesson.durationMinutes} min` : ''}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {lesson.title}
            </h1>

            <LessonProgress courseId={course.id} />
          </div>

          {/* Video lessons: player first, written notes (if any) below */}
          {isVideo && (
            <div className="mb-6 overflow-hidden rounded-lg border border-border bg-muted">
              {videoSource?.kind === 'embed' && (
                <div className="relative aspect-video w-full">
                  <iframe
                    src={videoSource.src}
                    title={lesson.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {videoSource?.kind === 'file' && (
                <video
                  src={videoSource.src}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full bg-black"
                />
              )}

              {videoSource?.kind === 'link' && (
                <p className="p-4 text-sm">
                  This video can&apos;t be embedded.{' '}
                  <a
                    href={videoSource.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    Watch it in a new tab
                  </a>
                </p>
              )}

              {!videoSource && (
                <p className="p-4 text-sm text-muted-foreground">
                  The video for this lesson isn&apos;t available yet.
                </p>
              )}
            </div>
          )}

          {/* Written content: always for articles; for videos only if notes exist */}
          {hasContent ? (
            <div className="rounded-lg border border-border bg-card p-5 sm:p-7">
              <LessonContent blocks={lesson.content} />
            </div>
          ) : (
            !isVideo && (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                This article has no content yet.
              </p>
            )
          )}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <LessonNavButtons course={course} currentLessonSlug={lesson.slug} />
            <MarkCompleteToggle
              courseId={course.id}
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              isLast={lessonIndex === lessons.length - 1}
              nextHref={nextHref}
            />
          </div>

          <div className="mt-8 border-t border-border pt-5">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <LayoutDashboard className="mr-1.5 h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        </article>
      </div>
    </PageContainer>
  );
}
