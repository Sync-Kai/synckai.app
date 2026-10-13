import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideSiteData } from '@core/provide-site-data';
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
});
