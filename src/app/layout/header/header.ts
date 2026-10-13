import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, LanguageCode } from '@domain/language';
import { NavText } from '@domain/translation';
import { ExternalLink } from '@shared/ui/external-link/external-link';
import { Icon, IconName } from '@shared/ui/icon/icon';
import { LanguageMenu } from '../language-menu/language-menu';

/** En-tête collant : logo, ancres vers les sections, liens GitHub et AniList, menu des langues. */
@Component({
  selector: 'sk-header',
  imports: [RouterLink, LanguageMenu, ExternalLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'sticky top-0 z-10 flex items-center gap-7 border-b border-violet/20 bg-night/85 px-[clamp(16px,4vw,40px)] py-3.5 backdrop-blur-md',
  },
  template: `
    <a
      [routerLink]="[]"
      fragment="main"
      class="absolute -left-[9999px] rounded-lg bg-moon px-3.5 py-2 text-night focus:top-4 focus:left-4"
      >{{ nav().skip }}</a
    >
    <a [routerLink]="['/', current()]" class="shrink-0">
      <img
        src="assets/kai-lockup-dark.svg"
        alt="SyncKai"
        width="162"
        height="40"
        class="h-10 w-auto max-sm:h-[34px]"
      />
    </a>
    <nav aria-label="SyncKai" class="ml-auto flex gap-6 max-[900px]:hidden">
      @for (link of links(); track link.fragment) {
        <a
          [routerLink]="[]"
          [fragment]="link.fragment"
          class="text-[15px] font-medium text-mist no-underline hover:text-moon"
          >{{ link.label }}</a
        >
      }
    </nav>
    <div class="flex items-center gap-1 max-[900px]:ml-auto">
      @for (link of profiles(); track link.url) {
        <a
          skExternal
          [href]="link.url"
          [attr.aria-label]="link.label"
          [title]="link.label"
          class="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[15px] font-medium text-mist no-underline hover:bg-violet/15 hover:text-moon"
        >
          <sk-icon [name]="link.icon" class="size-[18px]" />
          <span class="max-sm:hidden">{{ link.name }}</span>
        </a>
      }
    </div>
    <sk-language-menu
      [languages]="languages()"
      [current]="current()"
      [label]="nav().language"
      (picked)="languagePicked.emit($event)"
    />
  `,
})
export class Header {
  readonly nav = input.required<NavText>();
  readonly languages = input.required<readonly Language[]>();
  readonly current = input.required<LanguageCode>();
  readonly repositoryUrl = input.required<string>();
  readonly anilistUrl = input.required<string>();
  readonly languagePicked = output<LanguageCode>();

  // Liens vers d'autres sites : nom visible court, libellé complet pour les lecteurs d'écran.
  protected readonly profiles = computed(
    (): { url: string; name: string; label: string; icon: IconName }[] => [
      { url: this.repositoryUrl(), name: 'GitHub', label: this.nav().github, icon: 'code' },
      { url: this.anilistUrl(), name: 'AniList', label: this.nav().anilist, icon: 'profile' },
    ],
  );

  // Même ordre que les sections de la page (vérifié par landing-page.spec.ts).
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
