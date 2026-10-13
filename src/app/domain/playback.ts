/** Formate une position de lecture en m:ss, comme un lecteur vidéo. */
export function formatPlaybackTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** Interpolation linéaire entre deux positions, avancement borné à [0, 1]. */
export function interpolate(from: number, to: number, progress: number): number {
  const k = Math.min(1, Math.max(0, progress));
  return from + (to - from) * k;
}
