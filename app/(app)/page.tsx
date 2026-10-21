import Link from 'next/link';
import { FEATURED_COURSE_LIST_QUERY } from '@/lib/sanity/queries';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/page-container';
import { CourseCard } from '@/components/courses/course-card';
import { sampleCourses } from '@/data/sample-courses';
import { CATEGORIES, Category, Course } from '@/types';
import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';

const benefits = [
  {
    icon: BookOpen,
    title: 'Curated learning paths',
    description:
      'Structured courses built by practitioners, designed for working professionals.',
  },
  {
    icon: TrendingUp,
    title: 'Track your progress',
    description:
      'See what you have completed and what to learn next, all in one dashboard.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance-ready',
    description:
      'Core workplace topics that keep your organization and your career protected.',
  },
];

const REVALIDATE = { next: { revalidate: 60 } };

const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

type SanityFeaturedCourse = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  image?: Parameters<typeof urlFor>[0];
  level?: keyof typeof LEVEL_LABELS;
  featured?: boolean;
  instructorName?: string;
  instructorAvatar?: Parameters<typeof urlFor>[0];
  category?: { title: string; slug: string } | null;
};

function isCategory(value: string | null | undefined): value is Category {
  return CATEGORIES.some((category) => category === value);
}

export async function getFeaturedCourses(limit = 3): Promise<Course[]> {
  const raw = await client.fetch<SanityFeaturedCourse[]>(
    FEATURED_COURSE_LIST_QUERY,
    {},
    REVALIDATE,
  );

  return raw.slice(0, limit).map(
    (c): Course => ({
      id: c._id,
      slug: c.slug,
      title: c.title,
      description: c.shortDescription ?? '',
      category: isCategory(c.category?.title) ? c.category?.title : undefined,
      difficulty: LEVEL_LABELS[c.level ?? 'beginner'] ?? LEVEL_LABELS.beginner,
      thumbnail: c.image ? urlFor(c.image).width(800).height(450).url() : '',
      instructor: {
        name: c.instructorName ?? 'Unknown instructor',
        avatar: c.instructorAvatar
          ? urlFor(c.instructorAvatar).width(96).height(96).url()
          : '',
      },
      featured: c.featured,
      modules: [],
      lessons: [],
    }),
  );
}

export default async function HomePage() {
  const featured = await getFeaturedCourses(3);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-primary-soft/40 to-background">
        <PageContainer className="py-10 sm:py-14 lg:py-16">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Professional development, made practical
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Learn. Grow. Advance.
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Discover learning opportunities, build new skills, and track your
              professional development in one place.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">
                  <GraduationCap className="mr-1.5 h-4 w-4" />
                  My Learning
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Featured courses */}
      {featured.length > 0 && (
        <section className="py-10 sm:py-14">
          <PageContainer>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Featured courses
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start with what others are learning right now.
                </p>
              </div>
              <Link
                href="/courses"
                className="hidden shrink-0 items-center text-sm font-medium text-primary hover:text-primary/80 sm:flex"
              >
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {featured.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="mt-6 flex justify-center sm:hidden">
              <Button asChild variant="outline">
                <Link href="/courses">
                  View all courses
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </PageContainer>
        </section>
      )}

      {/* Benefits */}
      <section className="border-y border-border bg-secondary/30 py-10 sm:py-14">
        <PageContainer>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Built for how professionals actually learn
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Short, focused lessons. Clear progress. Skills you can apply the
              same day.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-lg border border-border bg-card p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-14">
        <PageContainer>
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-gradient-to-br from-primary-soft/50 to-background p-6 text-center sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </span>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Ready to pick up where you left off?
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Your learning dashboard tracks every course you start and every
              lesson you complete.
            </p>
            <Button asChild size="lg">
              <Link href="/dashboard">
                Go to My Learning
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
