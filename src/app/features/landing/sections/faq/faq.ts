import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KANA } from '@domain/kana';
import { FaqItem } from '@domain/translation';
import { Eyebrow } from '@shared/ui/eyebrow/eyebrow';

/** Questions fréquentes, en accordéon natif (<details>) : fonctionne sans JavaScript. */
@Component({
  selector: 'sk-faq',
  imports: [Eyebrow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'faq', class: 'section-wrap max-w-[860px] pt-28 max-[900px]:pt-20' },
  styles: `
    summary::-webkit-details-marker {
      display: none;
    }
    summary::after {
      content: '';
      position: absolute;
      right: 6px;
      top: 50%;
      width: 10px;
      height: 10px;
      margin-top: -7px;
      border-right: 2.5px solid var(--color-muted);
      border-bottom: 2.5px solid var(--color-muted);
      transform: rotate(45deg);
      transition: transform 0.2s;
    }
    details[open] summary::after {
      transform: rotate(-135deg);
      margin-top: -2px;
    }
  `,
  template: `
    <sk-eyebrow [label]="eyebrow()" [kana]="kana" />
    <h2 class="mt-4 mb-6">{{ title() }}</h2>
    @for (item of items(); track item.q) {
      <details class="border-b border-line">
        <summary class="relative cursor-pointer list-none py-5 pr-10 text-lg font-extrabold">
          {{ item.q }}
        </summary>
        <p class="max-w-[40em] pb-[22px] text-muted">{{ item.a }}</p>
      </details>
    }
  `,
})
export class Faq {
  /** Surtitre (le libellé de l'ancre dans l'en-tête). */
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly items = input.required<readonly FaqItem[]>();

  protected readonly kana = KANA.faq;
}
