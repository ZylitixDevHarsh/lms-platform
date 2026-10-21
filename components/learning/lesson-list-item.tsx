import Link from 'next/link';
import { CheckCircle2, Circle, Clock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonListItemProps {
  href: string;
  title: string;
  duration?: string;
  index: number;
  status?: 'completed' | 'in-progress' | 'not-started';
  className?: string;
}

export function LessonListItem({
  href,
  title,
  duration,
  index,
  status = 'not-started',
  className,
}: LessonListItemProps) {
  const StatusIcon =
    status === 'completed'
      ? CheckCircle2
      : status === 'in-progress'
        ? PlayCircle
        : Circle;

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-3 rounded-md border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-accent/60',
        status === 'in-progress' && 'border-primary/30 bg-primary-soft/50',
        className
      )}
    >
      <StatusIcon
        className={cn(
          'h-5 w-5 shrink-0',
          status === 'completed' && 'text-success',
          status === 'in-progress' && 'text-primary',
          status === 'not-started' && 'text-muted-foreground/50'
        )}
      />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="w-5 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
          {index}
        </span>
        <span
          className={cn(
            'truncate text-sm',
            status === 'completed'
              ? 'text-muted-foreground line-through'
              : 'text-foreground'
          )}
        >
          {title}
        </span>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        {duration}
      </span>
    </Link>
  );
}
