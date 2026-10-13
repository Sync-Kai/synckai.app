import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { TRANSLATIONS } from '@core/tokens';

/** Toutes les pages sont prérendues en HTML statique ; les URL inconnues sont rendues côté client (404.html). */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(inject(TRANSLATIONS).map((t) => ({ lang: t.code }))),
  },
  { path: '**', renderMode: RenderMode.Client },
];
