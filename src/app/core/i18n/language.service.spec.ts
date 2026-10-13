import { TestBed } from '@angular/core/testing';
import { BrowserEnvironment } from '../platform/browser-environment';
import { provideSiteData } from '../provide-site-data';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let saved: string | null;
  let browserLanguages: string[];

  beforeEach(() => {
    saved = null;
    browserLanguages = [];
    TestBed.configureTestingModule({
      providers: [
        provideSiteData(),
        {
          provide: BrowserEnvironment,
          useValue: {
            get languages() {
              return browserLanguages;
            },
            readSavedLanguage: () => saved,
            saveLanguage: (code: string) => (saved = code),
          } satisfies Pick<BrowserEnvironment, 'languages' | 'readSavedLanguage' | 'saveLanguage'>,
        },
      ],
    });
  });

  it('liste les langues, langue par défaut en premier', () => {
    expect(TestBed.inject(LanguageService).codes[0]).toBe('en');
  });

  it('renvoie la langue par défaut pour un code inconnu', () => {
    expect(TestBed.inject(LanguageService).translation('xx').code).toBe('en');
  });

  it('détecte la langue du navigateur', () => {
    browserLanguages = ['de-AT', 'en'];
    expect(TestBed.inject(LanguageService).detect()).toBe('de');
  });

  it('mémorise un choix valide et ignore un code inconnu', () => {
    const service = TestBed.inject(LanguageService);
    service.remember('xx');
    expect(saved).toBeNull();
    service.remember('fr');
    expect(saved).toBe('fr');
    expect(service.detect()).toBe('fr');
  });
});
