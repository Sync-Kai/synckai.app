import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, LanguageCode } from '@domain/language';
import { SiteConfig } from '@domain/site';
import { FooterText } from '@domain/translation';
import { ExternalLink } from '@shared/ui/external-link/external-link';

/** Pied de page : liens du projet, langues, avertissement et licence. */
@Component({
  selector: 'sk-footer',
  imports: [RouterLink, ExternalLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block border-t border-ink-line px-[clamp(16px,4vw,40px)] pt-9 pb-12 text-sm text-mist',
  },
  template: `
    <div class="mx-auto max-w-wrap space-y-3.5">
      <nav [attr.aria-label]="text().source" class="flex flex-wrap gap-x-6 gap-y-2">
        @for (link of links(); track link.url) {
          <a skExternal [href]="link.url" class="no-underline hover:text-moon hover:underline">{{
            link.label
          }}</a>
        }
      </nav>
      <nav [attr.aria-label]="languageLabel()" class="flex flex-wrap gap-x-6 gap-y-2">
        @for (language of languages(); track language.code) {
          <a
            [routerLink]="['/', language.code]"
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
  readonly languagePicked = output<LanguageCode>();

  protected readonly links = computed(() => {
    const text = this.text();
    const site = this.site();
    return [
      { url: site.repository, label: text.source },
      { url: site.issues, label: text.issues },
      { url: site.changelog, label: text.changelog },
      { url: site.privacyPolicy, label: text.privacy },
    ];
  });
}
