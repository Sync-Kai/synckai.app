import { Translation } from '@domain/translation';
import de from './de.json';
import en from './en.json';
import fr from './fr.json';

/**
 * Toutes les langues du site. Le type `Translation` fait échouer le build s'il manque
 * un texte ; les tests vérifient aussi qu'aucun fichier n'a de clé en trop ou en moins.
 *
 * Pour ajouter une langue : créer <code>.json à partir de en.json, le traduire, et l'ajouter ici.
 */
export const TRANSLATION_DATA: readonly Translation[] = [en, fr, de];
