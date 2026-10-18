import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KANA } from '@domain/kana';

/** Logo de l'extension 2.4.0 : Kai, « SyncKai » et son kana, comme en haut du popup et des captures. */
@Component({
  selector: 'sk-lockup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-flex items-center gap-2.5' },
  template: `
    <img src="assets/kai-icon.svg" alt="" width="32" height="32" class="size-8 max-sm:size-7" />
    <span class="font-display text-[21px] leading-none font-extrabold tracking-[-0.01em] text-ink"
      >SyncKai</span
    >
    <span aria-hidden="true" class="font-kana text-xs leading-none text-muted">{{ kana }}</span>
  `,
})
export class Lockup {
  protected readonly kana = KANA.brand;
}
