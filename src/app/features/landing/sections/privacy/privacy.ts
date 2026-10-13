import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PrivacyText } from '@domain/translation';
import { ExternalLink } from '@shared/ui/external-link/external-link';
import { Icon } from '@shared/ui/icon/icon';

@Component({
  selector: 'sk-privacy',
  imports: [Icon, ExternalLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'privacy', class: 'section-wrap pt-30' },
  template: `
    <div
      class="grid grid-cols-[auto_1fr] items-start gap-10 rounded-[32px] bg-ink bg-[radial-gradient(90%_120%_at_0%_0%,rgb(124_92_255/0.22),transparent_60%)] px-[clamp(24px,4vw,40px)] py-14 max-[900px]:grid-cols-1 max-[900px]:gap-5 max-[900px]:rounded-3xl"
    >
      <img
        src="assets/kai-icon.svg"
        alt=""
        width="128"
        height="128"
        class="w-32 max-[900px]:w-22"
      />
      <div>
        <h2>{{ text().title }}</h2>
        <p class="mt-3.5 max-w-[36em] text-mist">{{ text().text }}</p>
        <ul class="mt-[22px] flex list-none flex-wrap gap-x-7 gap-y-2.5 p-0">
          @for (point of text().points; track point) {
            <li class="flex items-center gap-2 font-medium">
              <sk-icon name="check" class="size-[18px] text-cyan" />
              <span>{{ point }}</span>
            </li>
          }
        </ul>
        <a
          skExternal
          [href]="policyUrl()"
          class="mt-6 inline-block font-bold text-cyan underline-offset-4"
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
