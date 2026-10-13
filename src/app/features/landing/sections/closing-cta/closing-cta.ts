import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MobileNotice } from '@domain/device';
import { StoreId, StoreLink } from '@domain/store';
import { DesktopOnlyNotice } from '@shared/ui/desktop-only-notice/desktop-only-notice';
import { StoreButtons } from '@shared/ui/store-buttons/store-buttons';

@Component({
  selector: 'sk-closing-cta',
  imports: [StoreButtons, DesktopOnlyNotice],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'section-wrap pt-[140px] pb-30 text-center' },
  template: `
    <h2 class="mx-auto max-w-[16em] text-[clamp(30px,4.6vw,48px)]">{{ title() }}</h2>
    <p class="mt-3.5 text-mist">{{ text() }}</p>
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
  `,
})
export class ClosingCta {
  readonly title = input.required<string>();
  readonly text = input.required<string>();
  readonly stores = input.required<readonly StoreLink[]>();
  readonly storeLabels = input.required<Readonly<Record<StoreId, string>>>();
  readonly preferred = input.required<StoreId>();
  /** Sur mobile, remplace les boutons d'installation. */
  readonly mobileNotice = input<MobileNotice | null>(null);
  readonly share = output();
}
