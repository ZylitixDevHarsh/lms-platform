'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, LayoutDashboard } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { ProgressBar } from '@/components/courses/progress-bar';
import { LessonContent } from '@/components/learning/lesson-content';
import {
  LessonSidebar,
  LessonNavButtons,
} from '@/components/learning/lesson-sidebar';
import { MarkCompleteToggle } from '@/components/courses/enroll-button';
import { useLearning } from '@/components/providers/learning-provider';
import { getCourseBySlug, sampleCourses } from '@/data/sample-courses';

export function generateStaticParams() {
  const params: { courseSlug: string; lessonSlug: string }[] = [];
  for (const course of sampleCourses) {
    for (const lesson of course.lessons) {
      params.push({ courseSlug: course.slug, lessonSlug: lesson.slug });
    }
  }
  return params;
}

export default function LessonPage({
  params,
}: {
  params: { courseSlug: string; lessonSlug: string };
}) {
  const course = getCourseBySlug(params.courseSlug);
  if (!course) notFound();
  const lessonIndex = course.lessons.findIndex(
    (l) => l.slug === params.lessonSlug
  );
  if (lessonIndex < 0) notFound();
  const lesson = course.lessons[lessonIndex];

  const { isLessonComplete, getProgress } = useLearning();
  const complete = isLessonComplete(course.id, lesson.id);
  const progress = getProgress(course.id);
  const nextLesson =
    lessonIndex < course.lessons.length - 1
      ? course.lessons[lessonIndex + 1]
      : null;
  const nextHref = nextLesson
    ? `/learn/${course.slug}/${nextLesson.slug}`
    : null;

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
        <LessonSidebar
          course={course}
          currentLessonSlug={lesson.slug}
        />

        <article className="min-w-0">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Lesson {lessonIndex + 1} of {course.lessons.length}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {lesson.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{lesson.summary}</p>

            <div className="mt-4 flex items-center gap-3">
              <ProgressBar value={progress.percent} className="max-w-xs" />
              <span className="text-xs font-medium text-muted-foreground">
                {progress.percent}% complete
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 sm:p-7">
            <LessonContent blocks={lesson.content} />
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <LessonNavButtons
              course={course}
              currentLessonSlug={lesson.slug}
            />
            <MarkCompleteToggle
              courseId={course.id}
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              isLast={lessonIndex === course.lessons.length - 1}
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
