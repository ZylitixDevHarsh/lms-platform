'use client';

import { cn } from '@/lib/utils';

interface FilterChipsProps<T extends string> {
  options: readonly T[];
  value: T | 'All';
  onChange: (value: T | 'All') => void;
  allLabel?: string;
  className?: string;
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  allLabel = 'All',
  className,
}: FilterChipsProps<T>) {
  const chips: (T | 'All')[] = ['All', ...options];
  return (
    <div
      className={cn(
        'flex flex-wrap gap-2',
        className
      )}
      role="tablist"
      aria-label="Filter options"
    >
      {chips.map((chip) => {
        const active = chip === value;
        return (
          <button
            key={chip}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(chip)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
              active
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            {chip === 'All' ? allLabel : chip}
          </button>
        );
      })}
    </div>
  );
}
