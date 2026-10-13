import { Routes } from '@angular/router';
import { knownLanguage } from '@core/i18n/known-language.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@features/language-redirect/language-redirect').then((m) => m.LanguageRedirect),
  },
  {
    path: ':lang/changelog',
    canMatch: [knownLanguage],
    loadComponent: () => import('@features/changelog/changelog-page').then((m) => m.ChangelogPage),
  },
  {
    path: ':lang',
    canMatch: [knownLanguage],
    loadComponent: () => import('@features/landing/landing-page').then((m) => m.LandingPage),
  },
  {
    path: '**',
    loadComponent: () =>
      import('@features/language-redirect/language-redirect').then((m) => m.LanguageRedirect),
  },
];
