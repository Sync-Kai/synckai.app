import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KANA } from '@domain/kana';
import { TextBlock } from '@domain/translation';
import { Emphasis } from '@shared/ui/emphasis/emphasis';
import { Eyebrow } from '@shared/ui/eyebrow/eyebrow';

/** Les étapes d'installation : une vraie séquence, d'où la numérotation. */
@Component({
  selector: 'sk-how-it-works',
  imports: [Emphasis, Eyebrow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'how', class: 'section-wrap pt-28 max-[900px]:pt-20' },
  template: `
    <sk-eyebrow [label]="eyebrow()" [kana]="kana" />
    <h2 class="mt-4"><sk-emphasis [text]="title()" /></h2>
    <ol class="mt-10 grid list-none grid-cols-3 gap-5 p-0 max-[900px]:grid-cols-1">
      @for (step of steps(); track step.title; let i = $index) {
        <li class="rounded-(--radius-card) border border-line bg-surface px-[26px] py-7">
          <span
            class="font-display text-[44px] leading-none font-extrabold text-lavender"
            aria-hidden="true"
            >{{ i + 1 }}</span
          >
          <h3 class="mt-5">{{ step.title }}</h3>
          <p class="mt-2 text-muted">{{ step.text }}</p>
        </li>
      }
    </ol>
  `,
})
export class HowItWorks {
  /** Surtitre (le libellé de l'ancre dans l'en-tête). */
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly steps = input.required<readonly TextBlock[]>();

  protected readonly kana = KANA.how;
}
