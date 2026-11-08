import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { correctSourceDomains } from '../scripts/check-source-domains';
import { isAllowedPublicSourceDomain } from '../src/lib/source-policy';

describe('Stage 5 public Sources correction', () => {
  it('accepts platform subdomains and rejects lookalikes, official sites and credential URLs', () => {
    for (const url of ['https://store.steampowered.com/app/1/', 'https://m.youtube.com/watch?v=x', 'https://old.reddit.com/r/game/', 'https://youtu.be/x']) {
      expect(isAllowedPublicSourceDomain(url)).toBe(true);
    }
    for (const url of ['https://youtube.com.evil.test/', 'https://notreddit.com/', 'https://official-game.test/', 'javascript:alert(1)', 'https://user:secret@youtube.com/']) {
      expect(isAllowedPublicSourceDomain(url)).toBe(false);
    }
  });

  it('removes disallowed entries, preserves the article body, and is idempotent', () => {
    const root = mkdtempSync(join(tmpdir(), 'gamewebs-source-test-'));
    try {
      const dir = join(root, 'src/content/wiki/en/guides');
      mkdirSync(dir, { recursive: true });
      const file = join(dir, 'example.mdx');
      const body = '\r\n## Answer\r\nKeep [official destination](https://official-game.test/).\r\n';
      writeFileSync(file, '---\r\ntitle: Example\r\nsources:\r\n  - title: Official\r\n    url: https://official-game.test/\r\n  - title: Steam\r\n    url: https://store.steampowered.com/app/1/\r\n---' + body);
      const changes = correctSourceDomains(root);
      expect(changes).toEqual([{ page: 'src/content/wiki/en/guides/example.mdx', removedUrls: ['https://official-game.test/'] }]);
      const output = readFileSync(file, 'utf8');
      expect(output.endsWith('---' + body)).toBe(true);
      expect(output).toContain('url: https://store.steampowered.com/app/1/');
      expect(correctSourceDomains(root)).toEqual([]);
      expect(readFileSync(file, 'utf8')).toBe(output);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('fails on malformed source lists instead of rewriting them', () => {
    const root = mkdtempSync(join(tmpdir(), 'gamewebs-source-test-'));
    try {
      const dir = join(root, 'src/content/wiki/en');
      mkdirSync(dir, { recursive: true });
      const file = join(dir, 'example.mdx');
      const input = '---\ntitle: Example\nsources: wrong\n---\nBody\n';
      writeFileSync(file, input);
      expect(() => correctSourceDomains(root)).toThrow('sources must be a sequence');
      expect(readFileSync(file, 'utf8')).toBe(input);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
