import { cpSync, existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Windows Vercel tracing can retain pnpm's real package files but omit the
// node_modules alias. Materialize only those already-traced files for upload.
const root = resolve('.vercel/output/functions');
let copied = 0;
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const current = join(directory, entry.name);
    if (!entry.name.endsWith('.func')) { visit(current); continue; }
    const store = join(current, 'node_modules/.pnpm');
    if (!existsSync(store)) continue;
    for (const version of readdirSync(store)) {
      const modules = join(store, version, 'node_modules');
      if (!existsSync(modules)) continue;
      const packages = readdirSync(modules).flatMap((name) => name.startsWith('@')
        ? readdirSync(join(modules, name)).map((child) => join(name, child)) : [name]);
      for (const name of packages) {
        const source = join(modules, name);
        if (!existsSync(join(source, 'package.json'))) continue;
        const metadata = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8'));
        if (metadata.name !== name.replaceAll('\\', '/')) continue;
        const destination = join(current, 'node_modules', name);
        if (existsSync(destination)) continue;
        mkdirSync(destination, { recursive: true });
        cpSync(source, destination, { recursive: true, dereference: true });
        copied += 1;
      }
    }
    const configPath = join(current, '.vc-config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    // The CLI's self-referencing alias map must not replace the real directory
    // during upload now that the package is materialized.
    for (const [alias, target] of Object.entries(config.filePathMap ?? {})) {
      if (alias === target && existsSync(join(current, alias))) delete config.filePathMap[alias];
    }
    writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
}
if (!existsSync(root)) throw new Error('Vercel Functions output is missing');
visit(root);
console.log(JSON.stringify({ status: 'PASS', materializedPackages: copied }));
