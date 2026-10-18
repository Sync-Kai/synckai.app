import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { SeoService } from '@core/seo/seo.service';
import { RELEASES, SITE_CONFIG } from '@core/tokens';
import { KANA } from '@domain/kana';
import { LanguageCode } from '@domain/language';
import { formatReleaseDate, localizeReleases } from '@domain/release';
import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';
import { Eyebrow } from '@shared/ui/eyebrow/eyebrow';
import { ExternalLink } from '@shared/ui/external-link/external-link';
import { KanaSpine } from '@shared/ui/kana-spine/kana-spine';
import { DisplayedRelease, ReleaseList } from './release-list/release-list';

/**
 * Page des nouveautés d'une langue (/:lang/changelog) : les versions de l'extension en quelques phrases,
 * puis un lien vers le journal technique complet sur GitHub.
 */
@Component({
  selector: 'sk-changelog-page',
  imports: [Header, Footer, ReleaseList, ExternalLink, Eyebrow, KanaSpine],
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
    <main id="main" class="pb-30">
      <div class="relative overflow-hidden border-b border-line">
        <sk-kana-spine [kana]="kana" />
        <div
          class="py-[clamp(48px,7vw,88px)] pr-[clamp(16px,4vw,40px)] pl-[max(148px,calc(50%-560px))] max-[900px]:pl-[60px]"
        >
          <sk-eyebrow [label]="t.changelog.eyebrow" [kana]="kana" />
          <h1 class="mt-5 text-[clamp(36px,4.8vw,54px)]">{{ t.changelog.title }}</h1>
          <span class="mt-[26px] block h-[3px] w-14 rounded-sm bg-line" aria-hidden="true"></span>
          <p class="mt-[22px] max-w-[34em] text-[19px] text-muted">{{ t.changelog.lead }}</p>
        </div>
      </div>
      <div class="section-wrap">
        <sk-release-list class="mt-4" [releases]="releases()" />
        <p class="border-t border-line pt-9">
          <a
            skExternal
            [href]="site.changelog"
            class="font-extrabold text-lavender hover:underline"
            >{{ t.changelog.full }}</a
          >
        </p>
      </div>
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
  protected readonly kana = KANA.changelog;

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
