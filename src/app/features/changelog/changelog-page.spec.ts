import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideSiteData } from '@core/provide-site-data';
import releases from '@data/releases.json';
import fr from '@data/translations/fr.json';
import { ChangelogPage } from './changelog-page';

describe('ChangelogPage', () => {
  function render(lang: string): HTMLElement {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideSiteData()] });
    const fixture = TestBed.createComponent(ChangelogPage);
    fixture.componentRef.setInput('lang', lang);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('liste chaque version dans la langue de la page, la plus récente d’abord', () => {
    const page = render('fr');
    const versions = Array.from(page.querySelectorAll('article')).map((a) => a.id);
    expect(versions).toEqual(releases.map((r) => `v${r.version}`));
    expect(page.querySelector('article h2')?.textContent).toContain(releases[0].text.fr.title);
    expect(page.querySelector('h1')?.textContent).toContain(fr.changelog.title);
  });

  it('mène au journal technique complet, dans un nouvel onglet', () => {
    const link = render('fr').querySelector<HTMLAnchorElement>(
      'main a[href="https://github.com/Sync-Kai/SyncKai/blob/main/CHANGELOG.md"]',
    );
    expect(link?.textContent).toContain(fr.changelog.full);
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('garde les ancres du menu vers les sections de l’accueil', () => {
    const anchors = Array.from(render('fr').querySelectorAll('sk-header nav a'));
    expect(anchors.length).toBeGreaterThan(0);
    for (const anchor of anchors) {
      expect(anchor.getAttribute('href')).toMatch(/^\/fr#\w+$/);
    }
  });

  it('change de langue en restant sur les nouveautés', () => {
    const links = Array.from(render('fr').querySelectorAll('sk-footer a[hreflang]')).map((a) =>
      a.getAttribute('href'),
    );
    expect(links).toEqual(['/en/changelog', '/fr/changelog', '/de/changelog']);
  });

  it('se décrit aux moteurs de recherche, avec ses variantes de langue', () => {
    render('de');
    expect(document.title).toBe('Neuigkeiten bei SyncKai');
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://synckai.app/de/changelog/',
    );
    expect(document.head.querySelector('link[hreflang="x-default"]')?.getAttribute('href')).toBe(
      'https://synckai.app/en/changelog/',
    );
    expect(document.head.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});
