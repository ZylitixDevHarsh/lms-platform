import type { LessonContentBlock, SanityContentItem, SanityPortableTextBlock } from '@/types';


function getBlockText(block: SanityPortableTextBlock): string {
  return (block.children ?? [])
    .map((child) => child.text)
    .join('');
}

export function mapLessonContent(
  content: SanityContentItem[] | null | undefined,
): LessonContentBlock[] {
  if (!content) {
    return [];
  }

  const result: LessonContentBlock[] = [];

  for (const item of content) {
    if (item._type !== 'block') {
      // Images and code blocks need their own frontend content types.
      continue;
    }

    const text = getBlockText(item);

    if (!text.trim()) {
      continue;
    }

    // Convert headings.
    if (item.style?.startsWith('h')) {
      result.push({
        type: 'heading',
        text,
      });
      continue;
    }

    // Convert blockquotes.
    if (item.style === 'blockquote') {
      result.push({
        type: 'quote',
        text,
      });
      continue;
    }

    // Convert bullet and numbered lists.
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

    // Convert hyperlinks.
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

    // Convert ordinary paragraphs.
    result.push({
      type: 'paragraph',
      text,
    });
  }

  return result;
}
