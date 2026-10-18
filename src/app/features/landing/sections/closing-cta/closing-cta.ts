import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MobileNotice } from '@domain/device';
import { KANA } from '@domain/kana';
import { StoreId, StoreLink } from '@domain/store';
import { CtaText } from '@domain/translation';
import { DesktopOnlyNotice } from '@shared/ui/desktop-only-notice/desktop-only-notice';
import { Emphasis } from '@shared/ui/emphasis/emphasis';
import { Eyebrow } from '@shared/ui/eyebrow/eyebrow';
import { StoreButtons } from '@shared/ui/store-buttons/store-buttons';

/** Appel final : ツヅキ (« la suite ») en grand filigrane derrière le titre et les boutons. */
@Component({
  selector: 'sk-closing-cta',
  imports: [StoreButtons, DesktopOnlyNotice, Emphasis, Eyebrow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'section-wrap relative overflow-hidden pt-[140px] pb-30 text-center max-[900px]:pt-24',
  },
  template: `
    <span
      class="pointer-events-none absolute inset-0 grid place-items-center pt-10 font-kana text-[clamp(110px,20vw,260px)] leading-none tracking-[0.06em] text-watermark select-none"
      aria-hidden="true"
      >{{ kana }}</span
    >
    <div class="relative">
      <sk-eyebrow class="justify-center" [label]="text().eyebrow" [kana]="kana" />
      <h2 class="mx-auto mt-4 max-w-[16em] text-[clamp(30px,4.6vw,50px)]">
        <sk-emphasis [text]="text().title" />
      </h2>
      <p class="mt-3.5 text-muted">{{ text().text }}</p>
      @if (mobileNotice(); as notice) {
        <sk-desktop-only-notice class="mx-auto mt-8" [notice]="notice" (share)="share.emit()" />
      } @else {
        <sk-store-buttons
          class="mt-8 justify-center"
          [links]="stores()"
          [labels]="storeLabels()"
          [preferred]="preferred()"
        />
      }
    </div>
  `,
})
export class ClosingCta {
  readonly text = input.required<CtaText>();
  readonly stores = input.required<readonly StoreLink[]>();
  readonly storeLabels = input.required<Readonly<Record<StoreId, string>>>();
  readonly preferred = input.required<StoreId>();
  /** Sur mobile, remplace les boutons d'installation. */
  readonly mobileNotice = input<MobileNotice | null>(null);
  readonly share = output();

  protected readonly kana = KANA.cta;
}
