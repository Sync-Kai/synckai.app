import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PlatformsText } from '@domain/translation';

/** Où l'on regarde et où la liste est tenue à jour. Les plateformes en option sont signalées. */
@Component({
  selector: 'sk-platforms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'section-wrap flex flex-wrap gap-x-12 gap-y-2.5 py-6' },
  template: `
    <p class="flex flex-wrap items-baseline gap-x-[18px] gap-y-1.5">
      <span class="text-[15px] text-mist">{{ text().watch }}</span>
      @for (p of streaming; track p.name) {
        <b class="text-[19px] font-bold"
          >{{ p.name }}
          @if (p.optional) {
            <i class="ml-1 text-xs font-medium text-mist not-italic">{{ text().optional }}</i>
          }
        </b>
      }
    </p>
    <p class="flex flex-wrap items-baseline gap-x-[18px] gap-y-1.5">
      <span class="text-[15px] text-mist">{{ text().list }}</span>
      @for (name of trackers; track name) {
        <b class="text-[19px] font-bold">{{ name }}</b>
      }
    </p>
  `,
})
export class Platforms {
  readonly text = input.required<PlatformsText>();

  protected readonly streaming = [
    { name: 'Crunchyroll', optional: false },
    { name: 'ADN', optional: false },
    { name: 'Netflix', optional: true },
    { name: 'Disney+', optional: true },
  ] as const;
  protected readonly trackers = ['AniList', 'MyAnimeList'] as const;
}
