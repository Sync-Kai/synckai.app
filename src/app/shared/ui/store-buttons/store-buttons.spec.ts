import { TestBed } from '@angular/core/testing';
import { StoreLink } from '@domain/store';
import { StoreButtons } from './store-buttons';

describe('StoreButtons', () => {
  const links: StoreLink[] = [
    { id: 'chrome', url: 'https://chrome.example/' },
    { id: 'firefox', url: 'https://firefox.example/' },
  ];
  const labels = { chrome: 'Add to Chrome', firefox: 'Add to Firefox' };

  function render(preferred: 'chrome' | 'firefox'): HTMLAnchorElement[] {
    const fixture = TestBed.createComponent(StoreButtons);
    fixture.componentRef.setInput('links', links);
    fixture.componentRef.setInput('labels', labels);
    fixture.componentRef.setInput('preferred', preferred);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    return Array.from(host.querySelectorAll('a'));
  }

  it('affiche un lien par store, avec son libellé', () => {
    const anchors = render('chrome');
    expect(anchors.map((a) => [a.textContent?.trim(), a.getAttribute('href')])).toEqual([
      ['Add to Chrome', 'https://chrome.example/'],
      ['Add to Firefox', 'https://firefox.example/'],
    ]);
  });

  it('place le store préféré en premier et le met en évidence', () => {
    const anchors = render('firefox');
    expect(anchors[0].textContent?.trim()).toBe('Add to Firefox');
    expect(anchors[0].classList).toContain('bg-kai');
    expect(anchors[1].classList).not.toContain('bg-kai');
  });
});
