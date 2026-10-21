'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { previewUser } from '@/data/sample-courses';

import type {
  Course,
  Enrollment,
  Lesson,
  PreviewUser,
} from '@/types';

import {
  enrollAction,
  setLessonCompleteAction,
  unenrollAction,
} from '@/lib/db/learning';
import type {
  CourseProgress,
  InitialLearningState,
} from '@/lib/learning/types';

export type { CourseProgress, InitialLearningState };

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type LearningContextValue = {
  // Authentication.
  user: PreviewUser;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;

  // Enrollment.
  enrollments: Enrollment[];
  enrollmentsByCourse: Record<string, Enrollment>;
  enrolledCourseIds: string[];
  enrolledCourses: Course[];

  enroll: (courseId: string, course?: Course) => Promise<boolean>;
  unenroll: (courseId: string) => Promise<boolean>;
  isEnrolled: (courseId: string) => boolean;
  registerCourse: (course: Course) => void;
  getResumeLesson: (course: Course) => Lesson | undefined;

  // Lesson progress.
  getProgress: (courseId: string) => CourseProgress;
  isLessonComplete: (courseId: string, lessonId: string) => boolean;
  markLessonComplete: (
    courseId: string,
    lessonId: string,
  ) => Promise<boolean>;
  markLessonIncomplete: (
    courseId: string,
    lessonId: string,
  ) => Promise<boolean>;

  // Dashboard statistics.
  completedCoursesCount: number;
  totalLessonsCompleted: number;
};

type LearningProviderProps = {
  children: ReactNode;
  initial: InitialLearningState;
};

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const LearningContext = createContext<LearningContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function uniqueIds(ids: string[]): string[] {
  return Array.from(new Set(ids));
}

function createEnrollment(
  courseId: string,
  completedLessonIds: string[] = [],
  lastLessonId?: string | null,
): Enrollment {
  return {
    courseId,
    enrolledAt: new Date().toISOString().slice(0, 10),
    completedLessonIds,
    lastLessonId,
  };
}

function coursesToMap(courses: Course[] | undefined): Record<string, Course> {
  const map: Record<string, Course> = {};
  for (const course of courses ?? []) {
    map[course.id] = course;
  }
  return map;
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export function LearningProvider({
  initial,
  children,
}: LearningProviderProps) {
  const [enrolled, setEnrolled] = useState<string[]>(() =>
    uniqueIds(initial.enrolledCourseIds),
  );

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    if (initial.enrollments) {
      return initial.enrollments;
    }

    return initial.enrolledCourseIds.map((courseId) =>
      createEnrollment(
        courseId,
        initial.completedByCourse[courseId] ?? [],
      ),
    );
  });

  const [completed, setCompleted] = useState<Record<string, string[]>>(
    () => initial.completedByCourse,
  );

  const [catalog, setCatalog] = useState<Record<string, Course>>(() =>
    coursesToMap(initial.enrolledCourses),
  );

  const [lessonTotals, setLessonTotals] = useState<Record<string, number>>(
    () => initial.lessonTotals,
  );

  const [lastLessonByCourse, setLastLessonByCourse] = useState<
    Record<string, string>
  >(() => initial.lastLessonByCourse ?? {});

  // Prevent duplicate concurrent requests for the same operation.
  const pendingEnrollments = useRef(new Set<string>());
  const pendingUnenrollments = useRef(new Set<string>());
  const pendingLessonUpdates = useRef(new Set<string>());

  const user: PreviewUser = initial.user ?? previewUser;

  const isAuthenticated = initial.isAuthenticated;

  /* ------------------------------------------------------------------------ */
  /* Enrollment lookup                                                        */
  /* ------------------------------------------------------------------------ */

  const enrollmentsByCourse = useMemo(
    () =>
      Object.fromEntries(
        enrollments.map((enrollment) => [
          enrollment.courseId,
          enrollment,
        ]),
      ) as Record<string, Enrollment>,
    [enrollments],
  );

  const isEnrolled = useCallback(
    (courseId: string) => enrolled.includes(courseId),
    [enrolled],
  );

  const registerCourse = useCallback((course: Course) => {
    setCatalog((prev) =>
      prev[course.id] ? prev : { ...prev, [course.id]: course },
    );
    const total = course.lessons?.length ?? 0;
    if (total > 0) {
      setLessonTotals((prev) =>
        prev[course.id] === total ? prev : { ...prev, [course.id]: total },
      );
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Enroll                                                                   */
  /* ------------------------------------------------------------------------ */

  const enroll = useCallback(
    async (courseId: string, course?: Course): Promise<boolean> => {
      if (!isAuthenticated) {
        window.location.assign('/auth/login');
        return false;
      }

      if (course) registerCourse(course);

      if (pendingEnrollments.current.has(courseId)) {
        return false;
      }

      if (pendingUnenrollments.current.has(courseId)) {
        return false;
      }

      if (enrolled.includes(courseId)) {
        return true;
      }

      pendingEnrollments.current.add(courseId);

      const previousEnrollments = enrollments;
      const previousEnrolled = enrolled;

      const newEnrollment = createEnrollment(
        courseId,
        completed[courseId] ?? [],
      );

      // Optimistic UI update.
      setEnrolled((prev) =>
        prev.includes(courseId) ? prev : [courseId, ...prev],
      );

      setEnrollments((prev) =>
        prev.some((item) => item.courseId === courseId)
          ? prev
          : [newEnrollment, ...prev],
      );

      try {
        const result = await enrollAction(courseId);

        if (!result.ok) {
          setEnrolled(previousEnrolled);
          setEnrollments(previousEnrollments);
          return false;
        }

        return true;
      } catch (error) {
        console.error('Failed to enroll in course:', error);

        setEnrolled(previousEnrolled);
        setEnrollments(previousEnrollments);

        return false;
      } finally {
        pendingEnrollments.current.delete(courseId);
      }
    },
    [isAuthenticated, enrolled, enrollments, completed, registerCourse],
  );

  /* ------------------------------------------------------------------------ */
  /* Unenroll                                                                 */
  /* ------------------------------------------------------------------------ */

  const unenroll = useCallback(
    async (courseId: string): Promise<boolean> => {
      if (!isAuthenticated) {
        window.location.assign('/auth/login');
        return false;
      }

      if (pendingUnenrollments.current.has(courseId)) {
        return false;
      }

      if (pendingEnrollments.current.has(courseId)) {
        return false;
      }

      if (!enrolled.includes(courseId)) {
        return true;
      }

      pendingUnenrollments.current.add(courseId);

      const previousEnrolled = enrolled;
      const previousEnrollments = enrollments;

      // Optimistically remove the enrollment.
      setEnrolled((prev) => prev.filter((id) => id !== courseId));

      setEnrollments((prev) =>
        prev.filter((item) => item.courseId !== courseId),
      );

      try {
        const result = await unenrollAction(courseId);

        if (!result.ok) {
          setEnrolled(previousEnrolled);
          setEnrollments(previousEnrollments);
          return false;
        }

        return true;
      } catch (error) {
        console.error('Failed to unenroll from course:', error);

        setEnrolled(previousEnrolled);
        setEnrollments(previousEnrollments);

        return false;
      } finally {
        pendingUnenrollments.current.delete(courseId);
      }
    },
    [isAuthenticated, enrolled, enrollments],
  );

  /* ------------------------------------------------------------------------ */
  /* Lesson completion                                                        */
  /* ------------------------------------------------------------------------ */

  const isLessonComplete = useCallback(
    (courseId: string, lessonId: string) =>
      completed[courseId]?.includes(lessonId) ?? false,
    [completed],
  );

  const setComplete = useCallback(
    async (
      courseId: string,
      lessonId: string,
      complete: boolean,
    ): Promise<boolean> => {
      if (!isAuthenticated) {
        window.location.assign('/auth/login');
        return false;
      }

      const operationKey = `${courseId}:${lessonId}`;

      if (pendingLessonUpdates.current.has(operationKey)) {
        return false;
      }

      const wasComplete =
        completed[courseId]?.includes(lessonId) ?? false;

      if (wasComplete === complete) {
        return true;
      }

      pendingLessonUpdates.current.add(operationKey);

      const previousCompleted = completed;
      const previousEnrolled = enrolled;
      const previousEnrollments = enrollments;
      const previousLastLesson = lastLessonByCourse;

      const updateLocalProgress = (shouldComplete: boolean) => {
        setCompleted((prev) => {
          const current = prev[courseId] ?? [];

          const next = shouldComplete
            ? current.includes(lessonId)
              ? current
              : [...current, lessonId]
            : current.filter((id) => id !== lessonId);

          return {
            ...prev,
            [courseId]: next,
          };
        });

        setEnrollments((prev) => {
          const existing = prev.find(
            (item) => item.courseId === courseId,
          );

          if (existing) {
            return prev.map((item) =>
              item.courseId === courseId
                ? {
                  ...item,
                  completedLessonIds: shouldComplete
                    ? uniqueIds([
                      ...item.completedLessonIds,
                      lessonId,
                    ])
                    : item.completedLessonIds.filter(
                      (id) => id !== lessonId,
                    ),
                }
                : item,
            );
          }

          // Preserve the original behavior: completing a lesson
          // implicitly creates an enrollment.
          if (shouldComplete) {
            return [
              ...prev,
              createEnrollment(courseId, [lessonId]),
            ];
          }

          return prev;
        });

        if (shouldComplete) {
          setEnrolled((prev) =>
            prev.includes(courseId) ? prev : [courseId, ...prev],
          );
        }

        setLastLessonByCourse((prev) => ({
          ...prev,
          [courseId]: lessonId,
        }));
      };

      // Optimistically update the UI.
      updateLocalProgress(complete);

      try {
        const result = await setLessonCompleteAction(
          courseId,
          lessonId,
          complete,
        );

        if (!result.ok) {
          setCompleted(previousCompleted);
          setEnrolled(previousEnrolled);
          setEnrollments(previousEnrollments);
          setLastLessonByCourse(previousLastLesson);
          return false;
        }

        return true;
      } catch (error) {
        console.error('Failed to update lesson progress:', error);

        setCompleted(previousCompleted);
        setEnrolled(previousEnrolled);
        setEnrollments(previousEnrollments);
        setLastLessonByCourse(previousLastLesson);

        return false;
      } finally {
        pendingLessonUpdates.current.delete(operationKey);
      }
    },
    [isAuthenticated, enrolled, completed, enrollments, lastLessonByCourse],
  );

  const markLessonComplete = useCallback(
    (courseId: string, lessonId: string) =>
      setComplete(courseId, lessonId, true),
    [setComplete],
  );

  const markLessonIncomplete = useCallback(
    (courseId: string, lessonId: string) =>
      setComplete(courseId, lessonId, false),
    [setComplete],
  );

  /* ------------------------------------------------------------------------ */
  /* Progress                                                                 */
  /* ------------------------------------------------------------------------ */

  const getProgress = useCallback(
    (courseId: string): CourseProgress => {
      const total = lessonTotals[courseId] ?? 0;
      const completedCount = completed[courseId]?.length ?? 0;

      // Guard against invalid or stale lesson IDs.
      const done = Math.min(completedCount, total);

      const percent =
        total > 0
          ? Math.min(100, Math.round((done / total) * 100))
          : 0;

      return {
        completed: done,
        total,
        percent,
      };
    },
    [completed, lessonTotals],
  );

  const getResumeLesson = useCallback(
    (course: Course): Lesson | undefined => {
      const lessons = course.lessons ?? [];
      const done = new Set(completed[course.id] ?? []);
      const lastId = lastLessonByCourse[course.id];
      if (lastId) {
        const last = lessons.find((lesson) => lesson.id === lastId);
        if (last && !done.has(last.id)) return last;
      }
      return lessons.find((lesson) => !done.has(lesson.id)) ?? lessons[0];
    },
    [completed, lastLessonByCourse],
  );

  /* ------------------------------------------------------------------------ */
  /* Course list                                                               */
  /* ------------------------------------------------------------------------ */

  const enrolledCourses = useMemo(
    () =>
      enrolled
        .map((courseId) => catalog[courseId])
        .filter((course): course is Course => Boolean(course)),
    [enrolled, catalog],
  );

  /* ------------------------------------------------------------------------ */
  /* Dashboard statistics                                                     */
  /* ------------------------------------------------------------------------ */

  const completedCoursesCount = useMemo(
    () =>
      enrolled.filter((courseId) => {
        const total = lessonTotals[courseId] ?? 0;
        const completedCount = completed[courseId]?.length ?? 0;

        return total > 0 && completedCount >= total;
      }).length,
    [enrolled, completed, lessonTotals],
  );

  const totalLessonsCompleted = useMemo(
    () =>
      enrolled.reduce(
        (sum, courseId) =>
          sum + Math.min(
            completed[courseId]?.length ?? 0,
            lessonTotals[courseId] ?? 0,
          ),
        0,
      ),
    [enrolled, completed, lessonTotals],
  );

  /* ------------------------------------------------------------------------ */
  /* Auth0 navigation                                                         */
  /* ------------------------------------------------------------------------ */

  const signIn = useCallback(() => {
    window.location.assign('/auth/login');
  }, []);

  const signOut = useCallback(() => {
    window.location.assign('/auth/logout');
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Context value                                                            */
  /* ------------------------------------------------------------------------ */

  const value = useMemo<LearningContextValue>(
    () => ({
      user,
      isAuthenticated,
      signIn,
      signOut,

      enrollments,
      enrollmentsByCourse,
      enrolledCourseIds: enrolled,
      enrolledCourses,

      enroll,
      unenroll,
      isEnrolled,
      registerCourse,
      getResumeLesson,

      getProgress,
      isLessonComplete,
      markLessonComplete,
      markLessonIncomplete,

      completedCoursesCount,
      totalLessonsCompleted,
    }),
    [
      user,
      isAuthenticated,
      signIn,
      signOut,
      enrollments,
      enrollmentsByCourse,
      enrolled,
      enrolledCourses,
      enroll,
      unenroll,
      isEnrolled,
      registerCourse,
      getResumeLesson,
      getProgress,
      isLessonComplete,
      markLessonComplete,
      markLessonIncomplete,
      completedCoursesCount,
      totalLessonsCompleted,
    ],
  );

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useLearning(): LearningContextValue {
  const context = useContext(LearningContext);

  if (!context) {
    throw new Error(
      'useLearning must be used inside <LearningProvider>',
    );
  }

  return context;
}
