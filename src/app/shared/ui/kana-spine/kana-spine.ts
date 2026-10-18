import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * « Dos » des captures du store : un kana vertical en filigrane, coupé par le bord gauche, puis un filet.
 * Purement décoratif ; le parent doit être positionné (relative) et couper ce qui dépasse.
 */
@Component({
  selector: 'sk-kana-spine',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    class:
      'pointer-events-none absolute inset-y-0 left-0 w-(--spine) overflow-hidden select-none [--spine:112px] max-[900px]:[--spine:44px]',
    '[class.compact]': 'compact()',
  },
  styles: `
    :host(.compact) {
      --spine: 96px;
    }
    @media (max-width: 900px) {
      :host(.compact) {
        --spine: 44px;
      }
    }
  `,
  template: `
    <span
      class="absolute top-10 left-1.5 font-kana text-[length:var(--spine)] leading-none tracking-[0.07em] whitespace-nowrap text-watermark [writing-mode:vertical-rl] max-[900px]:left-0"
      >{{ kana() }}</span
    >
    <span class="absolute inset-y-12 right-0 w-px bg-line"></span>
  `,
})
export class KanaSpine {
  readonly kana = input.required<string>();
  /** Version un peu plus étroite, pour les blocs de fonctionnalités. */
  readonly compact = input(false);
}
