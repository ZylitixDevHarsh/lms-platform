import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { CategoryBadge } from '@/components/courses/category-badge';
import { DifficultyBadge } from '@/components/courses/difficulty-badge';
import { ProgressBar } from '@/components/courses/progress-bar';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  progress?: { completed: number; total: number; percent: number };
  className?: string;
}

export function CourseCard({ course, progress, className }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn('group block h-full', className)}
      aria-label={`View course: ${course.title}`}
    >
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-md">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <CategoryBadge
              category={course.category}
              variant="outline"
              className="bg-background/85 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center gap-2">
            <DifficultyBadge difficulty={course.difficulty} />
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
          </div>

          <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary">
            {course.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-muted">
              <Image
                src={course.instructor.avatar}
                alt={course.instructor.name}
                fill
                sizes="24px"
                className="object-cover"
              />
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {course.instructor.name}
            </span>
          </div>

          {progress && (
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  {progress.completed}/{progress.total} lessons
                </span>
                <span className="font-semibold tabular-nums text-primary">
                  {progress.percent}%
                </span>
              </div>
              <ProgressBar value={progress.percent} />
            </div>
          )}

          {!progress && (
            <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              View Course
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          )}

          {progress && (
            <div className="mt-4 flex items-center text-sm font-medium text-primary">
              Continue Learning
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
