import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, LanguageCode } from '@domain/language';
import { SiteConfig } from '@domain/site';
import { FooterText } from '@domain/translation';
import { ExternalLink } from '@shared/ui/external-link/external-link';
import { Icon, IconName } from '@shared/ui/icon/icon';

/** Pied de page : liens du projet, langues, avertissement et licence. */
@Component({
  selector: 'sk-footer',
  imports: [RouterLink, ExternalLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-t border-ink-line px-[clamp(16px,4vw,40px)] pt-9 pb-12 text-sm text-mist',
  },
  template: `
    <div class="mx-auto max-w-wrap space-y-3.5">
      <nav [attr.aria-label]="text().source" class="flex flex-wrap gap-x-6 gap-y-2">
        @for (link of links(); track link.label) {
          @if (link.route) {
            <a
              [routerLink]="link.route"
              class="inline-flex items-center gap-1.5 no-underline hover:text-moon hover:underline"
              >{{ link.label }}</a
            >
          } @else {
            <a
              skExternal
              [href]="link.url"
              class="inline-flex items-center gap-1.5 no-underline hover:text-moon hover:underline"
            >
              @if (link.icon) {
                <sk-icon [name]="link.icon" class="size-4" />
              }
              {{ link.label }}
            </a>
          }
        }
      </nav>
      <nav [attr.aria-label]="languageLabel()" class="flex flex-wrap gap-x-6 gap-y-2">
        @for (language of languages(); track language.code) {
          <a
            [routerLink]="['/', language.code, ...page()]"
            [attr.hreflang]="language.code"
            [attr.lang]="language.code"
            [attr.aria-current]="language.code === current() ? 'true' : null"
            class="no-underline hover:text-moon aria-[current]:text-cyan"
            (click)="languagePicked.emit(language.code)"
            >{{ language.name }}</a
          >
        }
      </nav>
      <p>{{ text().disclaimer }}</p>
      <p>MIT © {{ site().year }} {{ site().author }}</p>
    </div>
  `,
})
export class Footer {
  readonly text = input.required<FooterText>();
  readonly site = input.required<SiteConfig>();
  readonly languages = input.required<readonly Language[]>();
  readonly current = input.required<LanguageCode>();
  readonly languageLabel = input.required<string>();
  /** Page affichée, sans la langue : les liens de langue restent sur cette page. */
  readonly page = input<readonly string[]>([]);
  readonly languagePicked = output<LanguageCode>();

  // Liens vers d'autres sites (nouvel onglet), sauf les Nouveautés, page du site.
  protected readonly links = computed((): FooterLink[] => {
    const text = this.text();
    const site = this.site();
    return [
      { url: site.repository, label: text.source, icon: 'code' },
      { url: site.authorAnilist, label: text.creator, icon: 'profile' },
      { url: site.issues, label: text.issues },
      { route: ['/', this.current(), 'changelog'], label: text.changelog },
      { url: site.privacyPolicy, label: text.privacy },
    ];
  });
}

interface FooterLink {
  readonly label: string;
  readonly url?: string;
  /** Page du site, ouverte dans le même onglet. */
  readonly route?: readonly string[];
  readonly icon?: IconName;
}
