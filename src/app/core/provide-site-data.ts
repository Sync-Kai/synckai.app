import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { RELEASE_DATA } from '@data/releases';
import { SITE_CONFIG_DATA } from '@data/site.config';
import { TRANSLATION_DATA } from '@data/translations';
import { RELEASES, SITE_CONFIG, TRANSLATIONS } from './tokens';

/**
 * Branche la couche data sur l'application. C'est le seul endroit qui sait d'où viennent
 * les textes et réglages du site : il suffit de changer ces valeurs pour les charger ailleurs.
 */
export function provideSiteData(): EnvironmentProviders {
  const byDefaultFirst = [...TRANSLATION_DATA].sort((a, b) =>
    a.code === SITE_CONFIG_DATA.defaultLanguage
      ? -1
      : b.code === SITE_CONFIG_DATA.defaultLanguage
        ? 1
        : 0,
  );
  return makeEnvironmentProviders([
    { provide: SITE_CONFIG, useValue: SITE_CONFIG_DATA },
    { provide: TRANSLATIONS, useValue: byDefaultFirst },
    { provide: RELEASES, useValue: RELEASE_DATA },
  ]);
}
