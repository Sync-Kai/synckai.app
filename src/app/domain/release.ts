import { LanguageCode } from './language';

/** Résumé d'une version de l'extension dans une langue : un titre et quelques phrases simples. */
export interface ReleaseText {
  readonly title: string;
  readonly highlights: readonly string[];
}

/** Une version publiée de l'extension, résumée dans chaque langue du site. */
export interface Release {
  /** Numéro SemVer, sans « v » (ex. « 2.3.1 »). */
  readonly version: string;
  /** Date de publication, au format AAAA-MM-JJ. */
  readonly date: string;
  readonly text: Readonly<Record<LanguageCode, ReleaseText>>;
}

/** Une version prête à afficher dans une langue. */
export interface LocalizedRelease extends ReleaseText {
  readonly version: string;
  readonly date: string;
}

/** Compare deux numéros SemVer (majeur.mineur.correctif) : négatif si a est plus ancien que b. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

/** Versions de la plus récente à la plus ancienne, dans la langue demandée (ou celle de repli). */
export function localizeReleases(
  releases: readonly Release[],
  code: LanguageCode,
  fallback: LanguageCode,
): readonly LocalizedRelease[] {
  return [...releases]
    .sort((a, b) => compareVersions(b.version, a.version))
    .flatMap((release) => {
      const text = release.text[code] ?? release.text[fallback];
      return text ? [{ version: release.version, date: release.date, ...text }] : [];
    });
}

/** Date de publication écrite dans la langue (ex. « 12 octobre 2026 »), sans décalage de fuseau. */
export function formatReleaseDate(date: string, code: LanguageCode): string {
  return new Intl.DateTimeFormat(code, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
