import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TextBlock } from '@domain/translation';

/** Une fonctionnalité prête à afficher, avec le chemin de sa capture déjà résolu. */
export interface ShowcaseItem extends TextBlock {
  readonly image: string;
}

/** Fonctionnalités principales en alternance texte / capture, puis la liste des autres. */
@Component({
  selector: 'sk-feature-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'features', class: 'section-wrap pt-30' },
  template: `
    <h2>{{ title() }}</h2>
    @for (item of items(); track item.title; let odd = $odd) {
      <article
        class="mt-16 grid items-center gap-[clamp(28px,5vw,64px)] max-[900px]:mt-14 max-[900px]:grid-cols-1"
        [class]="odd ? 'grid-cols-[1.2fr_0.8fr]' : 'grid-cols-[0.8fr_1.2fr]'"
      >
        <div [class.order-2]="odd" class="max-[900px]:order-none">
          <h3>{{ item.title }}</h3>
          <p class="mt-3 max-w-[30em] text-mist">{{ item.text }}</p>
        </div>
        <img
          [src]="item.image"
          [alt]="item.title"
          width="1280"
          height="800"
          loading="lazy"
          decoding="async"
          class="rounded-2xl border border-ink-line shadow-deep"
        />
      </article>
    }
    <div class="mt-24 border-t border-ink-line pt-10">
      <h3>{{ moreTitle() }}</h3>
      <ul class="mt-5 list-none columns-2 gap-14 p-0 max-[900px]:columns-1">
        @for (line of more(); track line) {
          <li
            class="relative break-inside-avoid py-2.5 pl-[22px] text-mist before:absolute before:top-[21px] before:left-0 before:size-2 before:rounded-full before:bg-violet"
          >
            {{ line }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class FeatureShowcase {
  readonly title = input.required<string>();
  readonly items = input.required<readonly ShowcaseItem[]>();
  readonly moreTitle = input.required<string>();
  readonly more = input.required<readonly string[]>();
}
