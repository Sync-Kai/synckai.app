import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { shareImagePath } from '@domain/screenshot';
import { JsonLd, serializeJsonLd, softwareApplicationSchema } from '@domain/structured-data';
import { Translation } from '@domain/translation';
import { SITE_CONFIG, TRANSLATIONS } from '../tokens';

const MANAGED = 'data-seo';

/** Titre, description, cartes de partage, URL canonique et variantes de langue d'une page. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly site = inject(SITE_CONFIG);
  private readonly translations = inject(TRANSLATIONS);

  /** Décrit la page d'accueil dans la langue donnée ; `version` est la dernière version publiée de l'extension. */
  applyLanding(t: Translation, version?: string): void {
    const url = this.pageUrl(t.code);
    this.applyPage(t, [], t.meta.title, t.meta.description);
    this.setJsonLd(softwareApplicationSchema(this.site, t, url, version));
  }

  /** Décrit la page des nouveautés dans la langue donnée. */
  applyChangelog(t: Translation): void {
    this.applyPage(t, ['changelog'], t.changelog.metaTitle, t.changelog.metaDescription);
    this.setJsonLd(null);
  }

  /** Décrit la page racine, qui envoie seulement le visiteur vers sa langue. */
  applyRoot(): void {
    this.setLinks([
      { rel: 'canonical', href: this.pageUrl(this.site.defaultLanguage) },
      ...this.alternates([]),
    ]);
    this.setJsonLd(null);
  }

  private applyPage(
    t: Translation,
    page: readonly string[],
    title: string,
    description: string,
  ): void {
    const url = this.pageUrl(t.code, page);
    this.document.documentElement.lang = t.code;
    this.title.setTitle(title);
    this.setMeta('name', 'description', description);
    this.setMeta('property', 'og:type', 'website');
    this.setMeta('property', 'og:title', title);
    this.setMeta('property', 'og:description', description);
    this.setMeta('property', 'og:url', url);
    this.setMeta(
      'property',
      'og:image',
      `${this.site.url}/${shareImagePath(this.site.screenshots)}`,
    );
    this.setMeta('property', 'og:locale', t.code);
    this.setMeta('name', 'twitter:card', 'summary_large_image');
    this.setLinks([{ rel: 'canonical', href: url }, ...this.alternates(page)]);
  }

  /** URL publique d'une page : https://synckai.app/<langue>/<page…>/ (barre finale, comme les fichiers prérendus). */
  private pageUrl(code: string, page: readonly string[] = []): string {
    return `${this.site.url}/${[code, ...page].join('/')}/`;
  }

  private alternates(page: readonly string[]): LinkSpec[] {
    return [
      ...this.translations.map((t) => ({
        rel: 'alternate',
        hreflang: t.code,
        href: this.pageUrl(t.code, page),
      })),
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: page.length ? this.pageUrl(this.site.defaultLanguage, page) : `${this.site.url}/`,
      },
    ];
  }

  private setMeta(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
  }

  /** Remplace le bloc JSON-LD de la page (un seul à la fois), ou le retire avec null. */
  private setJsonLd(data: JsonLd | null): void {
    const head = this.document.head;
    head.querySelectorAll(`script[${MANAGED}]`).forEach((el) => el.remove());
    if (!data) {
      return;
    }
    const script = this.document.createElement('script');
    script.setAttribute(MANAGED, '');
    script.type = 'application/ld+json';
    script.textContent = serializeJsonLd(data);
    head.appendChild(script);
  }

  private setLinks(links: LinkSpec[]): void {
    const head = this.document.head;
    head.querySelectorAll(`link[${MANAGED}]`).forEach((el) => el.remove());
    for (const spec of links) {
      const link = this.document.createElement('link');
      link.setAttribute(MANAGED, '');
      link.rel = spec.rel;
      link.href = spec.href;
      if (spec.hreflang) {
        link.hreflang = spec.hreflang;
      }
      head.appendChild(link);
    }
  }
}

interface LinkSpec {
  rel: string;
  href: string;
  hreflang?: string;
}
