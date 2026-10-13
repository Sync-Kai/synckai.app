import { Release } from '@domain/release';
import releases from './releases.json';

/**
 * Nouveautés de l'extension, résumées pour la page /<langue>/changelog et le badge du hero.
 * À compléter à chaque version publiée de l'extension (README › Updating the What's new page).
 */
export const RELEASE_DATA: readonly Release[] = releases;
