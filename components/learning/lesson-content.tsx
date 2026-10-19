import {
  AlertTriangle,
  CheckCircle2,
  Info,
  PlayCircle,
  Quote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LessonContentBlock } from '@/types';

const calloutConfig = {
  info: { icon: Info, className: 'border-primary/30 bg-primary-soft text-primary' },
  warning: {
    icon: AlertTriangle,
    className: 'border-warning/30 bg-warning-soft text-warning',
  },
  success: {
    icon: CheckCircle2,
    className: 'border-success/30 bg-success-soft text-success',
  },
};

export function LessonContent({ blocks }: { blocks: LessonContentBlock[] }) {
  return (
    <div className="prose-learn">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={i}>{block.text}</h2>;
          case 'paragraph':
            return <p key={i}>{block.text}</p>;
          case 'list':
            return block.ordered ? (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case 'quote':
            return (
              <blockquote key={i} className="not-prose my-5 flex gap-3 border-l-2 border-primary/40 pl-4">
                <Quote className="h-4 w-4 shrink-0 text-primary/50" />
                <p className="text-sm italic text-muted-foreground">{block.text}</p>
              </blockquote>
            );
          case 'callout': {
            const cfg = calloutConfig[block.tone];
            const Icon = cfg.icon;
            return (
              <div
                key={i}
                className={cn(
                  'not-prose my-5 flex gap-3 rounded-md border p-4',
                  cfg.className
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium leading-relaxed">{block.text}</p>
              </div>
            );
          }
          case 'video':
            return (
              <div
                key={i}
                className="not-prose my-5 flex aspect-video flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 text-center"
              >
                <PlayCircle className="h-10 w-10 text-primary" />
                <p className="text-sm font-medium text-foreground">{block.title}</p>
                <p className="text-xs text-muted-foreground">{block.duration}</p>
              </div>
            );
          case 'link':
            return (
              <p key={i} className="not-prose my-3">
                <a
                  href={block.href}
                  className="inline-flex items-center text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  {block.label}
                </a>
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
