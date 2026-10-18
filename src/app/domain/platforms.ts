/** Une plateforme de streaming ou un service de suivi, avec son logo dans assets/brands/. */
export interface Brand {
  readonly name: string;
  readonly logo: string;
}

export interface StreamingPlatform extends Brand {
  /** À activer dans les réglages de l'extension (accès au site demandé à ce moment-là). */
  readonly optional: boolean;
}

/** Où l'on regarde, dans l'ordre des captures du store. */
export const STREAMING_PLATFORMS: readonly StreamingPlatform[] = [
  { name: 'Crunchyroll', logo: 'assets/brands/crunchyroll.png', optional: false },
  { name: 'ADN', logo: 'assets/brands/adn.png', optional: false },
  { name: 'Netflix', logo: 'assets/brands/netflix.png', optional: true },
  { name: 'Disney+', logo: 'assets/brands/disney.png', optional: true },
];

/** Où la liste est tenue à jour. */
export const TRACKERS: readonly Brand[] = [
  { name: 'AniList', logo: 'assets/brands/anilist.png' },
  { name: 'MyAnimeList', logo: 'assets/brands/myanimelist.svg' },
];
