'use client';

import { LearningProvider } from '@/components/providers/learning-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProfile } from '@/lib/get-profile';

export function AppProviders({ children, profile }: { children: React.ReactNode, profile: AuthProfile | null }) {
  return (
    <LearningProvider initialUser={profile}>
      {children}
      <Toaster />
    </LearningProvider>
  );
}
