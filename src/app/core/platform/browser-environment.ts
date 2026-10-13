import { DOCUMENT, Injectable, inject } from '@angular/core';
import { ShareOutcome } from '@domain/device';

const LANGUAGE_KEY = 'synckai-lang';

/**
 * Accès au navigateur du visiteur. Chaque méthode est sûre pendant le prérendu,
 * où il n'y a pas de navigateur : elle renvoie alors une valeur neutre.
 */
@Injectable({ providedIn: 'root' })
export class BrowserEnvironment {
  private readonly window = inject(DOCUMENT).defaultView;

  get userAgent(): string {
    return this.window?.navigator?.userAgent ?? '';
  }

  get languages(): readonly string[] {
    const nav = this.window?.navigator;
    if (!nav) {
      return [];
    }
    return nav.languages?.length ? nav.languages : [nav.language ?? ''];
  }

  get prefersReducedMotion(): boolean {
    return this.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  /** Points de contact de l'écran : 0 sans écran tactile, et pendant le prérendu. */
  get maxTouchPoints(): number {
    return this.window?.navigator?.maxTouchPoints ?? 0;
  }

  /**
   * Partage un lien avec le menu du système (mobile), sinon le copie dans le presse-papiers.
   * Un partage refusé pour une autre raison qu'une annulation retombe sur la copie.
   */
  async shareLink(url: string): Promise<ShareOutcome> {
    const nav = this.window?.navigator;
    if (!nav) {
      return 'unavailable';
    }
    if (typeof nav.share === 'function') {
      try {
        await nav.share({ url });
        return 'shared';
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return 'cancelled';
        }
      }
    }
    try {
      await nav.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'unavailable';
    }
  }

  /** Langue choisie à la main lors d'une visite précédente, si le stockage du navigateur le permet. */
  readSavedLanguage(): string | null {
    try {
      return this.window?.localStorage.getItem(LANGUAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  saveLanguage(code: string): void {
    try {
      this.window?.localStorage.setItem(LANGUAGE_KEY, code);
    } catch {
      // Stockage bloqué (navigation privée, données effacées) : le choix n'est simplement pas mémorisé.
    }
  }
}
