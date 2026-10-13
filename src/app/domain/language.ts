/** Code de langue tel qu'utilisé dans les URL : « en », « fr », « de »… */
export type LanguageCode = string;

export interface Language {
  readonly code: LanguageCode;
  readonly name: string;
}

/**
 * Choisit la langue à afficher : celle mémorisée par le visiteur si elle existe encore,
 * sinon la première langue du navigateur prise en charge (région ignorée), sinon la langue par défaut.
 */
export function pickLanguage(
  available: readonly LanguageCode[],
  browserLanguages: readonly string[],
  saved: string | null,
  fallback: LanguageCode,
): LanguageCode {
  if (saved && available.includes(saved)) {
    return saved;
  }
  for (const tag of browserLanguages) {
    const base = tag.toLowerCase().split('-')[0];
    if (available.includes(base)) {
      return base;
    }
  }
  return fallback;
}
