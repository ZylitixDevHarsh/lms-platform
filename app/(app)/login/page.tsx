import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, GraduationCap, ShieldCheck, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/page-container';
import { auth0 } from '@/lib/auth0';

const trustPoints = [
  { icon: ShieldCheck, label: 'Single sign-on via Auth0' },
  { icon: BookOpen, label: 'Progress synced across devices' },
  { icon: GraduationCap, label: 'Access to all enrolled courses' },
];

// Only allow same-site relative paths to prevent open-redirect attacks.
function getSafeReturnTo(value?: string) {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value;
  return '/dashboard';
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo: rawReturnTo } = await searchParams;
  const returnTo = getSafeReturnTo(rawReturnTo);

  // Already signed in? Skip the login screen.
  const session = await auth0.getSession();
  if (session) redirect(returnTo);

  const loginHref = `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  const signupHref = `${loginHref}&screen_hint=signup`;

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-secondary/30 px-4 py-10">
      <PageContainer size="narrow" className="!max-w-md">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Welcome to CMHA Learning
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to track your progress, enroll in courses, and continue
              where you left off.
            </p>
          </div>

          <div className="space-y-3">
            {/* Plain <a>, not next/link: /auth/login is handled by the Auth0
                middleware and must be a full page navigation, not a client
                transition or prefetch. */}
            <Button size="lg" className="w-full" asChild>
              <a href={loginHref}>
                Continue with Auth0
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              New here?{' '}
              <a
                href={signupHref}
                className="font-medium text-foreground hover:underline"
              >
                Create an account
              </a>
            </p>
          </div>

          <div className="mt-6 space-y-2 border-t border-border pt-5">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.label}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {point.label}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/courses"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Browse courses without signing in
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
