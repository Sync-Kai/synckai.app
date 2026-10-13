import { DOCUMENT, Injectable, inject } from '@angular/core';

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
