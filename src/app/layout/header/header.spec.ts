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
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('ne contient que des liens internes : la navigation reste sur la page', () => {
    const header = render();
    expect(header.querySelectorAll('a[target="_blank"]').length).toBe(0);
    expect(header.querySelectorAll('a[href^="http"]').length).toBe(0);
  });
});
