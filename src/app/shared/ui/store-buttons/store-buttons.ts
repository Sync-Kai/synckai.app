import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StoreId, StoreLink } from '@domain/store';
import { Icon } from '../icon/icon';

/** Boutons d'installation ; le store du navigateur du visiteur passe en premier et en évidence. */
@Component({
  selector: 'sk-store-buttons',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-wrap gap-3' },
  template: `
    @for (store of ordered(); track store.id) {
      <a
        [href]="store.url"
        class="inline-flex items-center gap-2.5 rounded-full border-[1.5px] px-[22px] py-[13px] font-bold no-underline transition active:translate-y-px max-sm:flex-[1_1_100%] max-sm:justify-center"
        [class]="
          store.id === preferred()
            ? 'border-transparent bg-kai text-white shadow-[0_8px_28px_rgb(124_92_255/0.35)] hover:brightness-110'
            : 'border-ink-line text-moon hover:border-cyan'
        "
      >
        <sk-icon [name]="store.id" class="size-5" />
        <span>{{ labels()[store.id] }}</span>
      </a>
    }
  `,
})
export class StoreButtons {
  readonly links = input.required<readonly StoreLink[]>();
  readonly labels = input.required<Readonly<Record<StoreId, string>>>();
  readonly preferred = input<StoreId>('chrome');

  protected readonly ordered = computed(() => {
    const preferred = this.preferred();
    return [...this.links()].sort(
      (a, b) => Number(b.id === preferred) - Number(a.id === preferred),
    );
  });
}
