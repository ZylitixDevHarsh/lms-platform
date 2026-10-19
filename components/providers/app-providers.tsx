'use client';

import { LearningProvider } from '@/components/providers/learning-provider';
import { Toaster } from '@/components/ui/toaster';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LearningProvider>
      {children}
      <Toaster />
    </LearningProvider>
  );
}
