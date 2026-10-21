import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { LessonContentBlock } from '@/types';

// Styles for rendered Markdown. Written as explicit components so it does not
// depend on the Tailwind typography plugin.
const markdownComponents: Components = {
  h1: (props) => (
    <h1
      className="mb-4 mt-8 font-display text-2xl font-bold tracking-tight text-foreground first:mt-0 sm:text-3xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-3 mt-8 font-display text-xl font-semibold tracking-tight text-foreground first:mt-0 sm:text-2xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-2 mt-6 font-display text-lg font-semibold text-foreground first:mt-0"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mb-2 mt-5 text-base font-semibold text-foreground first:mt-0"
      {...props}
    />
  ),
  p: (props) => <p className="mb-4 leading-7 text-foreground/90" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-6 text-foreground/90" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-foreground/90" {...props} />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-5 rounded-r-md border-l-4 border-primary/50 bg-secondary/40 px-4 py-2 text-foreground/90 [&>p]:mb-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  a: ({ href, ...props }) => {
    const external = href?.startsWith('http');
    return (
      <a
        href={href}
        className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      />
    );
  },
  // Inline code vs fenced code block.
  code: ({ className, children, ...props }) => {
    const isBlock =
      /language-/.test(className ?? '') || String(children).includes('\n');
    return isBlock ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <code
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: (props) => (
    <pre
      className="my-5 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm leading-6"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-border bg-secondary/50 px-3 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props) => <td className="border border-border px-3 py-2" {...props} />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === 'string' ? src : undefined}
      alt={alt ?? ''}
      className="my-5 h-auto max-w-full rounded-lg border border-border"
    />
  ),
};

function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {children}
    </ReactMarkdown>
  );
}

const HEADING_CLASSES: Record<number, string> = {
  1: 'mt-8 font-display text-2xl font-bold sm:text-3xl',
  2: 'mt-8 font-display text-xl font-semibold sm:text-2xl',
  3: 'mt-6 font-display text-lg font-semibold',
  4: 'mt-5 text-base font-semibold',
  5: 'mt-4 text-sm font-semibold',
  6: 'mt-4 text-sm font-semibold',
};

export function LessonContent({
  blocks,
}: {
  blocks?: LessonContentBlock[] | null;
}) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="text-sm text-foreground/90 sm:text-base">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'markdown':
            return (
              <div key={i} className="mb-6 last:mb-0">
                <Markdown>{block.text}</Markdown>
              </div>
            );

          case 'heading': {
            const level = Math.min(Math.max(block.level ?? 2, 1), 6);
            const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
            return (
              <Tag
                key={i}
                className={`mb-3 tracking-tight text-foreground first:mt-0 ${HEADING_CLASSES[level]}`}
              >
                {block.text}
              </Tag>
            );
          }

          case 'paragraph':
            return (
              <p key={i} className="mb-4 leading-7 text-foreground/90">
                {block.text}
              </p>
            );

          case 'quote':
            return (
              <blockquote
                key={i}
                className="my-5 rounded-r-md border-l-4 border-primary/50 bg-secondary/40 px-4 py-2 text-foreground/90"
              >
                {block.text}
              </blockquote>
            );

          case 'list': {
            const List = block.ordered ? 'ol' : 'ul';
            return (
              <List
                key={i}
                className={`mb-4 space-y-1.5 pl-6 text-foreground/90 ${block.ordered ? 'list-decimal' : 'list-disc'
                  }`}
              >
                {block.items.map((item, j) => (
                  <li key={j} className="leading-7">
                    {item}
                  </li>
                ))}
              </List>
            );
          }

          case 'link':
            return (
              <p key={i} className="mb-4">
                <a
                  href={block.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
                >
                  {block.label}
                </a>
              </p>
            );

          case 'code':
            return (
              <pre
                key={i}
                className="my-5 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm leading-6"
              >
                <code>{block.code}</code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
