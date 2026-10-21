import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryBadgeProps {
  category?: Category;
  className?: string;
  variant?: 'solid' | 'soft' | 'outline';
}

export function CategoryBadge({
  category,
  className,
  variant = 'soft',
}: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium',
        variant === 'solid' && 'bg-foreground text-background',
        variant === 'soft' && 'bg-secondary text-secondary-foreground',
        variant === 'outline' &&
        'border border-border text-muted-foreground',
        className
      )}
    >
      {category}
    </span>
  );
}
