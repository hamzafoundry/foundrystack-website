// Writes the English page into dist/index.html so text appears before any JavaScript runs.
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const htmlPath = path.join(root, 'dist', 'index.html');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const { render } = await import(pathToFileURL(ssrEntry).href);
const html = readFileSync(htmlPath, 'utf8');
const placeholder = '<div id="root"></div>';

if (!html.includes(placeholder)) {
  console.error(`prerender: "${placeholder}" not found in dist/index.html`);
  process.exit(1);
}

const appHtml = render();
writeFileSync(htmlPath, html.replace(placeholder, `<div id="root">${appHtml}</div>`));
rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(0)} KB of HTML into dist/index.html`);
