import type { Course, Enrollment, PreviewUser } from '@/types';

export type InitialLearningState = {
  isAuthenticated: boolean;
  user?: PreviewUser;
  enrolledCourseIds: string[];
  enrollments?: Enrollment[];
  enrolledCourses?: Course[];
  completedByCourse: Record<string, string[]>;
  lessonTotals: Record<string, number>;
  lastLessonByCourse?: Record<string, string>;
};

export type CourseProgress = {
  completed: number;
  total: number;
  percent: number;
};
