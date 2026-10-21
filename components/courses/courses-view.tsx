'use client';

import { useState } from 'react';
import { SearchX, SlidersHorizontal } from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { PageHeader } from '@/components/layout/page-header';
import { CourseGrid } from '@/components/courses/course-grid';
import { SearchInput } from '@/components/courses/search-input';
import { FilterChips } from '@/components/courses/filter-chips';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { useCourseSearch } from '@/hooks/use-course-search';
import { useLearning } from '@/components/providers/learning-provider';
import { DIFFICULTIES, type Course, type Difficulty } from '@/types';

type CategoryFilter = string;
type DifficultyFilter = Difficulty | 'All';

export function CoursesView({
  courses,
  categories,
}: {
  courses: Course[];
  categories: string[];
}) {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('All');
  const { isEnrolled, getProgress } = useLearning();
  const { query, setQuery, results, searching, algoliaEnabled } =
    useCourseSearch(courses);

  const filtered = results.filter((c) => {
    if (category !== 'All' && c.category !== category) return false;
    if (difficulty !== 'All' && c.difficulty !== difficulty) return false;
    return true;
  });

  const hasFilters = query || category !== 'All' || difficulty !== 'All';

  const clearAll = () => {
    setQuery('');
    setCategory('All');
    setDifficulty('All');
  };

  return (
    <PageContainer className="py-6 sm:py-10">
      <PageHeader
        eyebrow="Catalogue"
        title="Explore Courses"
        description="Find the right course for your learning journey."
      />

      <div className="mt-6 space-y-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search courses and lessons..."
          autoFocus
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Category
          </div>
          <FilterChips
            options={categories}
            value={category}
            onChange={(v) => setCategory(v as CategoryFilter)}
            allLabel="All categories"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Difficulty
          </div>
          <FilterChips
            options={DIFFICULTIES}
            value={difficulty}
            onChange={(v) => setDifficulty(v as DifficultyFilter)}
            allLabel="All levels"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{' '}
          {filtered.length === 1 ? 'course' : 'courses'}
          {hasFilters && ' found'}
          {searching && ' · searching'}
          {algoliaEnabled && query.trim() && ' · including lessons'}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear filters
          </Button>
        )}
      </div>

      {filtered.length > 0 ? (
        <CourseGrid
          courses={filtered}
          className="mt-5"
          progressByCourse={Object.fromEntries(
            filtered
              .filter((c) => isEnrolled(c.id) && getProgress(c.id).total > 0)
              .map((c) => [c.id, getProgress(c.id)]),
          )}
        />
      ) : (
        <EmptyState
          className="mt-5"
          icon={<SearchX className="h-6 w-6" />}
          title="No courses match your search"
          description="Try a different keyword, or clear your filters to see everything available."
          action={
            <Button variant="outline" onClick={clearAll}>
              Clear filters
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}
