import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import en from '@data/translations/en.json';
import { Header } from './header';

describe('Header', () => {
  function render(): HTMLElement {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Header);
    fixture.componentRef.setInput('nav', en.nav);
    fixture.componentRef.setInput('languages', [{ code: 'en', name: 'English' }]);
    fixture.componentRef.setInput('current', 'en');
    fixture.componentRef.setInput('repositoryUrl', 'https://github.com/example/repo');
    fixture.componentRef.setInput('anilistUrl', 'https://anilist.co/user/example/');
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('lie le dépôt GitHub et le profil AniList, dans un nouvel onglet', () => {
    const external = Array.from(render().querySelectorAll('a[target="_blank"]'));
    expect(external.map((a) => [a.getAttribute('href'), a.getAttribute('aria-label')])).toEqual([
      ['https://github.com/example/repo', en.nav.github],
      ['https://anilist.co/user/example/', en.nav.anilist],
    ]);
    for (const anchor of external) {
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });
});
