import { groq } from 'next-sanity';

export const LESSON_PAGE_QUERY = groq`
  *[_type == "course" && slug.current == $courseSlug][0]{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    image,
    level,
    featured,
    instructorName,
    instructorTitle,
    instructorAvatar,
    "category": category->title,
    modules[]{
      title,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        type,
        durationMinutes,
        "videoUrl": select(slug.current == $lessonSlug => videoUrl),
        "content": select(slug.current == $lessonSlug => content)
      }
    }
  }
`;

// Every course/lesson slug pair, for generateStaticParams.
export const LESSON_PARAMS_QUERY = groq`
  *[_type == "course" && defined(slug.current)]{
    "courseSlug": slug.current,
    "lessonSlugs": modules[].lessons[]->slug.current
  }
`;
