import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '@core/i18n/language.service';
import { SeoService } from '@core/seo/seo.service';

/**
 * Page racine (et pages introuvables) : envoie le visiteur vers sa langue.
 * Le HTML prérendu garde des liens vers chaque langue, pour les robots et sans JavaScript.
 */
@Component({
  selector: 'sk-language-redirect',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid min-h-screen place-items-center' },
  template: `
    <nav aria-label="Language" class="flex gap-6">
      @for (language of languages.languages; track language.code) {
        <a
          [routerLink]="['/', language.code]"
          [attr.hreflang]="language.code"
          [attr.lang]="language.code"
          class="text-lavender"
          >{{ language.name }}</a
        >
      }
    </nav>
  `,
})
export class LanguageRedirect {
  protected readonly languages = inject(LanguageService);
  private readonly router = inject(Router);

  constructor() {
    inject(SeoService).applyRoot();
    afterNextRender(() => {
      void this.router.navigate(['/', this.languages.detect()], { replaceUrl: true });
    });
  }
}
