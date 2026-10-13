import { MobileText } from './translation';

/**
 * Vrai sur téléphone et tablette, où l'extension ne s'installe pas (SyncKai ne déclare pas Firefox pour Android).
 * iPadOS se présente comme un Mac de bureau : seul l'écran tactile le distingue.
 */
export function isMobileDevice(userAgent: string, maxTouchPoints: number): boolean {
  if (/android|iphone|ipod|mobi/i.test(userAgent)) {
    return true;
  }
  return /macintosh/i.test(userAgent) && maxTouchPoints > 1;
}

/** Issue d'un partage de lien : menu de partage du système, copie dans le presse-papiers, ou rien de possible. */
export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'unavailable';

/** Message affiché à la place des boutons d'installation sur mobile. */
export interface MobileNotice {
  readonly text: MobileText;
  /** Lien à s'envoyer pour installer plus tard sur ordinateur. */
  readonly url: string;
  /** Résultat du dernier partage, pour l'afficher sur le bouton ; null avant tout partage. */
  readonly state: ShareOutcome | null;
}
