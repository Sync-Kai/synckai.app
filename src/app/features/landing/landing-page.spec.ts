import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserEnvironment } from '@core/platform/browser-environment';
import { ShareOutcome } from '@domain/device';
import { provideSiteData } from '@core/provide-site-data';
import fr from '@data/translations/fr.json';
import { LandingPage } from './landing-page';

describe('LandingPage', () => {
  function render(lang: string): HTMLElement {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideSiteData()] });
    const fixture = TestBed.createComponent(LandingPage);
    fixture.componentRef.setInput('lang', lang);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('liste les ancres du menu dans l’ordre des sections de la page', () => {
    const page = render('fr');
    const menu = Array.from(page.querySelectorAll('sk-header nav a')).map((a) =>
      new URL(a.getAttribute('href') ?? '', 'https://synckai.app').hash.slice(1),
    );
    const sections = Array.from(page.querySelectorAll('main [id]')).map((el) => el.id);
    expect(menu.length).toBeGreaterThan(0);
    expect(menu).toEqual(sections.filter((id) => menu.includes(id)));
  });

  it('chaque ancre du menu mène à une section qui existe', () => {
    const page = render('en');
    for (const anchor of Array.from(page.querySelectorAll('sk-header nav a'))) {
      const id = new URL(anchor.getAttribute('href') ?? '', 'https://synckai.app').hash.slice(1);
      expect(page.querySelector(`main #${id}`)).not.toBeNull();
    }
  });

  interface Visitor {
    readonly maxTouchPoints?: number;
    readonly share?: (url: string) => Promise<ShareOutcome>;
  }

  async function renderAs(userAgent: string, visitor: Visitor = {}): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideSiteData(),
        {
          provide: BrowserEnvironment,
          useValue: {
            userAgent,
            maxTouchPoints: visitor.maxTouchPoints ?? 0,
            shareLink: visitor.share ?? ((): Promise<ShareOutcome> => Promise.resolve('copied')),
            languages: [],
            prefersReducedMotion: true,
            readSavedLanguage: () => null,
            saveLanguage: () => undefined,
          } satisfies Partial<BrowserEnvironment>,
        },
      ],
    });
    const fixture = TestBed.createComponent(LandingPage);
    fixture.componentRef.setInput('lang', 'fr');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('prévient un visiteur Firefox que sa version est en validation', async () => {
    const page = await renderAs(
      'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
    );
    expect(page.querySelector('sk-hero')?.textContent).toContain(fr.hero.noteFirefoxPending);
  });

  it('garde la phrase habituelle pour les autres navigateurs', async () => {
    const page = await renderAs('Mozilla/5.0 Chrome/141.0 Safari/537.36');
    const hero = page.querySelector('sk-hero')?.textContent ?? '';
    expect(hero).toContain(fr.hero.note);
    expect(hero).not.toContain(fr.hero.noteFirefoxPending);
  });

  it('ne montre que Firefox à un visiteur Firefox', async () => {
    const page = await renderAs(
      'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0',
    );
    const hero = page.querySelector('sk-hero')!;
    expect(hero.querySelector('a[href*="chromewebstore"]')).toBeNull();
    expect(hero.textContent).toContain(fr.hero.firefoxPending);
  });

  it('ne montre que Chrome à un visiteur Chromium', async () => {
    const page = await renderAs(
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
    );
    const hero = page.querySelector('sk-hero')!;
    expect(hero.querySelector('a[href*="chromewebstore"]')).not.toBeNull();
    expect(hero.textContent).not.toContain(fr.hero.firefoxPending);
  });

  it('montre les deux quand le navigateur est inconnu', async () => {
    const page = await renderAs('Googlebot/2.1 (+http://www.google.com/bot.html)');
    const hero = page.querySelector('sk-hero')!;
    expect(hero.querySelector('a[href*="chromewebstore"]')).not.toBeNull();
    expect(hero.textContent).toContain(fr.hero.firefoxPending);
  });

  const iphone =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

  it('remplace les boutons d’installation par le message mobile', async () => {
    const page = await renderAs(iphone, { maxTouchPoints: 5 });
    expect(page.querySelectorAll('sk-store-buttons')).toHaveLength(0);
    expect(page.querySelectorAll('sk-desktop-only-notice')).toHaveLength(2);
    expect(page.querySelector('sk-hero')?.textContent).toContain(fr.mobile.text);
    expect(page.querySelector('sk-hero')?.textContent).not.toContain(fr.hero.note);
  });

  it('partage le lien de la page dans la langue du visiteur, puis confirme la copie', async () => {
    const shared: string[] = [];
    const page = await renderAs(iphone, {
      maxTouchPoints: 5,
      share: (url) => {
        shared.push(url);
        return Promise.resolve('copied');
      },
    });
    const button = page.querySelector<HTMLButtonElement>('sk-hero sk-desktop-only-notice button')!;
    button.click();
    await new Promise((resolve) => setTimeout(resolve));
    TestBed.tick();
    expect(shared).toEqual(['https://synckai.app/fr']);
    expect(button.textContent).toContain(fr.mobile.copied);
  });

  it('montre le lien à copier quand le navigateur ne sait ni partager ni copier', async () => {
    const page = await renderAs(iphone, {
      maxTouchPoints: 5,
      share: () => Promise.resolve('unavailable'),
    });
    page.querySelector<HTMLButtonElement>('sk-hero sk-desktop-only-notice button')!.click();
    await new Promise((resolve) => setTimeout(resolve));
    TestBed.tick();
    expect(page.querySelector('sk-hero')?.textContent).toContain('https://synckai.app/fr');
  });

  it('garde les boutons sur un ordinateur', async () => {
    const page = await renderAs(
      'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36',
      { maxTouchPoints: 10 },
    );
    expect(page.querySelectorAll('sk-desktop-only-notice')).toHaveLength(0);
    expect(page.querySelectorAll('sk-store-buttons')).toHaveLength(2);
  });
});
