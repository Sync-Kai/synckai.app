import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/*
 * Frontières entre couches (Clean Architecture) : les dépendances pointent vers le centre.
 * Toute import (types compris) qui sort de ces règles fait échouer les tests.
 */
type Layer = 'domain' | 'data' | 'core' | 'shared' | 'layout' | 'features' | 'app';

const ALLOWED: Readonly<Record<Layer, readonly Layer[]>> = {
  domain: [],
  data: ['domain'],
  core: ['domain'],
  shared: ['domain'],
  layout: ['domain', 'shared'],
  features: ['domain', 'core', 'shared', 'layout'],
  app: ['domain', 'data', 'core', 'shared', 'layout', 'features'],
};

// Seul point de composition autorisé à connaître la couche data.
const DATA_COMPOSITION_ROOT = 'core/provide-site-data.ts';

const APP_DIR = join(process.cwd(), 'src/app');
const ALIASES: Readonly<Record<string, Layer>> = {
  '@domain/': 'domain',
  '@data/': 'data',
  '@core/': 'core',
  '@shared/': 'shared',
  '@layout/': 'layout',
  '@features/': 'features',
};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      return sourceFiles(path);
    }
    return name.endsWith('.ts') && !name.endsWith('.spec.ts') ? [path] : [];
  });
}

function layerOf(file: string): Layer {
  const first = relative(APP_DIR, file).split(/[\\/]/)[0];
  return (first in ALLOWED ? first : 'app') as Layer;
}

function featureOf(file: string): string | null {
  const parts = relative(APP_DIR, file).split(/[\\/]/);
  return parts[0] === 'features' ? parts[1] : null;
}

function imports(file: string): string[] {
  const source = readFileSync(file, 'utf8');
  return [
    ...source.matchAll(
      /(?:import|export)\s[^'"]*?from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g,
    ),
  ].map((m) => m[1] ?? m[2]);
}

function resolveTarget(file: string, specifier: string): string | null {
  for (const [alias, layer] of Object.entries(ALIASES)) {
    if (specifier.startsWith(alias)) {
      return join(APP_DIR, layer, specifier.slice(alias.length));
    }
  }
  return specifier.startsWith('.') ? join(file, '..', specifier) : null;
}

describe('architecture', () => {
  const files = sourceFiles(APP_DIR);

  it('trouve les fichiers sources', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('respecte le sens des dépendances entre couches', () => {
    const violations: string[] = [];
    for (const file of files) {
      const from = layerOf(file);
      const rel = relative(APP_DIR, file).replace(/\\/g, '/');
      for (const specifier of imports(file)) {
        const target = resolveTarget(file, specifier);
        if (!target) {
          continue;
        }
        const to = layerOf(target);
        if (to === from) {
          continue;
        }
        const allowed =
          ALLOWED[from].includes(to) || (to === 'data' && rel === DATA_COMPOSITION_ROOT);
        if (!allowed) {
          violations.push(`${rel} (${from}) → ${specifier} (${to})`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('garde chaque fonctionnalité indépendante des autres', () => {
    const violations: string[] = [];
    for (const file of files) {
      const feature = featureOf(file);
      if (!feature) {
        continue;
      }
      for (const specifier of imports(file)) {
        const target = resolveTarget(file, specifier);
        const other = target ? featureOf(target) : null;
        if (other && other !== feature) {
          violations.push(`${relative(APP_DIR, file)} → ${specifier}`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('garde le domaine indépendant d’Angular', () => {
    const domainFiles = files.filter((f) => layerOf(f) === 'domain');
    const angular = domainFiles.filter((f) => imports(f).some((s) => s.startsWith('@angular/')));
    expect(angular.map((f) => relative(APP_DIR, f))).toEqual([]);
  });
});
