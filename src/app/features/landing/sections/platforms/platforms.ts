import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { STREAMING_PLATFORMS, TRACKERS } from '@domain/platforms';
import { PlatformsText } from '@domain/translation';

/** Où l'on regarde et où la liste est tenue à jour. Les plateformes en option sont signalées. */
@Component({
  selector: 'sk-platforms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block border-b border-line bg-surface' },
  template: `
    <div class="section-wrap flex flex-wrap gap-x-12 gap-y-3 py-6">
      <p class="flex flex-wrap items-center gap-x-[18px] gap-y-2.5">
        <span class="text-[15px] text-muted">{{ text().watch }}</span>
        @for (p of streaming; track p.name) {
          <span class="inline-flex items-center gap-2 text-[17px] font-extrabold">
            <img [src]="p.logo" alt="" width="22" height="22" class="size-[22px] rounded-md" />
            {{ p.name }}
            @if (p.optional) {
              <span
                class="rounded-full border border-line px-2 py-0.5 text-xs font-bold text-muted"
                >{{ text().optional }}</span
              >
            }
          </span>
        }
      </p>
      <p class="flex flex-wrap items-center gap-x-[18px] gap-y-2.5">
        <span class="text-[15px] text-muted">{{ text().list }}</span>
        @for (t of trackers; track t.name) {
          <span class="inline-flex items-center gap-2 text-[17px] font-extrabold">
            <img [src]="t.logo" alt="" width="22" height="22" class="size-[22px] rounded-md" />
            {{ t.name }}
          </span>
        }
      </p>
    </div>
  `,
})
export class Platforms {
  readonly text = input.required<PlatformsText>();

  protected readonly streaming = STREAMING_PLATFORMS;
  protected readonly trackers = TRACKERS;
}
