import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MobileNotice } from '@domain/device';
import { Icon } from '../icon/icon';

/**
 * Remplace les boutons d'installation sur mobile : l'extension ne s'installe que sur ordinateur,
 * le visiteur peut s'envoyer le lien. Le partage lui-même est fait par la page (output `share`).
 */
@Component({
  selector: 'sk-desktop-only-notice',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block max-w-[30em] rounded-(--radius-card) border border-line bg-surface p-5',
  },
  template: `
    @let n = notice();
    <p class="flex gap-3 text-left text-ink">
      <sk-icon name="desktop" class="mt-0.5 size-6 text-lavender" />
      <span>{{ n.text.text }}</span>
    </p>
    <button
      type="button"
      class="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-sakura px-[22px] py-[13px] font-extrabold text-on-fill shadow-pop transition hover:brightness-105 active:translate-y-px"
      (click)="share.emit()"
    >
      <sk-icon [name]="copied() ? 'check' : 'share'" class="size-5" />
      <span aria-live="polite">{{ copied() ? n.text.copied : n.text.share }}</span>
    </button>
    @if (n.state === 'unavailable') {
      <p class="mt-3 text-left text-sm text-muted">
        {{ n.text.manual }}
        <span class="block select-all break-all text-ink">{{ n.url }}</span>
      </p>
    }
  `,
})
export class DesktopOnlyNotice {
  readonly notice = input.required<MobileNotice>();
  readonly share = output();

  protected readonly copied = computed(() => this.notice().state === 'copied');
}
