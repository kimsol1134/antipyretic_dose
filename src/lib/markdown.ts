import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img || []),
      'src',
      'alt',
      'loading',
      'class',
    ],
    a: [...(defaultSchema.attributes?.a || []), 'href', 'target', 'rel'],
    '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'class'],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
};

export async function parseMarkdownToHtml(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(content);

  return String(result);
}
