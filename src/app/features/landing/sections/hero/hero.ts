import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MobileNotice } from '@domain/device';
import { StoreId, StoreLink } from '@domain/store';
import { DemoText, HeroText } from '@domain/translation';
import { DesktopOnlyNotice } from '@shared/ui/desktop-only-notice/desktop-only-notice';
import { StoreButtons } from '@shared/ui/store-buttons/store-buttons';
import { DemoPlayer } from '../demo-player/demo-player';

@Component({
  selector: 'sk-hero',
  imports: [StoreButtons, DesktopOnlyNotice, DemoPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'section-wrap grid grid-cols-[1fr_1.05fr] items-center gap-[clamp(32px,5vw,72px)] pt-[clamp(48px,8vw,96px)] pb-14 max-[900px]:grid-cols-1',
  },
  template: `
    <div>
      <h1 class="text-[clamp(38px,5vw,58px)]">{{ hero().title }}</h1>
      <p class="mt-[22px] max-w-[34em] text-[19px] text-mist">{{ hero().lead }}</p>
      @if (mobileNotice(); as notice) {
        <sk-desktop-only-notice class="mt-8" [notice]="notice" (share)="share.emit()" />
      } @else {
        <sk-store-buttons
          class="mt-8"
          [links]="stores()"
          [labels]="storeLabels()"
          [preferred]="preferred()"
        />
        <p class="mt-4 text-sm text-mist">{{ note() }}</p>
      }
    </div>
    <sk-demo-player [text]="demo()" />
  `,
})
export class Hero {
  readonly hero = input.required<HeroText>();
  /** Phrase sous les boutons, choisie par la page selon le navigateur du visiteur. */
  readonly note = input.required<string>();
  readonly demo = input.required<DemoText>();
  readonly stores = input.required<readonly StoreLink[]>();
  readonly storeLabels = input.required<Readonly<Record<StoreId, string>>>();
  readonly preferred = input.required<StoreId>();
  /** Sur mobile, remplace les boutons d'installation et la phrase qui les suit. */
  readonly mobileNotice = input<MobileNotice | null>(null);
  readonly share = output();
}
