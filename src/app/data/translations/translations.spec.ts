import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { TRANSLATION_DATA } from './index';
import siteConfig from '../site.config.json';

type Json = string | number | boolean | null | readonly Json[] | { readonly [key: string]: Json };

// Liste les chemins de toutes les clés ; les éléments d'un tableau sont comparés à la forme du premier.
function keyPaths(value: Json, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.length ? keyPaths(value[0] as Json, `${prefix}[]`) : [`${prefix}[]`];
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function emptyTexts(value: Json, prefix = ''): string[] {
  if (typeof value === 'string') {
    return value.trim() ? [] : [prefix];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => emptyTexts(item as Json, `${prefix}[${i}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) => emptyTexts(child, `${prefix}.${key}`));
  }
  return [];
}

describe('traductions', () => {
  const reference = TRANSLATION_DATA.find((t) => t.code === siteConfig.defaultLanguage)!;
  const referenceKeys = keyPaths(reference as unknown as Json).sort();

  it('enregistre chaque fichier JSON du dossier, et seulement eux', () => {
    const files = readdirSync(join(process.cwd(), 'src/app/data/translations'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''))
      .sort();
    expect(TRANSLATION_DATA.map((t) => t.code).sort()).toEqual(files);
  });

  it('a des codes de langue uniques', () => {
    const codes = TRANSLATION_DATA.map((t) => t.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  for (const translation of TRANSLATION_DATA) {
    describe(translation.code, () => {
      it('a exactement les mêmes clés que la langue par défaut', () => {
        expect(keyPaths(translation as unknown as Json).sort()).toEqual(referenceKeys);
      });

      it('n’a aucun texte vide', () => {
        expect(emptyTexts(translation as unknown as Json)).toEqual([]);
      });

      it('garde le même nombre d’étapes, de fonctionnalités illustrées et de questions', () => {
        expect(translation.how.steps.length).toBe(reference.how.steps.length);
        expect(translation.faq.items.length).toBe(reference.faq.items.length);
        expect(translation.features.items.map((i) => i.shot)).toEqual(
          reference.features.items.map((i) => i.shot),
        );
      });
    });
  }
});
