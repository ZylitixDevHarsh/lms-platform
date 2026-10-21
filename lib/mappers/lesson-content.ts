import type { LessonContentBlock, SanityContentItem, SanityPortableTextBlock } from '@/types';

function getBlockText(block: SanityPortableTextBlock): string {
  return (block.children ?? [])
    .map((child) => child.text)
    .join('');
}

// Matches common Markdown syntax: headings, lists, quotes, fences, bold, rules.
const MARKDOWN_HINT =
  /(^|\n)\s{0,3}(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)|\*\*[^*\n]+\*\*|\n---\n/;

// The Sanity `code` block is used for Markdown articles. Decide whether a given
// block is Markdown to render, or real source code to show in a <pre>.
function isMarkdown(language: string | undefined, code: string): boolean {
  const lang = language?.toLowerCase();
  if (lang === 'markdown' || lang === 'md') return true;
  if (!lang || lang === 'text' || lang === 'plaintext') {
    return MARKDOWN_HINT.test(code);
  }
  return false;
}

export function mapLessonContent(
  content: SanityContentItem[] | null | undefined,
): LessonContentBlock[] {
  if (!content) {
    return [];
  }

  const result: LessonContentBlock[] = [];

  for (const item of content) {
    // Sanity `code` blocks: Markdown content or real code.
    if (item._type === 'code') {
      const code = 'code' in item ? item.code : '';
      const language =
        'language' in item && typeof item.language === 'string'
          ? item.language
          : undefined;

      if (typeof code === 'string' && code.trim()) {
        if (isMarkdown(language, code)) {
          result.push({ type: 'markdown', text: code });
        } else {
          result.push({ type: 'code', code, language });
        }
      }

      continue;
    }

    // Handle Portable Text blocks.
    if (item._type !== 'block') {
      continue;
    }

    const text = getBlockText(item);

    if (!text.trim()) {
      continue;
    }

    // Headings.
    if (item.style?.startsWith('h')) {
      const level = Number(item.style.slice(1)) || 2;
      result.push({
        type: 'heading',
        text,
        level,
      });
      continue;
    }

    // Blockquotes.
    if (item.style === 'blockquote') {
      result.push({
        type: 'quote',
        text,
      });
      continue;
    }

    // Lists.
    if (item.listItem) {
      const ordered = item.listItem === 'number';
      const previous = result[result.length - 1];

      if (previous?.type === 'list' && previous.ordered === ordered) {
        previous.items.push(text);
      } else {
        result.push({
          type: 'list',
          ordered,
          items: [text],
        });
      }

      continue;
    }

    // Links.
    const linkDefinition = item.markDefs?.find(
      (definition) =>
        definition._type === 'link' && definition.href,
    );

    if (linkDefinition?.href) {
      result.push({
        type: 'link',
        label: text,
        href: linkDefinition.href,
      });
      continue;
    }

    // Paragraphs.
    result.push({
      type: 'paragraph',
      text,
    });
  }

  return result;
}
