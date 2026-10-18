import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KANA } from '@domain/kana';
import { Emphasis } from '@shared/ui/emphasis/emphasis';
import { Eyebrow } from '@shared/ui/eyebrow/eyebrow';
import { KanaSpine } from '@shared/ui/kana-spine/kana-spine';

/** Une fonctionnalité prête à afficher : textes, kana et chemin de la capture déjà résolus. */
export interface ShowcaseItem {
  readonly eyebrow: string;
  /** Titre ; les mots entre astérisques sont mis en avant. */
  readonly title: string;
  /** Le titre sans ses marques, pour le texte alternatif de la capture. */
  readonly plainTitle: string;
  readonly text: string;
  readonly kana: string;
  readonly image: string;
}

/**
 * Fonctionnalités principales en blocs « duo », comme les captures du store : le dos avec le kana de la capture
 * et la colonne de texte d'un côté, l'interface en carte flottante de l'autre (alternés). Puis la liste des autres.
 */
@Component({
  selector: 'sk-feature-showcase',
  imports: [Emphasis, Eyebrow, KanaSpine],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'features', class: 'section-wrap pt-28 max-[900px]:pt-20' },
  template: `
    <sk-eyebrow [label]="eyebrow()" [kana]="kana" />
    <h2 class="mt-4"><sk-emphasis [text]="title()" /></h2>
    @for (item of items(); track item.image; let odd = $odd) {
      <article
        class="mt-8 grid overflow-hidden rounded-(--radius-block) border border-line max-[900px]:grid-cols-1"
        [class]="
          odd
            ? 'grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]'
            : 'grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]'
        "
      >
        <div
          class="relative flex flex-col justify-center overflow-hidden py-14 pr-11 pl-32 max-[900px]:order-none max-[900px]:py-9 max-[900px]:pr-5 max-[900px]:pl-[60px]"
          [class.order-2]="odd"
        >
          <sk-kana-spine [kana]="item.kana" [compact]="true" />
          <sk-eyebrow [label]="item.eyebrow" [kana]="item.kana" />
          <h3 class="mt-[18px] text-[clamp(26px,3vw,36px)]"><sk-emphasis [text]="item.title" /></h3>
          <p class="mt-[18px] max-w-[26em] text-lg text-muted max-sm:text-base">{{ item.text }}</p>
        </div>
        <div class="bg-stage">
          <img
            [src]="item.image"
            [alt]="item.plainTitle"
            width="670"
            height="800"
            loading="lazy"
            decoding="async"
            class="block size-full object-cover"
          />
        </div>
      </article>
    }
    <div class="mt-20 border-t border-line pt-10">
      <h3>{{ moreTitle() }}</h3>
      <ul class="mt-5 list-none columns-2 gap-14 p-0 max-[900px]:columns-1">
        @for (line of more(); track line) {
          <li
            class="relative break-inside-avoid py-2.5 pl-[22px] text-muted before:absolute before:top-[21px] before:left-0 before:size-2 before:rounded-full before:bg-lavender"
          >
            {{ line }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class FeatureShowcase {
  /** Surtitre (le libellé de l'ancre dans l'en-tête). */
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly items = input.required<readonly ShowcaseItem[]>();
  readonly moreTitle = input.required<string>();
  readonly more = input.required<readonly string[]>();

  protected readonly kana = KANA.features;
}
