import { StoreLocales } from './translation';

export type StoreId = 'chrome' | 'firefox';

/** Où l'extension est publiée, et si chaque fiche est déjà visible du public. */
export interface StoreListings {
  readonly chromeExtensionId: string;
  readonly firefoxAddonSlug: string;
  /** Faux tant que Mozilla n'a pas validé l'add-on : sa page renvoie alors une erreur 404. */
  readonly firefoxPublished: boolean;
}

export interface StoreLink {
  readonly id: StoreId;
  readonly url: string;
  /** Faux si la fiche n'est pas encore publique : pas de lien, seulement une mention « bientôt ». */
  readonly available: boolean;
}

/** Pages des stores dans la langue du visiteur, dans l'ordre d'affichage. */
export function storeLinks(listings: StoreListings, locales: StoreLocales): readonly StoreLink[] {
  return [
    {
      id: 'chrome',
      url: `https://chromewebstore.google.com/detail/${listings.chromeExtensionId}?hl=${locales.chrome}`,
      available: true,
    },
    {
      id: 'firefox',
      url: `https://addons.mozilla.org/${locales.amo}/firefox/addon/${listings.firefoxAddonSlug}/`,
      available: listings.firefoxPublished,
    },
  ];
}

/** Le store dont dépend le navigateur du visiteur : Firefox Add-ons sur Firefox, sinon le Chrome Web Store. */
export function visitorStore(userAgent: string): StoreId {
  return /firefox|fxios/i.test(userAgent) ? 'firefox' : 'chrome';
}

/**
 * Le store à mettre en avant : celui du navigateur du visiteur s'il est disponible,
 * sinon le premier store disponible.
 */
export function preferredStore(userAgent: string, links: readonly StoreLink[]): StoreId {
  const wanted = visitorStore(userAgent);
  const available = links.filter((link) => link.available);
  return available.some((link) => link.id === wanted) ? wanted : (available[0]?.id ?? wanted);
}

/** Vrai si le store du navigateur du visiteur existe mais n'est pas encore public (ex. Firefox en validation). */
export function visitorStorePending(userAgent: string, links: readonly StoreLink[]): boolean {
  const wanted = visitorStore(userAgent);
  return links.some((link) => link.id === wanted && !link.available);
}
