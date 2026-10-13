import { LanguageCode } from './language';

/** Langues pour lesquelles des captures existent, et celle utilisée à défaut. */
export interface ScreenshotSet {
  readonly languages: readonly LanguageCode[];
  readonly fallback: LanguageCode;
}

/** Chemin d'une capture dans la langue demandée, ou dans la langue de repli si elle n'existe pas. */
export function screenshotPath(set: ScreenshotSet, language: LanguageCode, shot: string): string {
  const folder = set.languages.includes(language) ? language : set.fallback;
  return `assets/shots/${folder}/${shot}.webp`;
}
