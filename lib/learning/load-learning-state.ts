import 'server-only';

import type { InitialLearningState } from '@/lib/learning/types';
import { previewUser } from '@/data/sample-courses';
import {
  getAllProgress,
  getEnrollmentRecords,
} from '@/lib/db/progress';
import type { AuthProfile } from '@/lib/get-profile';
import { client } from '@/lib/sanity/client';
import { mapSanityCourse, type SanityCourseCard } from '@/lib/sanity/map-course';
import { COURSES_BY_IDS_QUERY } from '@/lib/sanity/queries';
import type { Course, Enrollment } from '@/types';

const emptyUserState = (
  profile: AuthProfile | null,
): InitialLearningState => ({
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
  enrolledCourses: [],
  completedByCourse: {},
  lessonTotals: {},
  lastLessonByCourse: {},
});

export async function loadLearningState(
  profile: AuthProfile | null,
): Promise<InitialLearningState> {
  const base = emptyUserState(profile);
  if (!profile) return base;

  try {
    const [records, completedByCourse] = await Promise.all([
      getEnrollmentRecords(profile.id),
      getAllProgress(profile.id),
    ]);

    const ids = records.map((r) => r.courseId);
    const raw =
      ids.length > 0
        ? await client.fetch<SanityCourseCard[]>(
            COURSES_BY_IDS_QUERY,
            { ids },
            { next: { revalidate: 60 } },
          )
        : [];

    const byId = new Map(raw.map((c) => [c._id, mapSanityCourse(c)]));
    const enrolledCourses: Course[] = ids
      .map((id) => byId.get(id))
      .filter((c): c is Course => Boolean(c));

    const enrollments: Enrollment[] = records.map((r) => ({
      courseId: r.courseId,
      enrolledAt: r.enrolledAt,
      completedLessonIds: completedByCourse[r.courseId] ?? [],
      lastLessonId: r.lastLessonId,
    }));

    const lastLessonByCourse: Record<string, string> = {};
    for (const r of records) {
      if (r.lastLessonId) lastLessonByCourse[r.courseId] = r.lastLessonId;
    }

    const lessonTotals: Record<string, number> = {};
    for (const course of enrolledCourses) {
      lessonTotals[course.id] = course.lessons?.length ?? 0;
    }

    return {
      ...base,
      enrolledCourseIds: ids,
      enrollments,
      enrolledCourses,
      completedByCourse,
      lessonTotals,
      lastLessonByCourse,
    };
  } catch (error) {
    console.error('Failed to load enrollment and progress:', error);
    return base;
  }
}
