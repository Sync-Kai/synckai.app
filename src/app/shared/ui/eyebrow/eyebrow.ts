import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Surtitre en capitales suivi de son kana en sakura, le seul accent sakura hors bouton principal (charte). */
@Component({
  selector: 'sk-eyebrow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'eyebrow flex flex-wrap items-baseline gap-x-2.5 gap-y-1' },
  template: `
    <span>{{ label() }}</span>
    <span
      aria-hidden="true"
      class="font-kana text-base tracking-[0.04em] text-sakura normal-case"
      >{{ kana() }}</span
    >
  `,
})
export class Eyebrow {
  readonly label = input.required<string>();
  readonly kana = input.required<string>();
}
