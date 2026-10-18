import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MobileNotice } from '@domain/device';
import { KANA } from '@domain/kana';
import { StoreId, StoreLink } from '@domain/store';
import { DemoText, HeroText } from '@domain/translation';
import { DesktopOnlyNotice } from '@shared/ui/desktop-only-notice/desktop-only-notice';
import { Emphasis } from '@shared/ui/emphasis/emphasis';
import { Eyebrow } from '@shared/ui/eyebrow/eyebrow';
import { Icon } from '@shared/ui/icon/icon';
import { KanaSpine } from '@shared/ui/kana-spine/kana-spine';
import { ServiceLogos } from '@shared/ui/service-logos/service-logos';
import { StoreButtons } from '@shared/ui/store-buttons/store-buttons';
import { DemoPlayer } from '../demo-player/demo-player';

/**
 * Héros en « duo » (direction C des captures du store) : à gauche le dos ジドウ et la colonne de texte,
 * à droite une surface plus claire avec un disque et la démo (lecteur, puis la bulle de l'extension).
 */
@Component({
  selector: 'sk-hero',
  imports: [
    RouterLink,
    Icon,
    StoreButtons,
    DesktopOnlyNotice,
    DemoPlayer,
    Emphasis,
    Eyebrow,
    KanaSpine,
    ServiceLogos,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] border-b border-line max-[900px]:grid-cols-1',
  },
  template: `
    <div class="relative flex justify-end overflow-hidden">
      <div
        class="relative flex w-full max-w-[760px] flex-col justify-center py-[clamp(48px,7vw,88px)] pr-[clamp(16px,4vw,56px)] pl-[148px] max-[900px]:max-w-none max-[900px]:pl-[60px]"
      >
        <sk-kana-spine [kana]="kana" />
        @if (whatsNew(); as badge) {
          <a
            [routerLink]="badge.route"
            class="mb-7 inline-flex max-w-full items-center gap-2.5 self-start rounded-full border border-line bg-surface py-1 pr-3.5 pl-1 text-sm text-muted no-underline transition hover:border-field hover:text-ink"
          >
            <span
              class="shrink-0 rounded-full border border-field bg-raised px-2.5 py-0.5 font-extrabold text-lavender"
              >{{ badge.label }}</span
            >
            <span class="truncate">v{{ badge.version }} · {{ badge.title }}</span>
            <sk-icon name="arrow" class="size-4" />
          </a>
        }
        <sk-eyebrow [label]="hero().eyebrow" [kana]="kana" />
        <h1 class="mt-5 text-[clamp(34px,4vw,54px)]">
          <sk-emphasis [text]="hero().title" />
        </h1>
        <span class="mt-[26px] block h-[3px] w-14 rounded-sm bg-line" aria-hidden="true"></span>
        <p class="mt-[22px] max-w-[30em] text-[19px] text-muted max-sm:text-[17px]">
          {{ hero().lead }}
        </p>
        @if (mobileNotice(); as notice) {
          <sk-desktop-only-notice class="mt-8" [notice]="notice" (share)="share.emit()" />
        } @else {
          <sk-store-buttons
            class="mt-8"
            [links]="stores()"
            [labels]="storeLabels()"
            [preferred]="preferred()"
          />
          <p class="mt-3.5 text-sm text-muted">{{ note() }}</p>
        }
        <sk-service-logos class="mt-10" />
      </div>
    </div>
    <div
      class="relative flex items-center overflow-hidden bg-stage px-[clamp(16px,4vw,48px)] py-14 max-[900px]:py-10"
    >
      <div
        class="disc pointer-events-none absolute top-1/2 left-[6%] aspect-square w-[min(620px,92%)] -translate-y-1/2 max-[900px]:left-1/2 max-[900px]:w-[min(440px,110%)] max-[900px]:-translate-x-1/2"
        aria-hidden="true"
      ></div>
      <sk-demo-player class="w-full max-w-[600px]" [text]="demo()" />
    </div>
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
  /** Badge de la dernière version de l'extension, vers la page des nouveautés. */
  readonly whatsNew = input<WhatsNewBadge | null>(null);
  /** Sur mobile, remplace les boutons d'installation et la phrase qui les suit. */
  readonly mobileNotice = input<MobileNotice | null>(null);
  readonly share = output();

  protected readonly kana = KANA.hero;
}

export interface WhatsNewBadge {
  /** Étiquette (ex. « Nouveau »). */
  readonly label: string;
  readonly version: string;
  readonly title: string;
  readonly route: readonly string[];
}
