import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Fichiers statiques de l'app mobile SyncKai (public/) : les App Links Android et les pages de repli
 * de la connexion AniList / MyAnimeList. Ils ne passent pas par Angular, donc ils sont vérifiés ici.
 */
const PUBLIC_DIR = join(process.cwd(), 'public');
const read = (path: string): string => readFileSync(join(PUBLIC_DIR, path), 'utf8');
const sha256 = (text: string): string =>
  `'sha256-${createHash('sha256').update(text).digest('base64')}'`;

interface AssetLink {
  readonly relation: readonly string[];
  readonly target: {
    readonly namespace: string;
    readonly package_name: string;
    readonly sha256_cert_fingerprints: readonly string[];
  };
}

describe('assetlinks.json', () => {
  const links = JSON.parse(read('.well-known/assetlinks.json')) as AssetLink[];

  it('delegates the handling of the links to the SyncKai Android app', () => {
    expect(links).toHaveLength(1);
    expect(links[0].relation).toEqual(['delegate_permission/common.handle_all_urls']);
    expect(links[0].target.namespace).toBe('android_app');
    expect(links[0].target.package_name).toBe('app.synckai.mobile');
    expect(links[0].target.sha256_cert_fingerprints.length).toBeGreaterThan(0);
  });

  it('is served as JSON', () => {
    expect(read('_headers')).toMatch(
      /\/\.well-known\/assetlinks\.json\n\s+Content-Type: application\/json/,
    );
  });
});

describe.each([
  ['anilist', 'AniList'],
  ['mal', 'MyAnimeList'],
])('fallback page /auth/%s/', (service, name) => {
  const html = read(`auth/${service}/index.html`);
  const inline = (tag: string): string =>
    new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(html)?.[1] ?? '';

  it('is hidden from search engines and names the service in English and French', () => {
    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(html).toContain(`data-service="${service}"`);
    expect(html).toContain('lang="fr"');
    expect(html).toContain(name);
  });

  it('opens the app with the query and the fragment, once on load', () => {
    const script = inline('script');
    expect(html).toContain(`href="synckai://auth/${service}"`);
    expect(script).toContain("'synckai://auth/' + service + location.search + location.hash");
    expect(script.match(/location\.href =/g)).toHaveLength(1);
  });

  it('sends and logs nothing, and loads nothing from outside', () => {
    const script = inline('script');
    expect(script).not.toMatch(/fetch|XMLHttpRequest|sendBeacon|WebSocket|console\./);
    expect(html).not.toMatch(/(src|href)="https?:/);
    expect(html).not.toMatch(/<(link|img|iframe)\b/);
  });

  it('has a strict Content-Security-Policy matching its inline script and style', () => {
    const csp = /http-equiv="Content-Security-Policy"\s+content="([^"]+)"/.exec(html)?.[1] ?? '';
    expect(csp).toContain("default-src 'none'");
    expect(csp).not.toContain('unsafe-inline');
    expect(csp).toContain(`script-src ${sha256(inline('script'))}`);
    expect(csp).toContain(`style-src ${sha256(inline('style'))}`);
  });
});
