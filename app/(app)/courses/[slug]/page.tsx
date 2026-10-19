import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
import { sampleCourses, getCourseBySlug } from '@/data/sample-courses';

export function generateStaticParams() {
  return sampleCourses.map((c) => ({ slug: c.slug }));
}

export default function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const course = getCourseBySlug(params.slug);
  if (!course) notFound();

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
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <CategoryBadge category={course.category} />
                <DifficultyBadge difficulty={course.difficulty} />
              </div>
              <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                {course.title}
              </h1>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                {course.longDescription}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  {course.lessons.length} lessons
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {course.instructor.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {course.instructor.title}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <EnrollButton course={course} />
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Body: objectives + lessons */}
      <PageContainer className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-10">
          {/* Objectives */}
          <div className="space-y-6">
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
                  {course.objectives.map((obj, i) => (
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

            <Link
              href="/courses"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to all courses
            </Link>
          </div>

          {/* Lessons */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h2 className="font-display text-base font-semibold text-foreground">
                  Course lessons
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">
                {course.lessons.length} lessons · {course.duration}
              </span>
            </div>
            <div className="space-y-1 rounded-lg border border-border bg-card p-2">
              {course.lessons.map((lesson, i) => (
                <LessonListItem
                  key={lesson.id}
                  href={`/learn/${course.slug}/${lesson.slug}`}
                  title={lesson.title}
                  duration={lesson.duration}
                  index={i + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
