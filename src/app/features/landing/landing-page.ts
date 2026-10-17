import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { RELEASES, SITE_CONFIG } from '@core/tokens';
import { MobileNotice, ShareOutcome, isMobileDevice } from '@domain/device';
import { LanguageCode } from '@domain/language';
import { localizeReleases } from '@domain/release';
import { screenshotPath } from '@domain/screenshot';
import {
  StoreId,
  browserFamily,
  preferredStore,
  storeLinks,
  visibleStores,
  visitorStorePending,
} from '@domain/store';
import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';
import { ClosingCta } from './sections/closing-cta/closing-cta';
import { Faq } from './sections/faq/faq';
import { FeatureShowcase, ShowcaseItem } from './sections/feature-showcase/feature-showcase';
import { Hero, WhatsNewBadge } from './sections/hero/hero';
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
      (languagePicked)="languages.remember($event)"
    />
    <main id="main">
      <sk-hero
        [hero]="t.hero"
        [note]="heroNote()"
        [whatsNew]="whatsNew()"
        [upcoming]="t.upcoming"
        [demo]="t.demo"
        [stores]="shownStores()"
        [storeLabels]="storeLabels()"
        [preferred]="preferred()"
        [mobileNotice]="mobileNotice()"
        (share)="shareLink()"
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
        [stores]="shownStores()"
        [storeLabels]="storeLabels()"
        [preferred]="preferred()"
        [mobileNotice]="mobileNotice()"
        (share)="shareLink()"
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly releases = inject(RELEASES);

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

  // Dernière version de l'extension, résumée dans la langue de la page.
  private readonly latestRelease = computed(
    () => localizeReleases(this.releases, this.translation().code, this.site.defaultLanguage)[0],
  );
  protected readonly whatsNew = computed((): WhatsNewBadge | null => {
    const release = this.latestRelease();
    const t = this.translation();
    return release
      ? {
          label: t.changelog.badge,
          version: release.version,
          title: release.title,
          route: ['/', t.code, 'changelog'],
        }
      : null;
  });

  // Navigateur du visiteur : inconnu au prérendu (chaîne vide), connu une fois la page chargée.
  private readonly userAgent = signal('');

  // Seul le store du navigateur du visiteur est proposé quand on le reconnaît ; les deux sinon (prérendu compris).
  protected readonly shownStores = computed(() => visibleStores(this.userAgent(), this.stores()));
  protected readonly preferred = computed(() => preferredStore(this.userAgent(), this.stores()));
  protected readonly heroNote = computed(() => {
    const hero = this.translation().hero;
    if (visitorStorePending(this.userAgent(), this.stores())) {
      return hero.noteFirefoxPending;
    }
    return browserFamily(this.userAgent()) === 'firefox' ? hero.noteFirefox : hero.note;
  });

  // Sur mobile, l'extension ne s'installe pas : un message propose de s'envoyer le lien à la place des boutons.
  private readonly maxTouchPoints = signal(0);
  private readonly shareState = signal<ShareOutcome | null>(null);
  private shareReset: ReturnType<typeof setTimeout> | undefined;
  protected readonly mobileNotice = computed((): MobileNotice | null => {
    if (!isMobileDevice(this.userAgent(), this.maxTouchPoints())) {
      return null;
    }
    const t = this.translation();
    return { text: t.mobile, url: `${this.site.url}/${t.code}`, state: this.shareState() };
  });

  constructor() {
    effect(() => this.seo.applyLanding(this.translation(), this.latestRelease()?.version));
    afterNextRender(() => {
      this.userAgent.set(this.browser.userAgent);
      this.maxTouchPoints.set(this.browser.maxTouchPoints);
    });
    this.destroyRef.onDestroy(() => clearTimeout(this.shareReset));
  }

  protected shareLink(): void {
    const url = this.mobileNotice()?.url;
    if (!url) {
      return;
    }
    void this.browser.shareLink(url).then((outcome) => {
      clearTimeout(this.shareReset);
      this.shareState.set(outcome === 'cancelled' ? null : outcome);
      // « Lien copié » revient à « Envoyer le lien » après quelques secondes.
      if (outcome === 'copied') {
        this.shareReset = setTimeout(() => this.shareState.set(null), 3000);
      }
    });
  }
}
