import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  size = 'sm',
  showLabel = false,
  label,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-secondary',
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        )}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {label ?? `${percent}%`}
        </span>
      )}
    </div>
  );
}
