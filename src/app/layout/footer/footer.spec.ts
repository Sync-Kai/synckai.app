import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import en from '@data/translations/en.json';
import { SITE_CONFIG_DATA } from '@data/site.config';
import { Footer } from './footer';

describe('Footer', () => {
  it('lie le dépôt GitHub et le profil AniList du créateur, dans un nouvel onglet', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Footer);
    fixture.componentRef.setInput('text', en.footer);
    fixture.componentRef.setInput('site', SITE_CONFIG_DATA);
    fixture.componentRef.setInput('languages', [{ code: 'en', name: 'English' }]);
    fixture.componentRef.setInput('current', 'en');
    fixture.componentRef.setInput('languageLabel', en.nav.language);
    fixture.detectChanges();
    const footer = fixture.nativeElement as HTMLElement;

    for (const url of [SITE_CONFIG_DATA.repository, SITE_CONFIG_DATA.authorAnilist]) {
      const link = footer.querySelector(`a[href="${url}"]`);
      expect(link).not.toBeNull();
      expect(link?.getAttribute('target')).toBe('_blank');
    }
  });

  it('mène aux nouveautés du site, dans le même onglet', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Footer);
    fixture.componentRef.setInput('text', en.footer);
    fixture.componentRef.setInput('site', SITE_CONFIG_DATA);
    fixture.componentRef.setInput('languages', [{ code: 'en', name: 'English' }]);
    fixture.componentRef.setInput('current', 'en');
    fixture.componentRef.setInput('languageLabel', en.nav.language);
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a[href="/en/changelog"]');
    expect(link?.textContent).toContain(en.footer.changelog);
    expect(link?.getAttribute('target')).toBeNull();
  });
});
