export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Category =
  | 'Cybersecurity'
  | 'Data Privacy'
  | 'Health & Safety'
  | 'Leadership'
  | 'Data & Analytics'
  | 'Project Management'
  | 'Digital Strategy'
  | 'Artificial Intelligence';

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  duration: string;
  summary: string;
  content: LessonContentBlock[];
}

export type LessonContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'callout'; tone: 'info' | 'warning' | 'success'; text: string }
  | { type: 'video'; title: string; duration: string }
  | { type: 'link'; label: string; href: string };

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  category: Category;
  thumbnail: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  difficulty: Difficulty;
  duration?: string;
  objectives?: string[];
  lessons?: Lesson[];
  featured?: boolean;
}

export interface Enrollment {
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
}

export interface PreviewUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export const CATEGORIES: Category[] = [
  'Cybersecurity',
  'Data Privacy',
  'Health & Safety',
  'Leadership',
  'Data & Analytics',
  'Project Management',
  'Digital Strategy',
  'Artificial Intelligence',
];

export const DIFFICULTIES: Difficulty[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
];
