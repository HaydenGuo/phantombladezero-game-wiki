import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isSeq, parseDocument } from 'yaml';
import { isAllowedPublicSourceDomain } from '../src/lib/source-policy.ts';

export function correctSourceDomains(root = process.cwd()) {
  const changes: Array<{ page: string; removedUrls: unknown[] }> = [];
  const base = path.join(root, 'src/content/wiki');
  if (!fs.existsSync(base)) throw new Error(`Missing article directory: ${base}`);
  const visit = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) { visit(file); continue; }
      if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
      const input = fs.readFileSync(file, 'utf8');
      const match = input.match(/^(\uFEFF?---\r?\n)([\s\S]*?)(\r?\n---(?:\r?\n|$))/);
      if (!match) throw new Error(`Missing frontmatter: ${file}`);
      const document = parseDocument(match[2]);
      if (document.errors.length) throw new Error(`Invalid YAML: ${file}`);
      const sources = document.get('sources', true);
      if (sources === undefined) continue;
      if (!isSeq(sources)) throw new Error(`sources must be a sequence: ${file}`);
      const originalSources = document.toJS().sources as Array<{ url?: unknown } | null>;
      const removedUrls: unknown[] = [];
      for (let i = sources.items.length - 1; i >= 0; i--) {
        const source = originalSources[i];
        if (typeof source?.url !== 'string' || !isAllowedPublicSourceDomain(source.url)) {
          removedUrls.unshift(source?.url ?? null);
          sources.delete(i);
        }
      }
      if (!removedUrls.length) continue;
      const newline = match[1].includes('\r\n') ? '\r\n' : '\n';
      const yaml = document.toString().trimEnd().replace(/\r?\n/g, newline);
      const output = match[1] + yaml + match[3] + input.slice(match[0].length);
      const check = parseDocument(yaml).toJS() as { sources: Array<{ url: string }> };
      if (!check.sources.every((source) => isAllowedPublicSourceDomain(source.url))) {
        throw new Error(`Source correction did not converge: ${file}`);
      }
      fs.writeFileSync(file, output);
      changes.push({ page: path.relative(root, file).replace(/\\/g, '/'), removedUrls });
    }
  };
  visit(base);
  return changes;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const changes = correctSourceDomains();
  console.log(JSON.stringify({ status: 'PASS', correctedPages: changes.length, changes }, null, 2));
}
