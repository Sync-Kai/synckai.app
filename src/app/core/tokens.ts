import { InjectionToken } from '@angular/core';
import { SiteConfig } from '@domain/site';
import { Translation } from '@domain/translation';

/** Informations du site (URL, dépôt, fiches des stores). Fourni par `provideSiteData()`. */
export const SITE_CONFIG = new InjectionToken<SiteConfig>('SITE_CONFIG');

/** Toutes les traductions disponibles, langue par défaut en premier. Fourni par `provideSiteData()`. */
export const TRANSLATIONS = new InjectionToken<readonly Translation[]>('TRANSLATIONS');
