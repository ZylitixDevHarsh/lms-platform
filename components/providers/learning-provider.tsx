'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { sampleCourses, previewUser } from '@/data/sample-courses';
import type { Course, Enrollment, PreviewUser } from '@/types';
import type { AuthProfile } from '@/lib/get-profile';

interface LearningContextValue {
  user: PreviewUser;
  isAuthenticated: boolean;
  enrollments: Enrollment[];
  enrollmentsByCourse: Record<string, Enrollment>;
  enroll: (courseId: string) => void;
  unenroll: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  markLessonIncomplete: (courseId: string, lessonId: string) => void;
  isLessonComplete: (courseId: string, lessonId: string) => boolean;
  getProgress: (courseId: string) => {
    completed: number;
    total: number;
    percent: number;
  };
  enrolledCourses: Course[];
  completedCoursesCount: number;
  totalLessonsCompleted: number;
  signIn: () => void;
  signOut: () => void;
}

interface LearningProviderProps {
  children: ReactNode;
  initialUser: AuthProfile | null;
}

const defaultEnrollments: Enrollment[] = [
  {
    courseId: 'c4',
    enrolledAt: '2026-09-12',
    completedLessonIds: ['c4-l1'],
  },
  {
    courseId: 'c1',
    enrolledAt: '2026-10-02',
    completedLessonIds: ['c1-l1', 'c1-l2'],
  },
];

const LearningContext = createContext<LearningContextValue | undefined>(
  undefined
);

export function LearningProvider({
  children,
  initialUser,
}: LearningProviderProps) {
  // Use the Auth0 profile when authenticated; otherwise, use demo data.
  const user: PreviewUser = initialUser
    ? {
      id: initialUser.id,
      name: initialUser.name,
      email: initialUser.email,
      role: initialUser.role,
      initials: initialUser.initials,
    }
    : previewUser;

  const isAuthenticated = initialUser !== null;

  const [enrollments, setEnrollments] =
    useState<Enrollment[]>(defaultEnrollments);

  const enrollmentsByCourse = useMemo(() => {
    const map: Record<string, Enrollment> = {};

    for (const enrollment of enrollments) {
      map[enrollment.courseId] = enrollment;
    }

    return map;
  }, [enrollments]);

  const isEnrolled = useCallback(
    (courseId: string) => Boolean(enrollmentsByCourse[courseId]),
    [enrollmentsByCourse]
  );

  const enroll = useCallback((courseId: string) => {
    setEnrollments((prev) => {
      if (prev.some((e) => e.courseId === courseId)) {
        return prev;
      }

      return [
        ...prev,
        {
          courseId,
          enrolledAt: new Date().toISOString().slice(0, 10),
          completedLessonIds: [],
        },
      ];
    });
  }, []);

  const unenroll = useCallback((courseId: string) => {
    setEnrollments((prev) =>
      prev.filter((e) => e.courseId !== courseId)
    );
  }, []);

  const isLessonComplete = useCallback(
    (courseId: string, lessonId: string) =>
      Boolean(
        enrollmentsByCourse[courseId]?.completedLessonIds.includes(lessonId)
      ),
    [enrollmentsByCourse]
  );

  const markLessonComplete = useCallback(
    (courseId: string, lessonId: string) => {
      setEnrollments((prev) => {
        const existing = prev.find((e) => e.courseId === courseId);

        if (existing) {
          if (existing.completedLessonIds.includes(lessonId)) {
            return prev;
          }

          return prev.map((e) =>
            e.courseId === courseId
              ? {
                ...e,
                completedLessonIds: [
                  ...e.completedLessonIds,
                  lessonId,
                ],
              }
              : e
          );
        }

        return [
          ...prev,
          {
            courseId,
            enrolledAt: new Date().toISOString().slice(0, 10),
            completedLessonIds: [lessonId],
          },
        ];
      });
    },
    []
  );

  const markLessonIncomplete = useCallback(
    (courseId: string, lessonId: string) => {
      setEnrollments((prev) =>
        prev.map((e) =>
          e.courseId === courseId
            ? {
              ...e,
              completedLessonIds: e.completedLessonIds.filter(
                (id) => id !== lessonId
              ),
            }
            : e
        )
      );
    },
    []
  );

  const getProgress = useCallback(
    (courseId: string) => {
      const course = sampleCourses.find((c) => c.id === courseId);
      const total = course?.lessons.length ?? 0;

      const completed =
        enrollmentsByCourse[courseId]?.completedLessonIds.length ?? 0;

      const percent =
        total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, total, percent };
    },
    [enrollmentsByCourse]
  );

  const enrolledCourses = useMemo(
    () =>
      enrollments
        .map((e) => sampleCourses.find((c) => c.id === e.courseId))
        .filter((c): c is Course => Boolean(c)),
    [enrollments]
  );

  const completedCoursesCount = useMemo(
    () =>
      enrollments.filter((e) => {
        const course = sampleCourses.find((c) => c.id === e.courseId);

        return (
          course !== undefined &&
          e.completedLessonIds.length === course.lessons.length
        );
      }).length,
    [enrollments]
  );

  const totalLessonsCompleted = useMemo(
    () =>
      enrollments.reduce(
        (sum, e) => sum + e.completedLessonIds.length,
        0
      ),
    [enrollments]
  );

  // Auth0 handles the actual sign-in and sign-out flows.
  const signIn = useCallback(() => {
    window.location.assign('/auth/login');
  }, []);

  const signOut = useCallback(() => {
    window.location.assign('/auth/logout');
  }, []);

  const value: LearningContextValue = {
    user,
    isAuthenticated,
    enrollments,
    enrollmentsByCourse,
    enroll,
    unenroll,
    isEnrolled,
    markLessonComplete,
    markLessonIncomplete,
    isLessonComplete,
    getProgress,
    enrolledCourses,
    completedCoursesCount,
    totalLessonsCompleted,
    signIn,
    signOut,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const ctx = useContext(LearningContext);

  if (!ctx) {
    throw new Error('useLearning must be used within a LearningProvider');
  }

  return ctx;
}
