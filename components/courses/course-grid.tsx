import { cn } from '@/lib/utils';
import { CourseCard } from '@/components/courses/course-card';
import type { Course } from '@/types';

interface CourseGridProps {
  courses: Course[];
  progressByCourse?: Record<
    string,
    { completed: number; total: number; percent: number }
  >;
  className?: string;
  columns?: 1 | 2 | 3;
}

export function CourseGrid({
  courses,
  progressByCourse,
  className,
  columns,
}: CourseGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:gap-5',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        !columns && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          progress={progressByCourse?.[course.id]}
        />
      ))}
    </div>
  );
}
