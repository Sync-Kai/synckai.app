import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StoreId, StoreLink } from '@domain/store';
import { DemoText, HeroText } from '@domain/translation';
import { StoreButtons } from '@shared/ui/store-buttons/store-buttons';
import { DemoPlayer } from '../demo-player/demo-player';

@Component({
  selector: 'sk-hero',
  imports: [StoreButtons, DemoPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'section-wrap grid grid-cols-[1fr_1.05fr] items-center gap-[clamp(32px,5vw,72px)] pt-[clamp(48px,8vw,96px)] pb-14 max-[900px]:grid-cols-1',
  },
  template: `
    <div>
      <h1 class="text-[clamp(38px,5vw,58px)]">{{ hero().title }}</h1>
      <p class="mt-[22px] max-w-[34em] text-[19px] text-mist">{{ hero().lead }}</p>
      <sk-store-buttons
        class="mt-8"
        [links]="stores()"
        [labels]="storeLabels()"
        [preferred]="preferred()"
      />
      <p class="mt-4 text-sm text-mist">{{ hero().note }}</p>
    </div>
    <sk-demo-player [text]="demo()" />
  `,
})
export class Hero {
  readonly hero = input.required<HeroText>();
  readonly demo = input.required<DemoText>();
  readonly stores = input.required<readonly StoreLink[]>();
  readonly storeLabels = input.required<Readonly<Record<StoreId, string>>>();
  readonly preferred = input.required<StoreId>();
}
