// Complète le build Angular pour Cloudflare Pages : page 404, liens courts (_redirects) et sitemap.
// Lancé par `npm run build` (Node 22.18+ ou 24 : types TypeScript retirés nativement).
import { copyFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import site from '../src/app/data/site.config.json' with { type: 'json' };

const OUT = 'dist/synckai-app/browser';
const TRANSLATIONS = 'src/app/data/translations';

interface ShortLink {
  readonly path: string;
  readonly url: string;
}

const shortLinks: readonly ShortLink[] = [
  {
    path: '/chrome',
    url: `https://chromewebstore.google.com/detail/${site.stores.chromeExtensionId}`,
  },
  {
    path: '/firefox',
    // Tant que l'add-on n'est pas public, sa page est une 404 : on renvoie vers l'accueil.
    url: site.stores.firefoxPublished
      ? `https://addons.mozilla.org/firefox/addon/${site.stores.firefoxAddonSlug}/`
      : `${site.url}/`,
  },
  { path: '/github', url: site.repository },
  { path: '/privacy', url: site.privacyPolicy },
];

if (!existsSync(OUT)) {
  throw new Error(`${OUT} introuvable : lancer ng build d'abord.`);
}

// Cloudflare Pages sert 404.html pour toute URL inconnue : la coquille Angular y redirige vers la bonne langue.
copyFileSync(join(OUT, 'index.csr.html'), join(OUT, '404.html'));

// Redirections côté serveur (302 : la destination peut changer, les navigateurs ne la mettent pas en cache).
// Chaque lien court existe avec et sans barre finale.
writeFileSync(
  join(OUT, '_redirects'),
  shortLinks.flatMap(({ path, url }) => [`${path} ${url} 302`, `${path}/ ${url} 302`]).join('\n') +
    '\n',
);

const languages = readdirSync(TRANSLATIONS)
  .filter((file) => file.endsWith('.json'))
  .map((file) => file.replace(/\.json$/, ''))
  .sort((a, b) =>
    a === site.defaultLanguage ? -1 : b === site.defaultLanguage ? 1 : a.localeCompare(b),
  );

// Pages prérendues pour chaque langue, sans la langue : l'accueil et les nouveautés.
const PAGES: readonly string[] = ['', 'changelog/'];

const pageUrl = (code: string, page: string): string => `${site.url}/${code}/${page}`;
const urls = PAGES.flatMap((page) => {
  const alternates = languages
    .map(
      (code) =>
        `    <xhtml:link rel="alternate" hreflang="${code}" href="${pageUrl(code, page)}"/>`,
    )
    .join('\n');
  return languages.map(
    (code) => `  <url>\n    <loc>${pageUrl(code, page)}</loc>\n${alternates}\n  </url>`,
  );
}).join('\n');
writeFileSync(
  join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`,
);

console.log(
  `postbuild : 404.html, _redirects (${shortLinks.length} liens courts), sitemap (${PAGES.length} pages × ${languages.join(', ')})`,
);
