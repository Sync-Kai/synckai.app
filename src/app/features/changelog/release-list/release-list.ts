import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LocalizedRelease } from '@domain/release';
import { Icon } from '@shared/ui/icon/icon';

/** Une version telle qu'affichée : textes dans la langue de la page et date déjà écrite. */
export interface DisplayedRelease extends LocalizedRelease {
  readonly displayDate: string;
}

/** Liste des versions, de la plus récente à la plus ancienne. Chaque version a une ancre #v<numéro>. */
@Component({
  selector: 'sk-release-list',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    @for (release of releases(); track release.version) {
      <article
        [id]="'v' + release.version"
        class="grid scroll-mt-24 grid-cols-[150px_1fr] gap-x-8 gap-y-3 border-t border-line py-9 first:border-t-0 max-sm:grid-cols-1"
      >
        <div>
          <p class="font-display text-xl font-extrabold text-lavender">v{{ release.version }}</p>
          <p class="mt-1 text-sm text-muted">
            <time [attr.datetime]="release.date">{{ release.displayDate }}</time>
          </p>
        </div>
        <div>
          <h2 class="text-[clamp(21px,2.4vw,26px)]">{{ release.title }}</h2>
          <ul class="mt-4 space-y-2.5">
            @for (item of release.highlights; track $index) {
              <li class="flex gap-3 text-muted">
                <span
                  class="mt-[5px] grid size-[18px] shrink-0 place-items-center rounded-full bg-mint text-on-fill"
                >
                  <sk-icon name="check" class="size-[11px]" />
                </span>
                <span>{{ item }}</span>
              </li>
            }
          </ul>
        </div>
      </article>
    }
  `,
})
export class ReleaseList {
  readonly releases = input.required<readonly DisplayedRelease[]>();
}
