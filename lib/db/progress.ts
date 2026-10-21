import 'server-only';
import { pool } from '@/lib/db/db';

export type AppUser = {
  sub: string; // Auth0 user id
  email?: string | null;
  name?: string | null;
  picture?: string | null;
};

// Creates the user row on first sight, refreshes profile + last login after.
// Needed because enrollments reference users(id).
export async function upsertUser(user: AppUser): Promise<void> {
  await pool.query(
    `INSERT INTO users (id, email, name, picture)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE
       SET email = EXCLUDED.email,
           name = EXCLUDED.name,
           picture = EXCLUDED.picture,
           last_login_at = now()`,
    [user.sub, user.email ?? null, user.name ?? null, user.picture ?? null],
  );
}

export async function enroll(userId: string, courseId: string): Promise<void> {
  await pool.query(
    `INSERT INTO enrollments (user_id, course_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, course_id) DO NOTHING`,
    [userId, courseId],
  );
}

export async function isEnrolled(userId: string, courseId: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId],
  );
  return (rowCount ?? 0) > 0;
}

export async function getEnrolledCourseIds(userId: string): Promise<string[]> {
  const { rows } = await pool.query<{ course_id: string }>(
    `SELECT course_id FROM enrollments
     WHERE user_id = $1
     ORDER BY COALESCE(last_accessed_at, enrolled_at) DESC`,
    [userId],
  );
  return rows.map((r) => r.course_id);
}

export async function getCompletedLessonIds(
  userId: string,
  courseId: string,
): Promise<string[]> {
  const { rows } = await pool.query<{ lesson_id: string }>(
    `SELECT lesson_id FROM lesson_progress
     WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId],
  );
  return rows.map((r) => r.lesson_id);
}

// { [courseId]: [lessonId, ...] } for every course the user has progress in.
// Handy for the dashboard and for seeding the client-side learning provider.
export async function getAllProgress(
  userId: string,
): Promise<Record<string, string[]>> {
  const { rows } = await pool.query<{ course_id: string; lesson_id: string }>(
    `SELECT course_id, lesson_id FROM lesson_progress WHERE user_id = $1`,
    [userId],
  );
  const result: Record<string, string[]> = {};
  for (const r of rows) {
    (result[r.course_id] ??= []).push(r.lesson_id);
  }
  return result;
}

// Marks / unmarks a lesson. Also enrolls the user if they weren't yet
// (progress rows require an enrollment) and remembers the last lesson opened.
export async function setLessonComplete(
  userId: string,
  courseId: string,
  lessonId: string,
  complete: boolean,
): Promise<void> {
  const db = await pool.connect();
  try {
    await db.query('BEGIN');

    await db.query(
      `INSERT INTO enrollments (user_id, course_id, last_lesson_id, last_accessed_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (user_id, course_id) DO UPDATE
         SET last_lesson_id = EXCLUDED.last_lesson_id,
             last_accessed_at = now()`,
      [userId, courseId, lessonId],
    );

    if (complete) {
      await db.query(
        `INSERT INTO lesson_progress (user_id, course_id, lesson_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, course_id, lesson_id) DO NOTHING`,
        [userId, courseId, lessonId],
      );
    } else {
      await db.query(
        `DELETE FROM lesson_progress
         WHERE user_id = $1 AND course_id = $2 AND lesson_id = $3`,
        [userId, courseId, lessonId],
      );
    }

    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK');
    throw err;
  } finally {
    db.release();
  }
}

// Call when a lesson page is opened, so "Continue learning" works even if the
// user hasn't marked anything complete yet. Does nothing if not enrolled.
export async function touchLastLesson(
  userId: string,
  courseId: string,
  lessonId: string,
): Promise<void> {
  await pool.query(
    `UPDATE enrollments
     SET last_lesson_id = $3, last_accessed_at = now()
     WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId, lessonId],
  );
}
