import { Injectable, inject } from '@angular/core';
import { Language, LanguageCode, pickLanguage } from '@domain/language';
import { Translation } from '@domain/translation';
import { BrowserEnvironment } from '../platform/browser-environment';
import { SITE_CONFIG, TRANSLATIONS } from '../tokens';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translations = inject(TRANSLATIONS);
  private readonly site = inject(SITE_CONFIG);
  private readonly browser = inject(BrowserEnvironment);

  /** Langues disponibles, langue par défaut en premier. */
  readonly languages: readonly Language[] = this.translations.map(({ code, name }) => ({
    code,
    name,
  }));

  readonly codes: readonly LanguageCode[] = this.languages.map((l) => l.code);

  has(code: string | undefined | null): code is LanguageCode {
    return !!code && this.codes.includes(code);
  }

  /** Textes d'une langue, ou ceux de la langue par défaut si elle n'existe pas. */
  translation(code: LanguageCode): Translation {
    return (
      this.translations.find((t) => t.code === code) ??
      this.translations.find((t) => t.code === this.site.defaultLanguage) ??
      this.translations[0]
    );
  }

  /** Langue à ouvrir pour ce visiteur (choix mémorisé, langues du navigateur, défaut). */
  detect(): LanguageCode {
    return pickLanguage(
      this.codes,
      this.browser.languages,
      this.browser.readSavedLanguage(),
      this.site.defaultLanguage,
    );
  }

  /** Mémorise une langue choisie à la main par le visiteur. */
  remember(code: LanguageCode): void {
    if (this.has(code)) {
      this.browser.saveLanguage(code);
    }
  }
}
