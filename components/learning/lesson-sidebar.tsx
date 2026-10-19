'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ListChecks, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LessonListItem } from '@/components/learning/lesson-list-item';
import { useLearning } from '@/components/providers/learning-provider';
import type { Course } from '@/types';

interface LessonSidebarProps {
  course: Course;
  currentLessonSlug: string;
}

export function LessonSidebar({
  course,
  currentLessonSlug,
}: LessonSidebarProps) {
  const { isLessonComplete } = useLearning();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentIndex = course.lessons.findIndex(
    (l) => l.slug === currentLessonSlug
  );

  const list = (
    <div className="space-y-1 p-2">
      {course.lessons.map((lesson, i) => {
        const complete = isLessonComplete(course.id, lesson.id);
        const isCurrent = lesson.slug === currentLessonSlug;
        return (
          <LessonListItem
            key={lesson.id}
            href={`/learn/${course.slug}/${lesson.slug}`}
            title={lesson.title}
            duration={lesson.duration}
            index={i + 1}
            status={
              isCurrent ? 'in-progress' : complete ? 'completed' : 'not-started'
            }
          />
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-lg border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Course contents
            </p>
            <Link
              href={`/courses/${course.slug}`}
              className="mt-1 block truncate text-sm font-medium text-foreground hover:text-primary"
            >
              {course.title}
            </Link>
          </div>
          {list}
        </div>
      </aside>

      {/* Mobile expandable */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
          aria-expanded={mobileOpen}
        >
          <span className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            Lesson {currentIndex + 1} of {course.lessons.length}
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              mobileOpen && 'rotate-180'
            )}
          />
        </button>
        {mobileOpen && (
          <div className="mt-2 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <Link
                href={`/courses/${course.slug}`}
                className="truncate text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {course.title}
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded p-1 text-muted-foreground hover:bg-accent"
                aria-label="Close lesson list"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {list}
          </div>
        )}
      </div>
    </>
  );
}

export function LessonNavButtons({
  course,
  currentLessonSlug,
}: LessonSidebarProps) {
  const currentIndex = course.lessons.findIndex(
    (l) => l.slug === currentLessonSlug
  );
  const prev = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const next =
    currentIndex < course.lessons.length - 1
      ? course.lessons[currentIndex + 1]
      : null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      {prev ? (
        <Button asChild variant="outline" size="sm">
          <Link href={`/learn/${course.slug}/${prev.slug}`}>
            Previous
          </Link>
        </Button>
      ) : (
        <span />
      )}
      {next ? (
        <Button asChild size="sm">
          <Link href={`/learn/${course.slug}/${next.slug}`}>
            Next Lesson
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href={`/courses/${course.slug}`}>Back to Course</Link>
        </Button>
      )}
    </div>
  );
}
