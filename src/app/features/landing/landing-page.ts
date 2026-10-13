import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { LanguageService } from '@core/i18n/language.service';
import { BrowserEnvironment } from '@core/platform/browser-environment';
import { SeoService } from '@core/seo/seo.service';
import { SITE_CONFIG } from '@core/tokens';
import { LanguageCode } from '@domain/language';
import { screenshotPath } from '@domain/screenshot';
import { StoreId, preferredStore, storeLinks } from '@domain/store';
import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';
import { ClosingCta } from './sections/closing-cta/closing-cta';
import { Faq } from './sections/faq/faq';
import { FeatureShowcase, ShowcaseItem } from './sections/feature-showcase/feature-showcase';
import { Hero } from './sections/hero/hero';
import { HowItWorks } from './sections/how-it-works/how-it-works';
import { Platforms } from './sections/platforms/platforms';
import { Privacy } from './sections/privacy/privacy';

/**
 * Page d'accueil d'une langue (/:lang). Seul composant « intelligent » de la page :
 * il lit la langue de l'URL, prépare les données et les passe aux sections, qui ne font qu'afficher.
 */
@Component({
  selector: 'sk-landing-page',
  imports: [Header, Footer, Hero, Platforms, HowItWorks, FeatureShowcase, Privacy, Faq, ClosingCta],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = translation();
    <sk-header
      [nav]="t.nav"
      [languages]="languages.languages"
      [current]="t.code"
      [repositoryUrl]="site.repository"
      [anilistUrl]="site.authorAnilist"
      (languagePicked)="languages.remember($event)"
    />
    <main id="main">
      <sk-hero
        [hero]="t.hero"
        [demo]="t.demo"
        [stores]="stores()"
        [storeLabels]="storeLabels()"
        [preferred]="preferred()"
      />
      <sk-platforms [text]="t.platforms" />
      <sk-how-it-works [title]="t.how.title" [steps]="t.how.steps" />
      <sk-feature-showcase
        [title]="t.features.title"
        [items]="showcase()"
        [moreTitle]="t.features.moreTitle"
        [more]="t.features.more"
      />
      <sk-privacy [text]="t.privacy" [policyUrl]="site.privacyPolicy" />
      <sk-faq [title]="t.faq.title" [items]="t.faq.items" />
      <sk-closing-cta
        [title]="t.cta.title"
        [text]="t.cta.text"
        [stores]="stores()"
        [storeLabels]="storeLabels()"
        [preferred]="preferred()"
      />
    </main>
    <sk-footer
      [text]="t.footer"
      [site]="site"
      [languages]="languages.languages"
      [current]="t.code"
      [languageLabel]="t.nav.language"
      (languagePicked)="languages.remember($event)"
    />
  `,
})
export class LandingPage {
  protected readonly languages = inject(LanguageService);
  protected readonly site = inject(SITE_CONFIG);
  private readonly seo = inject(SeoService);
  private readonly browser = inject(BrowserEnvironment);

  /** Code de langue issu de l'URL (liaison des paramètres de route). */
  readonly lang = input.required<LanguageCode>();

  protected readonly translation = computed(() => this.languages.translation(this.lang()));
  protected readonly stores = computed(() =>
    storeLinks(this.site.stores, this.translation().stores),
  );
  protected readonly storeLabels = computed((): Record<StoreId, string> => {
    const hero = this.translation().hero;
    const firefox = this.stores().find((link) => link.id === 'firefox');
    return {
      chrome: hero.chrome,
      firefox: firefox?.available ? hero.firefox : hero.firefoxPending,
    };
  });
  protected readonly showcase = computed((): ShowcaseItem[] => {
    const t = this.translation();
    return t.features.items.map((item) => ({
      title: item.title,
      text: item.text,
      image: screenshotPath(this.site.screenshots, t.code, item.shot),
    }));
  });

  // Chrome par défaut au prérendu ; le navigateur réel n'est connu qu'une fois la page chargée.
  protected readonly preferred = signal<StoreId>('chrome');

  constructor() {
    effect(() => this.seo.applyLanding(this.translation()));
    afterNextRender(() =>
      this.preferred.set(preferredStore(this.browser.userAgent, this.stores())),
    );
  }
}
