import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { splitEmphasis } from '@domain/emphasis';

/** Titre traduit dont les mots entre astérisques passent en lavande. Se place dans un h1, h2 ou h3. */
@Component({
  selector: 'sk-emphasis',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  // Un span par morceau : un texte nu entre deux blocs garderait une espace (« générique . »).
  template: `
    @for (segment of segments(); track $index) {
      <span [class.text-lavender]="segment.accent">{{ segment.text }}</span>
    }
  `,
})
export class Emphasis {
  readonly text = input.required<string>();

  protected readonly segments = computed(() => splitEmphasis(this.text()));
}
