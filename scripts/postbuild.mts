// Complète le build Angular pour GitHub Pages : page 404, liens courts et sitemap.
// Lancé par `npm run build` (Node 22.18+ ou 24 : types TypeScript retirés nativement).
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import site from '../src/app/data/site.config.json' with { type: 'json' };

const OUT = 'dist/synckai-app/browser';
const TRANSLATIONS = 'src/app/data/translations';

interface ShortLink {
  readonly path: string;
  readonly url: string;
  readonly label: string;
}

const shortLinks: readonly ShortLink[] = [
  {
    path: 'chrome',
    url: `https://chromewebstore.google.com/detail/${site.stores.chromeExtensionId}`,
    label: 'SyncKai, Chrome Web Store',
  },
  {
    path: 'firefox',
    url: `https://addons.mozilla.org/firefox/addon/${site.stores.firefoxAddonSlug}/`,
    label: 'SyncKai, Firefox Add-ons',
  },
  { path: 'github', url: site.repository, label: 'SyncKai on GitHub' },
  { path: 'privacy', url: site.privacyPolicy, label: 'SyncKai privacy policy' },
];

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const redirectPage = ({ url, label }: ShortLink): string => `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(label)}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${escapeHtml(url)}">
<meta http-equiv="refresh" content="0; url=${escapeHtml(url)}">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#141a3d;color:#eef0ff;font:16px/1.5 system-ui,sans-serif}a{color:#46d6ff}</style>
</head>
<body><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></body>
</html>
`;

if (!existsSync(OUT)) {
  throw new Error(`${OUT} introuvable : lancer ng build d'abord.`);
}

// GitHub Pages sert 404.html pour toute URL inconnue : la coquille Angular y redirige vers la bonne langue.
copyFileSync(join(OUT, 'index.csr.html'), join(OUT, '404.html'));

for (const link of shortLinks) {
  mkdirSync(join(OUT, link.path), { recursive: true });
  writeFileSync(join(OUT, link.path, 'index.html'), redirectPage(link));
}

const languages = readdirSync(TRANSLATIONS)
  .filter((file) => file.endsWith('.json'))
  .map((file) => file.replace(/\.json$/, ''))
  .sort((a, b) =>
    a === site.defaultLanguage ? -1 : b === site.defaultLanguage ? 1 : a.localeCompare(b),
  );

const alternates = languages
  .map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${site.url}/${code}/"/>`)
  .join('\n');
const urls = languages
  .map((code) => `  <url>\n    <loc>${site.url}/${code}/</loc>\n${alternates}\n  </url>`)
  .join('\n');
writeFileSync(
  join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
);

console.log(
  `postbuild : 404.html, ${shortLinks.length} liens courts, sitemap (${languages.join(', ')})`,
);
