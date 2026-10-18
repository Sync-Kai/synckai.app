/**
 * Kana décoratifs de l'identité SyncKai (filigranes et surtitres), les mêmes dans toutes les langues :
 * ils ne se traduisent pas et restent cachés aux lecteurs d'écran. Ceux des captures viennent de
 * docs/store/screenshots.md de l'extension ; ヨウコソ, ヒント et ツヅキ de son glossaire japonais.
 */
export const KANA = {
  /** シンカイ, à côté du nom dans le logo. */
  brand: 'シンカイ',
  /** 自動, « automatique » : le héros, comme les tuiles promo du store. */
  hero: 'ジドウ',
  /** ようこそ, « bienvenue » : les étapes d'installation. */
  how: 'ヨウコソ',
  /** 記録, « enregistré » : les fonctionnalités, comme la capture de la synchro au générique. */
  features: 'キロク',
  /** « astuces » : la FAQ. */
  faq: 'ヒント',
  /** 続き, « la suite » : l'appel final. */
  cta: 'ツヅキ',
  /** 更新, « mise à jour » : la page des nouveautés. */
  changelog: 'コウシン',
} as const;

/** Kana de chaque capture du store, par nom de fichier (sans extension). */
export const SHOT_KANA: Readonly<Record<string, string>> = {
  '01-sync-at-credits': 'キロク',
  '02-side-panel': 'サイセイ',
  '03-agenda': 'コンシュウ',
  '04-page-media': 'ページ',
  '05-cr-import': 'リレキ',
};
