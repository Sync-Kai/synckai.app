import { compareVersions } from '@domain/release';
import { TRANSLATION_DATA } from './translations';
import { RELEASE_DATA } from './releases';

describe('nouveautés (releases.json)', () => {
  const codes = TRANSLATION_DATA.map((t) => t.code).sort();

  it('liste au moins une version', () => {
    expect(RELEASE_DATA.length).toBeGreaterThan(0);
  });

  it('va de la plus récente à la plus ancienne, sans doublon', () => {
    for (let i = 1; i < RELEASE_DATA.length; i++) {
      expect(compareVersions(RELEASE_DATA[i - 1].version, RELEASE_DATA[i].version)).toBeGreaterThan(
        0,
      );
    }
  });

  for (const release of RELEASE_DATA) {
    describe(release.version, () => {
      it('a un numéro SemVer et une date AAAA-MM-JJ valide', () => {
        expect(release.version).toMatch(/^\d+\.\d+\.\d+$/);
        expect(release.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isNaN(Date.parse(release.date))).toBe(false);
      });

      it('est résumée dans chaque langue du site, sans texte vide', () => {
        expect(Object.keys(release.text).sort()).toEqual(codes);
        for (const text of Object.values(release.text)) {
          expect(text.title.trim()).not.toBe('');
          expect(text.highlights.length).toBeGreaterThan(0);
          expect(text.highlights.every((h) => h.trim() !== '')).toBe(true);
        }
      });

      it('a autant de points dans chaque langue', () => {
        const counts = Object.values(release.text).map((t) => t.highlights.length);
        expect(new Set(counts).size).toBe(1);
      });
    });
  }
});
