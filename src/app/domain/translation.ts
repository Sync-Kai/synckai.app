import { LanguageCode } from './language';

/** Tous les textes du site dans une langue. Chaque fichier de data/translations doit respecter ce contrat. */
export interface Translation {
  readonly code: LanguageCode;
  /** Nom de la langue dans cette langue, affiché dans le menu (ex. « Français »). */
  readonly name: string;
  /** Codes de langue utilisés par les stores pour cette langue. */
  readonly stores: StoreLocales;
  readonly meta: { readonly title: string; readonly description: string };
  readonly nav: NavText;
  readonly hero: HeroText;
  readonly demo: DemoText;
  readonly platforms: PlatformsText;
  readonly how: { readonly title: string; readonly steps: readonly TextBlock[] };
  readonly features: FeaturesText;
  readonly privacy: PrivacyText;
  readonly faq: { readonly title: string; readonly items: readonly FaqItem[] };
  readonly cta: { readonly title: string; readonly text: string };
  readonly footer: FooterText;
}

export interface StoreLocales {
  readonly chrome: string;
  readonly amo: string;
}

export interface NavText {
  readonly features: string;
  readonly how: string;
  readonly privacy: string;
  readonly faq: string;
  readonly language: string;
  readonly skip: string;
}

export interface HeroText {
  readonly title: string;
  readonly lead: string;
  readonly chrome: string;
  readonly firefox: string;
  /** Affiché à la place du bouton tant que l'add-on Firefox n'est pas public. */
  readonly firefoxPending: string;
  readonly note: string;
}

export interface DemoText {
  readonly label: string;
  readonly series: string;
  readonly season: string;
  readonly episode: string;
  readonly credits: string;
  readonly roll: readonly string[];
  readonly list: string;
  readonly saved: string;
  readonly replay: string;
}

export interface PlatformsText {
  readonly watch: string;
  readonly list: string;
  readonly optional: string;
}

export interface TextBlock {
  readonly title: string;
  readonly text: string;
}

export interface FeatureItem extends TextBlock {
  /** Nom de la capture, sans extension, dans assets/shots/<langue>/. */
  readonly shot: string;
}

export interface FeaturesText {
  readonly title: string;
  readonly items: readonly FeatureItem[];
  readonly moreTitle: string;
  readonly more: readonly string[];
}

export interface PrivacyText {
  readonly title: string;
  readonly text: string;
  readonly points: readonly string[];
  readonly link: string;
}

export interface FaqItem {
  readonly q: string;
  readonly a: string;
}

export interface FooterText {
  readonly source: string;
  readonly creator: string;
  readonly issues: string;
  readonly changelog: string;
  readonly privacy: string;
  readonly disclaimer: string;
}
