import { ChangeDetectionStrategy, Component } from '@angular/core';
import { STREAMING_PLATFORMS, TRACKERS } from '@domain/platforms';
import { Icon } from '../icon/icon';

/** Rangée de logos des captures du store : les plateformes, une flèche, puis AniList et MyAnimeList. */
@Component({
  selector: 'sk-service-logos',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-wrap items-center gap-[11px]',
    role: 'img',
    '[attr.aria-label]': 'label',
  },
  template: `
    @for (platform of platforms; track platform.name) {
      <img [src]="platform.logo" alt="" width="30" height="30" class="size-[30px] rounded-lg" />
    }
    <sk-icon name="arrow" class="mx-[3px] size-[26px] text-muted" />
    @for (tracker of trackers; track tracker.name) {
      <img [src]="tracker.logo" alt="" width="30" height="30" class="size-[30px] rounded-lg" />
    }
  `,
})
export class ServiceLogos {
  protected readonly platforms = STREAMING_PLATFORMS;
  protected readonly trackers = TRACKERS;
  // Les logos sont décoratifs : les noms sont lus d'un bloc (« Crunchyroll, ADN… → AniList, MyAnimeList »).
  protected readonly label = `${STREAMING_PLATFORMS.map((p) => p.name).join(', ')} → ${TRACKERS.map((t) => t.name).join(', ')}`;
}
