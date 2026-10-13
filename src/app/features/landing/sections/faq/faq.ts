import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaqItem } from '@domain/translation';

/** Questions fréquentes, en accordéon natif (<details>) : fonctionne sans JavaScript. */
@Component({
  selector: 'sk-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'faq', class: 'section-wrap max-w-[820px] pt-30' },
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
      border-right: 2.5px solid var(--color-mist);
      border-bottom: 2.5px solid var(--color-mist);
      transform: rotate(45deg);
      transition: transform 0.2s;
    }
    details[open] summary::after {
      transform: rotate(-135deg);
      margin-top: -2px;
    }
  `,
  template: `
    <h2 class="mb-6">{{ title() }}</h2>
    @for (item of items(); track item.q) {
      <details class="border-b border-ink-line">
        <summary class="relative cursor-pointer list-none py-5 pr-10 text-lg font-bold">
          {{ item.q }}
        </summary>
        <p class="max-w-[40em] pb-[22px] text-mist">{{ item.a }}</p>
      </details>
    }
  `,
})
export class Faq {
  readonly title = input.required<string>();
  readonly items = input.required<readonly FaqItem[]>();
}
