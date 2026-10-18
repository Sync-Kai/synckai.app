/** Morceau d'un titre : texte ordinaire, ou mot mis en avant (en lavande, comme sur les captures du store). */
export interface TextSegment {
  readonly text: string;
  readonly accent: boolean;
}

const MARKED = /\*([^*]+)\*/g;

/**
 * Découpe un titre traduit dont les mots mis en avant sont entre astérisques
 * (« Ta liste à jour dès le *générique* »), la même convention que les légendes des captures de l'extension.
 */
export function splitEmphasis(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let last = 0;
  for (const match of text.matchAll(MARKED)) {
    if (match.index > last) {
      segments.push({ text: text.slice(last, match.index), accent: false });
    }
    segments.push({ text: match[1], accent: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    segments.push({ text: text.slice(last), accent: false });
  }
  return segments;
}

/** Le même titre sans ses marques, pour un texte alternatif ou une balise meta. */
export function plainText(text: string): string {
  return text.replace(MARKED, '$1');
}
