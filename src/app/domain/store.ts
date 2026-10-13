import { StoreLocales } from './translation';

export type StoreId = 'chrome' | 'firefox';

/** Où l'extension est publiée. */
export interface StoreListings {
  readonly chromeExtensionId: string;
  readonly firefoxAddonSlug: string;
}

export interface StoreLink {
  readonly id: StoreId;
  readonly url: string;
}

/** Pages des stores dans la langue du visiteur, dans l'ordre d'affichage. */
export function storeLinks(listings: StoreListings, locales: StoreLocales): readonly StoreLink[] {
  return [
    {
      id: 'chrome',
      url: `https://chromewebstore.google.com/detail/${listings.chromeExtensionId}?hl=${locales.chrome}`,
    },
    {
      id: 'firefox',
      url: `https://addons.mozilla.org/${locales.amo}/firefox/addon/${listings.firefoxAddonSlug}/`,
    },
  ];
}

/** Le store adapté au navigateur du visiteur : Firefox Add-ons sur Firefox, sinon le Chrome Web Store. */
export function preferredStore(userAgent: string): StoreId {
  return /firefox|fxios/i.test(userAgent) ? 'firefox' : 'chrome';
}
