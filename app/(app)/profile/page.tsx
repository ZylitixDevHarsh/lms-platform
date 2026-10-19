'use client';

import Link from 'next/link';
import {
  Mail,
  Briefcase,
  LogOut,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { UserAvatar } from '@/components/common/user-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLearning } from '@/components/providers/learning-provider';

export default function ProfilePage() {
  const {
    user,
    signOut,
    enrolledCourses,
    completedCoursesCount,
    totalLessonsCompleted,
  } = useLearning();

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

      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Development preview</p>
              <p className="mt-1">
                You are viewing sample account data. When Auth0 is connected,
                this page will display your authenticated profile and learning
                records.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
          <LogOut className="mr-2 h-4 w-4" onClick={signOut} />
          Sign out
        </Button>
      </div>
    </PageContainer>
  );
}
