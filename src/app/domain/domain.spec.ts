import { pickLanguage } from './language';
import { formatPlaybackTime, interpolate } from './playback';
import { screenshotPath } from './screenshot';
import { preferredStore, storeLinks } from './store';

describe('pickLanguage', () => {
  const available = ['en', 'fr', 'de'];

  it('garde la langue mémorisée si elle existe encore', () => {
    expect(pickLanguage(available, ['de-DE'], 'fr', 'en')).toBe('fr');
  });

  it('ignore une langue mémorisée qui n’existe plus', () => {
    expect(pickLanguage(available, ['de-DE'], 'es', 'en')).toBe('de');
  });

  it('prend la première langue du navigateur prise en charge, sans la région', () => {
    expect(pickLanguage(available, ['es-ES', 'fr-BE', 'en'], null, 'en')).toBe('fr');
  });

  it('retombe sur la langue par défaut', () => {
    expect(pickLanguage(available, ['ja-JP'], null, 'en')).toBe('en');
    expect(pickLanguage(available, [], null, 'en')).toBe('en');
  });
});

describe('storeLinks', () => {
  const listings = { chromeExtensionId: 'abc', firefoxAddonSlug: 'synckai' };

  it('construit les URL des stores dans la langue demandée', () => {
    expect(storeLinks(listings, { chrome: 'fr', amo: 'fr' })).toEqual([
      { id: 'chrome', url: 'https://chromewebstore.google.com/detail/abc?hl=fr' },
      { id: 'firefox', url: 'https://addons.mozilla.org/fr/firefox/addon/synckai/' },
    ]);
  });
});

describe('preferredStore', () => {
  it('choisit Firefox Add-ons sur Firefox, de bureau ou iOS', () => {
    expect(
      preferredStore('Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0'),
    ).toBe('firefox');
    expect(preferredStore('Mozilla/5.0 (iPhone) FxiOS/142.0 Mobile/15E148')).toBe('firefox');
  });

  it('choisit le Chrome Web Store ailleurs, et pendant le prérendu', () => {
    expect(preferredStore('Mozilla/5.0 Chrome/141.0 Safari/537.36 Edg/141.0')).toBe('chrome');
    expect(preferredStore('')).toBe('chrome');
  });
});

describe('screenshotPath', () => {
  const set = { languages: ['en', 'fr'], fallback: 'en' };

  it('utilise les captures de la langue quand elles existent', () => {
    expect(screenshotPath(set, 'fr', '03-agenda')).toBe('assets/shots/fr/03-agenda.webp');
  });

  it('retombe sur les captures de la langue de repli', () => {
    expect(screenshotPath(set, 'es', '03-agenda')).toBe('assets/shots/en/03-agenda.webp');
  });
});

describe('playback', () => {
  it('formate une position en m:ss', () => {
    expect(formatPlaybackTime(0)).toBe('0:00');
    expect(formatPlaybackTime(1306.4)).toBe('21:46');
    expect(formatPlaybackTime(-5)).toBe('0:00');
  });

  it('interpole en bornant l’avancement', () => {
    expect(interpolate(0.8, 0.9, 0.5)).toBeCloseTo(0.85);
    expect(interpolate(0.8, 0.9, -1)).toBe(0.8);
    expect(interpolate(0.8, 0.9, 2)).toBe(0.9);
  });
});
