import { isMobileDevice } from './device';
import { pickLanguage } from './language';
import { Release, compareVersions, formatReleaseDate, localizeReleases } from './release';
import { formatPlaybackTime, interpolate } from './playback';
import { screenshotPath } from './screenshot';
import { SiteConfig } from './site';
import { serializeJsonLd, softwareApplicationSchema } from './structured-data';
import { Translation } from './translation';
import {
  StoreLink,
  browserFamily,
  preferredStore,
  storeLinks,
  visibleStores,
  visitorStore,
  visitorStorePending,
} from './store';

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
  const listings = {
    chromeExtensionId: 'abc',
    firefoxAddonSlug: 'synckai',
    firefoxPublished: true,
  };

  it('construit les URL des stores dans la langue demandée', () => {
    expect(storeLinks(listings, { chrome: 'fr', amo: 'fr' })).toEqual([
      { id: 'chrome', url: 'https://chromewebstore.google.com/detail/abc?hl=fr', available: true },
      {
        id: 'firefox',
        url: 'https://addons.mozilla.org/fr/firefox/addon/synckai/',
        available: true,
      },
    ]);
  });

  it('marque Firefox indisponible tant que l’add-on n’est pas publié', () => {
    const links = storeLinks(
      { ...listings, firefoxPublished: false },
      { chrome: 'en', amo: 'en-US' },
    );
    expect(links.map((l) => [l.id, l.available])).toEqual([
      ['chrome', true],
      ['firefox', false],
    ]);
  });
});

describe('preferredStore', () => {
  const firefoxUa = 'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0';
  const both = storeLinks(
    { chromeExtensionId: 'abc', firefoxAddonSlug: 'synckai', firefoxPublished: true },
    { chrome: 'en', amo: 'en-US' },
  );
  const chromeOnly = both.map((l) => (l.id === 'firefox' ? { ...l, available: false } : l));

  it('choisit Firefox Add-ons sur Firefox, de bureau ou iOS', () => {
    expect(preferredStore(firefoxUa, both)).toBe('firefox');
    expect(preferredStore('Mozilla/5.0 (iPhone) FxiOS/142.0 Mobile/15E148', both)).toBe('firefox');
  });

  it('choisit le Chrome Web Store ailleurs, et pendant le prérendu', () => {
    expect(preferredStore('Mozilla/5.0 Chrome/141.0 Safari/537.36 Edg/141.0', both)).toBe('chrome');
    expect(preferredStore('', both)).toBe('chrome');
  });

  it('ne met jamais en avant un store indisponible', () => {
    expect(preferredStore(firefoxUa, chromeOnly)).toBe('chrome');
  });
});

describe('visitorStorePending', () => {
  const firefoxUa = 'Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0';
  const chromeUa = 'Mozilla/5.0 Chrome/141.0 Safari/537.36';
  const links = (firefoxPublished: boolean): readonly StoreLink[] =>
    storeLinks(
      { chromeExtensionId: 'abc', firefoxAddonSlug: 'synckai', firefoxPublished },
      { chrome: 'en', amo: 'en-US' },
    );

  it('reconnaît le store du navigateur du visiteur', () => {
    expect(visitorStore(firefoxUa)).toBe('firefox');
    expect(visitorStore(chromeUa)).toBe('chrome');
  });

  it('signale un visiteur Firefox tant que l’add-on n’est pas publié', () => {
    expect(visitorStorePending(firefoxUa, links(false))).toBe(true);
    expect(visitorStorePending(firefoxUa, links(true))).toBe(false);
  });

  it('ne signale rien pour les autres navigateurs, ni pendant le prérendu', () => {
    expect(visitorStorePending(chromeUa, links(false))).toBe(false);
    expect(visitorStorePending('', links(false))).toBe(false);
  });
});

describe('browserFamily', () => {
  const agents = {
    firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',
    chrome:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
    edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0',
    opera:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 OPR/125.0.0.0',
    safari:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Safari/605.1.15',
  };

  it('reconnaît Firefox', () => {
    expect(browserFamily(agents.firefox)).toBe('firefox');
  });

  it('range Chrome, Brave, Edge et Opera parmi les navigateurs Chromium', () => {
    expect(browserFamily(agents.chrome)).toBe('chromium');
    expect(browserFamily(agents.edge)).toBe('chromium');
    expect(browserFamily(agents.opera)).toBe('chromium');
  });

  it('classe Safari, les robots et le prérendu comme inconnus', () => {
    expect(browserFamily(agents.safari)).toBe('other');
    expect(browserFamily('Googlebot/2.1 (+http://www.google.com/bot.html)')).toBe('other');
    expect(browserFamily('')).toBe('other');
  });

  describe('visibleStores', () => {
    const links = storeLinks(
      { chromeExtensionId: 'abc', firefoxAddonSlug: 'synckai', firefoxPublished: false },
      { chrome: 'en', amo: 'en-US' },
    );
    const ids = (userAgent: string): string[] => visibleStores(userAgent, links).map((l) => l.id);

    it('ne propose que Firefox sur Firefox, même pas encore publié', () => {
      expect(ids(agents.firefox)).toEqual(['firefox']);
    });

    it('ne propose que Chrome sur les navigateurs Chromium', () => {
      expect(ids(agents.chrome)).toEqual(['chrome']);
      expect(ids(agents.edge)).toEqual(['chrome']);
    });

    it('propose les deux quand le navigateur est inconnu', () => {
      expect(ids(agents.safari)).toEqual(['chrome', 'firefox']);
      expect(ids('')).toEqual(['chrome', 'firefox']);
    });
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

describe('isMobileDevice', () => {
  it('reconnaît les téléphones et tablettes Android et iOS', () => {
    expect(
      isMobileDevice(
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36',
        5,
      ),
    ).toBe(true);
    expect(
      isMobileDevice('Mozilla/5.0 (Android 14; Mobile; rv:142.0) Gecko/142.0 Firefox/142.0', 5),
    ).toBe(true);
    expect(
      isMobileDevice(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
        5,
      ),
    ).toBe(true);
  });

  it('reconnaît un iPad, qui se présente comme un Mac mais a un écran tactile', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
    expect(isMobileDevice(ua, 5)).toBe(true);
    expect(isMobileDevice(ua, 0)).toBe(false);
  });

  it('laisse les ordinateurs, les robots et le prérendu de côté', () => {
    expect(
      isMobileDevice(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        0,
      ),
    ).toBe(false);
    // Un PC portable tactile reste un ordinateur.
    expect(
      isMobileDevice(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',
        10,
      ),
    ).toBe(false);
    expect(isMobileDevice('Googlebot/2.1 (+http://www.google.com/bot.html)', 0)).toBe(false);
    expect(isMobileDevice('', 0)).toBe(false);
  });
});

describe('softwareApplicationSchema', () => {
  const site = {
    url: 'https://synckai.app',
    repository: 'https://github.com/Sync-Kai/SyncKai',
    author: 'Quentin Geerts',
    authorAnilist: 'https://anilist.co/user/Oyumiro/',
    stores: { chromeExtensionId: 'abc', firefoxAddonSlug: 'synckai', firefoxPublished: false },
  } as SiteConfig;
  const t = {
    code: 'fr',
    stores: { chrome: 'fr', amo: 'fr' },
    meta: { title: 'Titre', description: 'Description' },
  } as Translation;

  it('décrit une extension gratuite, dans la langue de la page', () => {
    const schema = softwareApplicationSchema(site, t, 'https://synckai.app/fr/', '2.3.1');
    expect(schema).toMatchObject({
      '@type': 'SoftwareApplication',
      name: 'SyncKai',
      description: 'Description',
      url: 'https://synckai.app/fr/',
      inLanguage: 'fr',
      applicationCategory: 'BrowserApplication',
      softwareVersion: '2.3.1',
      offers: { price: '0' },
    });
  });

  it('ne donne comme lien d’installation que les stores publics', () => {
    expect(softwareApplicationSchema(site, t, '')['installUrl']).toEqual([
      'https://chromewebstore.google.com/detail/abc?hl=fr',
    ]);
    const published = { ...site, stores: { ...site.stores, firefoxPublished: true } };
    expect(softwareApplicationSchema(published, t, '')['installUrl']).toHaveLength(2);
  });

  it('omet la version quand elle est inconnue', () => {
    expect(softwareApplicationSchema(site, t, '')).not.toHaveProperty('softwareVersion');
  });

  it('échappe « < » pour qu’aucun texte ne ferme la balise script', () => {
    expect(serializeJsonLd({ name: '</script>' })).toBe('{"name":"\\u003c/script>"}');
  });
});

describe('releases', () => {
  const releases: Release[] = [
    {
      version: '2.2.0',
      date: '2026-10-11',
      text: {
        en: { title: 'Old', highlights: ['a'] },
        fr: { title: 'Ancienne', highlights: ['a'] },
      },
    },
    {
      version: '2.10.0',
      date: '2026-11-02',
      text: { en: { title: 'New', highlights: ['b'] } },
    },
  ];

  it('compare les versions nombre par nombre, pas comme du texte', () => {
    expect(compareVersions('2.10.0', '2.9.1')).toBeGreaterThan(0);
    expect(compareVersions('2.2.0', '2.2.1')).toBeLessThan(0);
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
  });

  it('trie de la plus récente à la plus ancienne, dans la langue demandée ou celle de repli', () => {
    expect(localizeReleases(releases, 'fr', 'en').map((r) => [r.version, r.title])).toEqual([
      ['2.10.0', 'New'],
      ['2.2.0', 'Ancienne'],
    ]);
  });

  it('écrit la date dans la langue, sans décalage de fuseau', () => {
    expect(formatReleaseDate('2026-10-12', 'fr')).toBe('12 octobre 2026');
    expect(formatReleaseDate('2026-10-12', 'en')).toBe('October 12, 2026');
    expect(formatReleaseDate('2026-10-12', 'de')).toBe('12. Oktober 2026');
  });
});
