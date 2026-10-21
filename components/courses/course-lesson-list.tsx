'use client';

import { BookOpen } from 'lucide-react';
import { LessonListItem } from '@/components/learning/lesson-list-item';
import { useLearning } from '@/components/providers/learning-provider';
import type { Course } from '@/types';

export function CourseLessonList({ course }: { course: Course }) {
  const { isEnrolled, isLessonComplete } = useLearning();
  const enrolled = isEnrolled(course.id);
  const courseModules = course.modules ?? [];
  const lessonCount = courseModules.reduce(
    (n, m) => n + (m.lessons?.length ?? 0),
    0,
  );

  const modulesWithOffset = courseModules.map((m, i) => ({
    ...m,
    startIndex: courseModules
      .slice(0, i)
      .reduce((n, prev) => n + (prev.lessons?.length ?? 0), 0),
  }));

  return (
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
                    href={
                      enrolled
                        ? `/learn/${course.slug}/${lesson.slug}`
                        : `/courses/${course.slug}`
                    }
                    title={lesson.title}
                    duration={
                      lesson.durationMinutes
                        ? `${lesson.durationMinutes} min`
                        : undefined
                    }
                    index={courseModule.startIndex + i + 1}
                    status={
                      enrolled && isLessonComplete(course.id, lesson.id)
                        ? 'completed'
                        : 'not-started'
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
