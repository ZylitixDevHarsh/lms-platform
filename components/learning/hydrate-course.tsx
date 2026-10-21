'use client';

import { useEffect } from 'react';
import { useLearning } from '@/components/providers/learning-provider';
import type { Course } from '@/types';

export function HydrateCourse({ course }: { course: Course }) {
  const { registerCourse } = useLearning();

  useEffect(() => {
    registerCourse(course);
  }, [course, registerCourse]);

  return null;
}
