import { shareImagePath } from './screenshot';
import { SiteConfig } from './site';
import { storeLinks } from './store';
import { Translation } from './translation';

/** Valeur JSON-LD : ce que JSON.stringify sait écrire tel quel. */
export type JsonLdValue = string | number | boolean | readonly JsonLdValue[] | JsonLd;

// Interface (et non Record) : un alias de type ne peut pas se référencer lui-même à travers Record.
export interface JsonLd {
  readonly [key: string]: JsonLdValue;
}

/**
 * Données structurées schema.org de l'extension, pour les moteurs de recherche.
 * Seuls les stores déjà publics sont donnés comme liens d'installation.
 * Doc : https://developers.google.com/search/docs/appearance/structured-data/software-app
 */
export function softwareApplicationSchema(
  site: SiteConfig,
  t: Translation,
  pageUrl: string,
  version?: string,
): JsonLd {
  const installUrls = storeLinks(site.stores, t.stores)
    .filter((link) => link.available)
    .map((link) => link.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SyncKai',
    description: t.meta.description,
    url: pageUrl,
    inLanguage: t.code,
    image: `${site.url}/${shareImagePath(site.screenshots)}`,
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Windows, macOS, Linux, ChromeOS',
    ...(version ? { softwareVersion: version } : {}),
    installUrl: installUrls,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    license: 'https://opensource.org/licenses/MIT',
    author: { '@type': 'Person', name: site.author, url: site.authorAnilist },
    sameAs: [site.repository],
  };
}

/** JSON à placer dans un <script> : « < » est échappé pour qu'aucun texte ne puisse fermer la balise. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
