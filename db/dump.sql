CREATE TABLE IF NOT EXISTS users (
  id            text PRIMARY KEY,
  email         text,
  name          text,
  picture       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enrollments (
  user_id          text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id        text NOT NULL,
  enrolled_at      timestamptz NOT NULL DEFAULT now(),
  -- Powers a "Continue learning" button.
  last_lesson_id   text,
  last_accessed_at timestamptz,
  PRIMARY KEY (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS enrollments_course_idx ON enrollments (course_id);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id      text NOT NULL,
  course_id    text NOT NULL,
  lesson_id    text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, course_id, lesson_id),
  FOREIGN KEY (user_id, course_id)
    REFERENCES enrollments (user_id, course_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS lesson_progress_course_idx
  ON lesson_progress (user_id, course_id);
