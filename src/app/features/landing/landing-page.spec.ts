import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserEnvironment } from '@core/platform/browser-environment';
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

  async function renderAs(userAgent: string): Promise<HTMLElement> {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideSiteData(),
        {
          provide: BrowserEnvironment,
          useValue: {
            userAgent,
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
});
