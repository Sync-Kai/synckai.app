import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { LanguageService } from './language.service';

/** N'accepte la route que si son premier segment est une langue disponible. */
export const knownLanguage: CanMatchFn = (_route, segments) =>
  inject(LanguageService).has(segments[0]?.path);
