import { LanguageCode } from './language';
import { ScreenshotSet } from './screenshot';
import { StoreListings } from './store';

/** Informations fixes sur le site et le projet. */
export interface SiteConfig {
  readonly url: string;
  readonly defaultLanguage: LanguageCode;
  readonly repository: string;
  readonly privacyPolicy: string;
  readonly changelog: string;
  readonly issues: string;
  readonly author: string;
  /** Profil AniList du créateur, lié depuis l'en-tête et le pied de page. */
  readonly authorAnilist: string;
  readonly year: number;
  readonly stores: StoreListings;
  readonly screenshots: ScreenshotSet;
}
