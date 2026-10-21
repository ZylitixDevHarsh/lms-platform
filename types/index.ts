import { PortableTextBlock } from "next-sanity";

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
  type: "video" | "article";
  durationMinutes: number | undefined;
  content: LessonContentBlock[];
}

export type LessonContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level?: number }
  | { type: 'quote'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'link'; label: string; href: string }
  | { type: 'markdown'; text: string }
  | { type: 'code'; code: string; language?: string };


export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: PortableTextBlock[];
  category?: Category;
  thumbnail: string;
  instructor: {
    name: string;
    title?: string;
    avatar: string;
  };
  difficulty: Difficulty;
  duration?: string;
  objectives?: string[];
  lessons?: Lesson[];
  featured?: boolean;
  modules?: { title: string, lessons?: Lesson[] }[];
  lessonTitles?: string[];
  moduleTitles?: string[];
}

export interface Enrollment {
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  lastLessonId?: string | null;
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


export type SanitySpan = {
  _type: 'span';
  _key?: string;
  text: string;
  marks?: string[];
};

export type SanityPortableTextBlock = {
  _type: 'block';
  _key?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  children?: SanitySpan[];
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
    [key: string]: unknown;
  }>;
};

export type SanityContentItem =
  | SanityPortableTextBlock
  | { _type: 'image';[key: string]: unknown }
  | { _type: 'code';[key: string]: unknown };


export type SanityLesson = {
  _id: string;
  title: string;
  slug: string;
  type: 'video' | 'article';
  durationMinutes?: number;
  videoUrl?: string;
  content?: SanityContentItem[];
} | null;
