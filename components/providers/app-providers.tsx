'use client';

import type { ReactNode } from 'react';

import { LearningProvider, type InitialLearningState } from '@/components/providers/learning-provider';
import { Toaster } from '@/components/ui/toaster';
import { previewUser } from '@/data/sample-courses';
import type { AuthProfile } from '@/lib/get-profile';

export function AppProviders({
  children,
  profile,
}: {
  children: ReactNode;
  profile: AuthProfile | null;
}) {
  const initial: InitialLearningState = {
    isAuthenticated: profile !== null,
    user: profile
      ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        initials: profile.initials,
      }
      : previewUser,
    enrolledCourseIds: [],
    enrollments: [],
    completedByCourse: {},
    lessonTotals: {},
  };

  return (
    <LearningProvider initial={initial}>
      {children}
      <Toaster />
    </LearningProvider>
  );
}
