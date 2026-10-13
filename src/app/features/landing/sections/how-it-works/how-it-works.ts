import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TextBlock } from '@domain/translation';

/** Les étapes d'installation : une vraie séquence, d'où la numérotation. */
@Component({
  selector: 'sk-how-it-works',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'how', class: 'section-wrap pt-24' },
  template: `
    <h2>{{ title() }}</h2>
    <ol
      class="mt-10 grid list-none grid-cols-3 gap-10 p-0 max-[900px]:grid-cols-1 max-[900px]:gap-7"
    >
      @for (step of steps(); track step.title; let i = $index, last = $last) {
        <li class="relative pt-16">
          <span
            class="text-kai absolute top-0 left-0 text-[44px] leading-none font-extrabold"
            aria-hidden="true"
            >{{ i + 1 }}</span
          >
          @if (!last) {
            <span
              class="absolute top-[22px] right-[-20px] left-[52px] h-0.5 bg-linear-to-r from-ink-line to-transparent max-[900px]:hidden"
              aria-hidden="true"
            ></span>
          }
          <h3>{{ step.title }}</h3>
          <p class="mt-2 text-mist">{{ step.text }}</p>
        </li>
      }
    </ol>
  `,
})
export class HowItWorks {
  readonly title = input.required<string>();
  readonly steps = input.required<readonly TextBlock[]>();
}
