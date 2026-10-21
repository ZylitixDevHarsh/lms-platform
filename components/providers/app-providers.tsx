'use client';

import type { ReactNode } from 'react';

import { LearningProvider } from '@/components/providers/learning-provider';
import type { InitialLearningState } from '@/lib/learning/types';
import { Toaster } from '@/components/ui/toaster';

export function AppProviders({
  children,
  initial,
}: {
  children: ReactNode;
  initial: InitialLearningState;
}) {
  return (
    <LearningProvider initial={initial}>
      {children}
      <Toaster />
    </LearningProvider>
  );
}
