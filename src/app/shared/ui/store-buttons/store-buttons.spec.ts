import { TestBed } from '@angular/core/testing';
import { StoreId, StoreLink } from '@domain/store';
import { StoreButtons } from './store-buttons';

describe('StoreButtons', () => {
  const both: StoreLink[] = [
    { id: 'chrome', url: 'https://chrome.example/', available: true },
    { id: 'firefox', url: 'https://firefox.example/', available: true },
  ];
  const labels = { chrome: 'Add to Chrome', firefox: 'Add to Firefox' };

  function render(links: StoreLink[], preferred: StoreId, labelsByStore = labels): HTMLElement {
    const fixture = TestBed.createComponent(StoreButtons);
    fixture.componentRef.setInput('links', links);
    fixture.componentRef.setInput('labels', labelsByStore);
    fixture.componentRef.setInput('preferred', preferred);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('affiche un lien par store, avec son libellé', () => {
    const anchors = Array.from(render(both, 'chrome').querySelectorAll('a'));
    expect(anchors.map((a) => [a.textContent?.trim(), a.getAttribute('href')])).toEqual([
      ['Add to Chrome', 'https://chrome.example/'],
      ['Add to Firefox', 'https://firefox.example/'],
    ]);
  });

  it('ouvre les stores dans un nouvel onglet, sans transmettre la page d’origine', () => {
    for (const anchor of Array.from(render(both, 'chrome').querySelectorAll('a'))) {
      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('place le store préféré en premier et le met en évidence', () => {
    const anchors = Array.from(render(both, 'firefox').querySelectorAll('a'));
    expect(anchors[0].textContent?.trim()).toBe('Add to Firefox');
    expect(anchors[0].classList).toContain('bg-sakura');
    expect(anchors[1].classList).not.toContain('bg-sakura');
  });

  it('affiche un store indisponible comme une mention, sans lien, en dernier', () => {
    const pending = both.map((l) => (l.id === 'firefox' ? { ...l, available: false } : l));
    const host = render(pending, 'chrome', { ...labels, firefox: 'Coming soon to Firefox' });
    const anchors = Array.from(host.querySelectorAll('a'));
    expect(anchors.map((a) => a.textContent?.trim())).toEqual(['Add to Chrome']);
    expect(host.textContent).toContain('Coming soon to Firefox');
    expect(host.querySelector('[href="https://firefox.example/"]')).toBeNull();
  });
});
