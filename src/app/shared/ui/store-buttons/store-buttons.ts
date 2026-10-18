import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StoreId, StoreLink } from '@domain/store';
import { ExternalLink } from '../external-link/external-link';
import { Icon } from '../icon/icon';

/**
 * Boutons d'installation ; le store mis en avant passe en premier, en sakura plein (la seule action principale).
 * Un store pas encore public s'affiche comme une mention non cliquable, jamais comme un lien mort.
 */
@Component({
  selector: 'sk-store-buttons',
  imports: [Icon, ExternalLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-wrap gap-3' },
  template: `
    @for (store of ordered(); track store.id) {
      @if (store.available) {
        <a
          skExternal
          [href]="store.url"
          class="inline-flex items-center gap-2.5 rounded-full border px-[22px] py-[13px] font-extrabold no-underline transition active:translate-y-px max-sm:flex-[1_1_100%] max-sm:justify-center"
          [class]="
            store.id === preferred()
              ? 'border-transparent bg-sakura text-on-fill shadow-pop hover:brightness-105'
              : 'border-field text-ink hover:border-lavender'
          "
        >
          <sk-icon [name]="store.id" class="size-5" />
          <span>{{ labels()[store.id] }}</span>
        </a>
      } @else {
        <span
          class="inline-flex items-center gap-2.5 rounded-full border border-dashed border-line px-[22px] py-[13px] font-semibold text-muted max-sm:flex-[1_1_100%] max-sm:justify-center"
        >
          <sk-icon [name]="store.id" class="size-5" />
          <span>{{ labels()[store.id] }}</span>
        </span>
      }
    }
  `,
})
export class StoreButtons {
  readonly links = input.required<readonly StoreLink[]>();
  /** Libellé de chaque store : l'action d'installation, ou la mention « bientôt » s'il n'est pas disponible. */
  readonly labels = input.required<Readonly<Record<StoreId, string>>>();
  readonly preferred = input<StoreId>('chrome');

  // Ordre : le store mis en avant, puis les autres disponibles, puis ceux à venir.
  protected readonly ordered = computed(() => {
    const preferred = this.preferred();
    const rank = (link: StoreLink): number => (!link.available ? 2 : link.id === preferred ? 0 : 1);
    return [...this.links()].sort((a, b) => rank(a) - rank(b));
  });
}
