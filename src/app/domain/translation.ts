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
  readonly cta: CtaText;
  readonly mobile: MobileText;
  readonly changelog: ChangelogText;
  readonly footer: FooterText;
}

/** Page des nouveautés (/<langue>/changelog) et badge du hero qui y mène. */
/** Appel final de l'accueil. */
export interface CtaText {
  /** Surtitre, à côté du kana ツヅキ. */
  readonly eyebrow: string;
  /** Titre ; les mots entre astérisques sont mis en avant. */
  readonly title: string;
  readonly text: string;
}

export interface ChangelogText {
  readonly metaTitle: string;
  readonly metaDescription: string;
  /** Surtitre, à côté du kana コウシン. */
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  /** Étiquette du badge du hero, devant le numéro de version (ex. « Nouveau »). */
  readonly badge: string;
  /** Lien vers le journal technique complet de l'extension. */
  readonly full: string;
}

/** Message pour les visiteurs sur mobile, où l'extension ne s'installe pas. */
export interface MobileText {
  readonly text: string;
  /** Bouton qui ouvre le menu de partage (ou copie le lien). */
  readonly share: string;
  /** Bouton une fois le lien copié. */
  readonly copied: string;
  /** Invite à copier le lien à la main quand ni le partage ni la copie ne sont possibles. */
  readonly manual: string;
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
  /** Surtitre, à côté du kana ジドウ. */
  readonly eyebrow: string;
  /** Titre ; les mots entre astérisques sont mis en avant. */
  readonly title: string;
  readonly lead: string;
  readonly chrome: string;
  readonly firefox: string;
  /** Affiché à la place du bouton tant que l'add-on Firefox n'est pas public. */
  readonly firefoxPending: string;
  readonly note: string;
  /** Remplace `note` pour un visiteur sous Firefox : la mention des navigateurs Chromium ne le concerne pas. */
  readonly noteFirefox: string;
  /** Remplace `note` pour un visiteur sous Firefox tant que l'add-on attend la validation de Mozilla. */
  readonly noteFirefoxPending: string;
}

export interface DemoText {
  readonly label: string;
  readonly series: string;
  readonly season: string;
  readonly episode: string;
  readonly credits: string;
  readonly roll: readonly string[];
  /** Titre de la bulle (« Épisode 8 enregistré »), comme dans l'extension. */
  readonly saved: string;
  /** Ligne des services de la bulle (« AniList et MyAnimeList »). */
  readonly services: string;
  /** État des services, après leurs noms (« enregistré »). */
  readonly status: string;
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
  /** Surtitre du bloc (« Panneau latéral »), à côté du kana de la capture. */
  readonly eyebrow: string;
  /** Nom de la capture, sans extension, dans assets/store/<version>/<langue>/. */
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
