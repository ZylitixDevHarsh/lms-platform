'use client';

import { useEffect, useMemo, useState } from 'react';
import { isAlgoliaSearchConfigured } from '@/lib/algolia/config';
import { searchCourses } from '@/lib/algolia/search';
import type { Course } from '@/types';

function matchesLocal(course: Course, query: string): boolean {
  const haystack = [
    course.title,
    course.description,
    course.category,
    course.instructor.name,
    ...(course.moduleTitles ?? []),
    ...(course.lessonTitles ?? []),
    ...(course.lessons ?? []).map((lesson) => lesson.title),
    ...(course.modules ?? []).map((moduleItem) => moduleItem.title),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export function useCourseSearch(courses: Course[]) {
  const [query, setQuery] = useState('');
  const [hitIds, setHitIds] = useState<string[] | null>(null);
  const [searching, setSearching] = useState(false);
  const algoliaEnabled = isAlgoliaSearchConfigured();

  useEffect(() => {
    const q = query.trim();
    if (!q || !algoliaEnabled) {
      setHitIds(null);
      setSearching(false);
      return;
    }

    let cancelled = false;
    setSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const hits = await searchCourses(q);
        if (cancelled) return;
        setHitIds(hits ? hits.map((hit) => hit.objectID) : null);
      } catch (error) {
        console.error('Algolia search failed:', error);
        if (!cancelled) setHitIds(null);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, algoliaEnabled]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;

    if (hitIds) {
      const rank = new Map(hitIds.map((id, index) => [id, index]));
      return courses
        .filter((course) => rank.has(course.id))
        .sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
    }

    return courses.filter((course) => matchesLocal(course, q));
  }, [courses, query, hitIds]);

  return {
    query,
    setQuery,
    results,
    searching,
    algoliaEnabled,
  };
}
