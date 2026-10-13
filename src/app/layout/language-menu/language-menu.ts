import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Language, LanguageCode } from '@domain/language';
import { Icon } from '@shared/ui/icon/icon';

/** Menu déroulant des langues, dans l'en-tête. */
@Component({
  selector: 'sk-language-menu',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'relative',
    '(document:click)': 'closeIfOutside($event)',
    '(keydown.escape)': 'open.set(false)',
  },
  template: `
    <button
      type="button"
      class="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-sm font-bold"
      [class]="open() ? 'border-violet text-moon' : 'border-ink-line text-mist hover:text-moon'"
      [attr.aria-label]="label()"
      [attr.aria-expanded]="open()"
      aria-haspopup="true"
      (click)="open.set(!open())"
    >
      <sk-icon name="globe" class="size-[18px]" />
      <span>{{ current().toUpperCase() }}</span>
    </button>
    @if (open()) {
      <ul
        class="absolute top-[calc(100%+8px)] right-0 m-0 min-w-40 list-none rounded-[14px] border border-ink-line bg-ink p-1.5 shadow-[0_18px_40px_rgb(5_8_30/0.5)]"
      >
        @for (language of languages(); track language.code) {
          <li>
            <a
              [routerLink]="['/', language.code, ...page()]"
              [attr.hreflang]="language.code"
              [attr.lang]="language.code"
              [attr.aria-current]="language.code === current() ? 'true' : null"
              class="block rounded-[9px] px-3 py-2 no-underline hover:bg-violet/20 aria-[current]:text-cyan"
              (click)="pick(language.code)"
              >{{ language.name }}</a
            >
          </li>
        }
      </ul>
    }
  `,
})
export class LanguageMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly languages = input.required<readonly Language[]>();
  readonly current = input.required<LanguageCode>();
  readonly label = input.required<string>();
  /** Page affichée, sans la langue (ex. ['changelog']) : changer de langue reste sur cette page. */
  readonly page = input<readonly string[]>([]);
  readonly picked = output<LanguageCode>();

  protected readonly open = signal(false);

  protected pick(code: LanguageCode): void {
    this.open.set(false);
    this.picked.emit(code);
  }

  protected closeIfOutside(event: Event): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
