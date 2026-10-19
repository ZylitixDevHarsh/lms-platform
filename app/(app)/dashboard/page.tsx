'use client';

import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { CourseCard } from '@/components/courses/course-card';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { useLearning } from '@/components/providers/learning-provider';

export default function DashboardPage() {
  const {
    user,
    enrolledCourses,
    completedCoursesCount,
    totalLessonsCompleted,
    getProgress,
  } = useLearning();

  const progressByCourse = enrolledCourses.reduce(
    (acc, c) => {
      acc[c.id] = getProgress(c.id);
      return acc;
    },
    {} as Record<string, { completed: number; total: number; percent: number }>
  );

  const inProgress = enrolledCourses
    .filter((c) => progressByCourse[c.id].percent < 100)
    .sort(
      (a, b) => progressByCourse[b.id].percent - progressByCourse[a.id].percent
    );
  const completed = enrolledCourses.filter(
    (c) => progressByCourse[c.id].percent === 100
  );

  return (
    <PageContainer className="py-6 sm:py-10">
      <PageHeader
        eyebrow={`Welcome back, ${user.name.split(' ')[0]}`}
        title="Continue where you left off."
        description="Your enrolled courses and progress live here. Pick up any lesson whenever you are ready."
      />

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Enrolled Courses"
          value={enrolledCourses.length}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          label="Completed Courses"
          value={completedCoursesCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <StatCard
          label="Lessons Completed"
          value={totalLessonsCompleted}
          icon={<Layers className="h-4 w-4" />}
        />
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<Sparkles className="h-6 w-6" />}
          title="No courses yet"
          description="You have not enrolled in any courses. Explore the catalogue to find your first one."
          action={
            <Button asChild>
              <Link href="/courses">
                Explore Courses
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-8 space-y-8">
          {inProgress.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-foreground">
                In progress
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {inProgress.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progressByCourse[course.id]}
                  />
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-lg font-semibold tracking-tight text-foreground">
                Completed
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {completed.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progressByCourse[course.id]}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageContainer>
  );
}
