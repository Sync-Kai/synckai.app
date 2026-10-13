import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { SeoService } from '@core/seo/seo.service';
import { RELEASES, SITE_CONFIG } from '@core/tokens';
import { LanguageCode } from '@domain/language';
import { formatReleaseDate, localizeReleases } from '@domain/release';
import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';
import { ExternalLink } from '@shared/ui/external-link/external-link';
import { DisplayedRelease, ReleaseList } from './release-list/release-list';

/**
 * Page des nouveautés d'une langue (/:lang/changelog) : les versions de l'extension en quelques phrases,
 * puis un lien vers le journal technique complet sur GitHub.
 */
@Component({
  selector: 'sk-changelog-page',
  imports: [Header, Footer, ReleaseList, ExternalLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = translation();
    <sk-header
      [nav]="t.nav"
      [languages]="languages.languages"
      [current]="t.code"
      [page]="page"
      (languagePicked)="languages.remember($event)"
    />
    <main id="main" class="section-wrap pt-[clamp(48px,8vw,96px)] pb-30">
      <h1 class="text-[clamp(36px,4.8vw,54px)]">{{ t.changelog.title }}</h1>
      <p class="mt-[18px] max-w-[34em] text-[19px] text-mist">{{ t.changelog.lead }}</p>
      <sk-release-list class="mt-12" [releases]="releases()" />
      <p class="border-t border-ink-line pt-9">
        <a skExternal [href]="site.changelog" class="text-cyan hover:underline">{{
          t.changelog.full
        }}</a>
      </p>
    </main>
    <sk-footer
      [text]="t.footer"
      [site]="site"
      [languages]="languages.languages"
      [current]="t.code"
      [languageLabel]="t.nav.language"
      [page]="page"
      (languagePicked)="languages.remember($event)"
    />
  `,
})
export class ChangelogPage {
  protected readonly languages = inject(LanguageService);
  protected readonly site = inject(SITE_CONFIG);
  private readonly allReleases = inject(RELEASES);
  private readonly seo = inject(SeoService);

  /** Code de langue issu de l'URL (liaison des paramètres de route). */
  readonly lang = input.required<LanguageCode>();

  /** Chemin de la page sans la langue, pour que les liens de langue restent ici. */
  protected readonly page: readonly string[] = ['changelog'];

  protected readonly translation = computed(() => this.languages.translation(this.lang()));
  protected readonly releases = computed((): DisplayedRelease[] => {
    const code = this.translation().code;
    return localizeReleases(this.allReleases, code, this.site.defaultLanguage).map((release) => ({
      ...release,
      displayDate: formatReleaseDate(release.date, code),
    }));
  });

  constructor() {
    effect(() => this.seo.applyChangelog(this.translation()));
  }
}
