import { SiteConfig } from '@domain/site';
import config from './site.config.json';

/** Informations du site. Aussi lues par scripts/postbuild.mts pour les liens courts et le sitemap. */
export const SITE_CONFIG_DATA: SiteConfig = config;
