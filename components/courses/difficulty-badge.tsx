import { cn } from '@/lib/utils';
import type { Difficulty } from '@/types';

const styles: Record<Difficulty, string> = {
  Beginner: 'bg-success-soft text-success border-success/20',
  Intermediate: 'bg-warning-soft text-warning border-warning/30',
  Advanced: 'bg-primary-soft text-primary border-primary/20',
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        styles[difficulty],
        className
      )}
    >
      {difficulty}
    </span>
  );
}
