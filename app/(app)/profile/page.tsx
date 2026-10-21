'use client';

import Link from 'next/link';
import {
  Mail,
  Briefcase,
  LogOut,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CourseCard } from '@/components/courses/course-card';
import { EmptyState } from '@/components/common/empty-state';
import { useLearning } from '@/components/providers/learning-provider';

export default function ProfilePage() {
  const {
    user,
    signOut,
    enrolledCourses,
    completedCoursesCount,
    totalLessonsCompleted,
    getProgress,
  } = useLearning();

  const progressByCourse = Object.fromEntries(
    enrolledCourses.map((course) => [course.id, getProgress(course.id)]),
  );

  return (
    <PageContainer className="py-6 sm:py-10">
      <PageHeader eyebrow="Account" title="Your profile" />

      <Card className="mt-6 overflow-hidden">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <UserAvatar user={user} size="xl" />
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              {user.name}
            </h2>
            <p className="text-sm text-muted-foreground">{user.role}</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-5">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user.email}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                Learning & Development
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          label="Enrolled"
          value={enrolledCourses.length}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          label="Completed"
          value={completedCoursesCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <StatCard
          label="Lessons Done"
          value={totalLessonsCompleted}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              Enrolled courses
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Courses you have started, with your current progress.
            </p>
          </div>
          {enrolledCourses.length > 0 && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                View dashboard
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {enrolledCourses.length === 0 ? (
          <EmptyState
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={progressByCourse[course.id]}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </PageContainer>
  );
}
