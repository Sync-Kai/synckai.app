import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, LanguageCode } from '@domain/language';
import { NavText } from '@domain/translation';
import { Lockup } from '@shared/ui/lockup/lockup';
import { LanguageMenu } from '../language-menu/language-menu';

/**
 * En-tête collant : logo, ancres vers les sections et menu des langues.
 * Les liens vers d'autres sites (GitHub, AniList) restent dans le pied de page, pour garder l'en-tête centré sur la page.
 */
@Component({
  selector: 'sk-header',
  imports: [RouterLink, Lockup, LanguageMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'sticky top-0 z-10 flex items-center gap-7 border-b border-line bg-ground/85 px-[clamp(16px,4vw,40px)] py-3.5 backdrop-blur-md',
  },
  template: `
    <a
      [routerLink]="[]"
      fragment="main"
      class="absolute -left-[9999px] rounded-lg bg-ink px-3.5 py-2 text-ground focus:top-4 focus:left-4"
      >{{ nav().skip }}</a
    >
    <a [routerLink]="['/', current()]" class="shrink-0 no-underline" aria-label="SyncKai">
      <sk-lockup />
    </a>
    <nav aria-label="SyncKai" class="ml-auto flex gap-6 max-[900px]:hidden">
      @for (link of links(); track link.fragment) {
        <a
          [routerLink]="['/', current()]"
          [fragment]="link.fragment"
          class="text-[15px] font-bold text-muted no-underline hover:text-ink"
          >{{ link.label }}</a
        >
      }
    </nav>
    <sk-language-menu
      class="max-[900px]:ml-auto"
      [languages]="languages()"
      [current]="current()"
      [label]="nav().language"
      [page]="page()"
      (picked)="languagePicked.emit($event)"
    />
  `,
})
export class Header {
  readonly nav = input.required<NavText>();
  readonly languages = input.required<readonly Language[]>();
  readonly current = input.required<LanguageCode>();
  /** Page affichée, sans la langue : le menu des langues reste sur cette page. */
  readonly page = input<readonly string[]>([]);
  readonly languagePicked = output<LanguageCode>();

  // Même ordre que les sections de l'accueil (vérifié par landing-page.spec.ts).
  // Les ancres visent l'accueil de la langue, pour marcher aussi depuis les autres pages.
  protected readonly links = computed(() => {
    const nav = this.nav();
    return [
      { fragment: 'how', label: nav.how },
      { fragment: 'features', label: nav.features },
      { fragment: 'privacy', label: nav.privacy },
      { fragment: 'faq', label: nav.faq },
    ];
  });
}
