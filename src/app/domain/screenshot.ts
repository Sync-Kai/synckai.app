import { LanguageCode } from './language';

/**
 * Jeu d'images du store (captures et image de partage) : le dossier assets/store/<version>/,
 * avec les langues pour lesquelles des captures existent et celle utilisée à défaut.
 */
export interface ScreenshotSet {
  /**
   * Version de l'extension dont viennent les images. Un nouveau jeu va dans un nouveau dossier,
   * jamais à la place de l'ancien : /assets/* est mis en cache 7 jours (public/_headers), par Cloudflare
   * comme par les navigateurs, et une image remplacée sous le même nom resterait l'ancienne.
   */
  readonly version: string;
  readonly languages: readonly LanguageCode[];
  readonly fallback: LanguageCode;
}

/** Chemin d'une capture dans la langue demandée, ou dans la langue de repli si elle n'existe pas. */
export function screenshotPath(set: ScreenshotSet, language: LanguageCode, shot: string): string {
  const folder = set.languages.includes(language) ? language : set.fallback;
  return `assets/store/${set.version}/${folder}/${shot}.webp`;
}

/** Image de partage (Open Graph, données structurées) : la grande tuile promo du même jeu. */
export function shareImagePath(set: ScreenshotSet): string {
  return `assets/store/${set.version}/og.png`;
}
