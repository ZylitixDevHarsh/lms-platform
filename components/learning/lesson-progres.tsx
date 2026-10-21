'use client';

import { ProgressBar } from '@/components/courses/progress-bar';
import { useLearning } from '@/components/providers/learning-provider';

// The lesson page is a server component (it fetches from Sanity), so anything
// that needs the `useLearning` hook has to live in a client component.
export function LessonProgress({ courseId }: { courseId: string }) {
  const { getProgress, isEnrolled } = useLearning();
  if (!isEnrolled(courseId)) return null;

  const progress = getProgress(courseId);

  return (
    <div className="mt-4 flex items-center gap-3">
      <ProgressBar value={progress.percent} className="max-w-xs" />
      <span className="text-xs font-medium text-muted-foreground">
        {progress.percent}% complete
      </span>
    </div>
  );
}
