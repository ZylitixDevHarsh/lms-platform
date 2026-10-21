import { groq } from 'next-sanity';

// Catalogue page: only the fields the cards + filters need.
export const COURSE_LIST_QUERY = groq`
  *[_type == "course" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    image,
    level,
    instructorName,
    instructorAvatar,
    "category": category->{title, "slug": slug.current}
  }
`;

// Filter chips: only categories that are actually used by a course.
export const CATEGORY_LIST_QUERY = groq`
  *[_type == "category" && count(*[_type == "course" && references(^._id)]) > 0]
    | order(title asc) { title }
`;

// Used by generateStaticParams on the course details page.
export const COURSE_SLUGS_QUERY = groq`
  *[_type == "course" && defined(slug.current)]{ "slug": slug.current }
`;

// Course details page: everything in one request.
// Lesson _id values are what PostgreSQL stores for enrollment and progress.
export const COURSE_DETAIL_QUERY = groq`
  *[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    description,
    learningOutcomes,
    image,
    level,
    featured,
    instructorName,
    instructorTitle,
    instructorAvatar,
    "category": category->title,
    "lessonCount": count(modules[].lessons[]),
    "totalMinutes": math::sum(modules[].lessons[]->durationMinutes),
    modules[]{
      title,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        type,
        durationMinutes
      }
    }
  }
`;

export const FEATURED_COURSE_LIST_QUERY = groq`
  *[_type == "course" && defined(slug.current) && featured == true] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    image,
    level,
    featured,
    instructorName,
    instructorAvatar,
    "category": category->{title, "slug": slug.current}
  }
`;
