'use server';

import { revalidatePath } from 'next/cache';
import { auth0 } from '@/lib/auth0';
import { client } from '@/lib/sanity/client';
import {
  enroll,
  setLessonComplete,
  upsertUser,
} from '@/lib/db/progress';

type ActionResult = { ok: true } | { ok: false; error: string };

// The user id ALWAYS comes from the Auth0 session on the server.
// Never accept a userId from the client.
async function requireUserId(): Promise<string> {
  const session = await auth0.getSession();
  if (!session) throw new Error('Unauthorized');

  const { sub, email, name, picture } = session.user;
  await upsertUser({ sub, email, name, picture });
  return sub;
}

// Reject made-up ids: the course must exist in Sanity...
async function courseExists(courseId: string): Promise<boolean> {
  const n = await client.fetch<number>(
    `count(*[_type == "course" && _id == $courseId])`,
    { courseId },
  );
  return n > 0;
}

// ...and the lesson must belong to that course.
async function lessonInCourse(courseId: string, lessonId: string): Promise<boolean> {
  const n = await client.fetch<number>(
    `count(*[_type == "course" && _id == $courseId && $lessonId in modules[].lessons[]._ref])`,
    { courseId, lessonId },
  );
  return n > 0;
}

export async function enrollAction(courseId: string): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    if (!(await courseExists(courseId))) {
      return { ok: false, error: 'Course not found' };
    }

    await enroll(userId, courseId);
    revalidatePath('/dashboard');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not enroll. Please try again.' };
  }
}

export async function setLessonCompleteAction(
  courseId: string,
  lessonId: string,
  complete: boolean,
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    if (!(await lessonInCourse(courseId, lessonId))) {
      return { ok: false, error: 'Lesson not found in this course' };
    }

    await setLessonComplete(userId, courseId, lessonId, complete);
    revalidatePath('/dashboard');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not save progress. Please try again.' };
  }
}
