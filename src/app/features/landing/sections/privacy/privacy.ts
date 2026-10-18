import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PrivacyText } from '@domain/translation';
import { Emphasis } from '@shared/ui/emphasis/emphasis';
import { ExternalLink } from '@shared/ui/external-link/external-link';
import { Icon } from '@shared/ui/icon/icon';

@Component({
  selector: 'sk-privacy',
  imports: [Icon, ExternalLink, Emphasis],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'privacy', class: 'section-wrap pt-28 max-[900px]:pt-20' },
  template: `
    <div
      class="grid grid-cols-[auto_1fr] items-center gap-10 rounded-(--radius-block) border border-line bg-surface px-[clamp(22px,4vw,48px)] py-[clamp(32px,5vw,52px)] max-[900px]:grid-cols-1 max-[900px]:gap-5"
    >
      <img
        src="assets/kai-icon.svg"
        alt=""
        width="128"
        height="128"
        class="w-32 max-[900px]:w-22"
      />
      <div>
        <h2><sk-emphasis [text]="text().title" /></h2>
        <p class="mt-3.5 max-w-[36em] text-muted">{{ text().text }}</p>
        <ul class="mt-[22px] flex list-none flex-wrap gap-x-7 gap-y-2.5 p-0">
          @for (point of text().points; track point) {
            <li class="flex items-center gap-2 font-bold">
              <span class="grid size-5 place-items-center rounded-full bg-mint text-on-fill">
                <sk-icon name="check" class="size-3" />
              </span>
              <span>{{ point }}</span>
            </li>
          }
        </ul>
        <a
          skExternal
          [href]="policyUrl()"
          class="mt-6 inline-block font-extrabold text-lavender underline-offset-4"
          >{{ text().link }}</a
        >
      </div>
    </div>
  `,
})
export class Privacy {
  readonly text = input.required<PrivacyText>();
  readonly policyUrl = input.required<string>();
}
