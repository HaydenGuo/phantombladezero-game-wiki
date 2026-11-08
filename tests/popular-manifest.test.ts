import { describe, expect, it } from 'vitest';
import { collectPublishedArticleSlugs } from '../scripts/lib/popular-manifest.ts';
import { CONTENT_TYPES } from '../src/config/navigation';

describe('Popular article slug manifest', () => {
  it('includes published English MDX articles and excludes drafts, future posts, and non-articles', () => {
    const now = new Date('2026-09-05T00:00:00.000Z');
    const category = CONTENT_TYPES[0];
    const entries = [
      { relativePath: `en/${category}/beginner-guide.mdx`, source: "---\ntitle: Test\ndate: '2026-09-01'\n---" },
      { relativePath: `en/${category}/draft-guide.mdx`, source: "---\ntitle: Test\ndate: '2026-09-01'\ndraft: true\n---" },
      { relativePath: `en/${category}/future-guide.mdx`, source: "---\ntitle: Test\ndate: '2026-10-01'\n---" },
      { relativePath: `en/${category}/README.md`, source: "---\ndate: '2026-09-01'\n---" },
      { relativePath: `ja/${category}/not-english.mdx`, source: "---\ndate: '2026-09-01'\n---" },
      { relativePath: 'en/unconfigured-category/not-an-article.mdx', source: "---\ndate: '2026-09-01'\n---" },
    ];

    expect(collectPublishedArticleSlugs(entries, now)).toEqual([`/${category}/beginner-guide/`]);
  });
});
