import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'chrome' | 'firefox' | 'check' | 'globe';

/** Icône décorative en SVG ; la taille vient des classes posées sur l'élément hôte. */
@Component({
  selector: 'sk-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'inline-block shrink-0' },
  template: `
    @switch (name()) {
      @case ('chrome') {
        <svg viewBox="0 0 24 24" class="size-full">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path
            d="M12 8h9M8.5 14 4 6.2M15.5 14 11 21.8"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
          />
        </svg>
      }
      @case ('firefox') {
        <svg viewBox="0 0 24 24" class="size-full">
          <path
            d="M12 2a10 10 0 1 0 10 10c0-1.6-.4-3.2-1.1-4.6.2 1.4-.2 2.5-.8 3.2.3-3.6-2-6.6-5.1-7.6 1.5 1.4 1.9 3.2 1.4 4.6-.9-1.8-2.9-2.6-4.4-2.4 1.3.6 2 1.7 2.1 2.6-2.4-.2-4.3 1.4-4.5 3.4 1-.9 2.4-1.2 3.6-.9-1.6.6-2.6 2-2.4 3.7.3 2 2.2 3.4 4.3 3.3 2.6-.1 4.6-2.4 4.4-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
        </svg>
      }
      @case ('check') {
        <svg viewBox="0 0 16 16" class="size-full">
          <path
            d="M3.5 8.5 6.5 11.5 12.5 4.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      }
      @case ('globe') {
        <svg viewBox="0 0 24 24" class="size-full">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8" />
          <path
            d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>
      }
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
}
