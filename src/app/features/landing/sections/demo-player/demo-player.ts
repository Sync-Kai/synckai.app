import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { BrowserEnvironment } from '@core/platform/browser-environment';
import { formatPlaybackTime, interpolate } from '@domain/playback';
import { DemoText } from '@domain/translation';
import { Icon } from '@shared/ui/icon/icon';

/** Étapes de la démo : lecture, générique (la synchro part), épisode enregistré. */
type DemoPhase = 'playing' | 'credits' | 'saved';

const EPISODE_SECONDS = 23 * 60 + 40;
const START = 0.8;
const CREDITS = 0.92;
const END = 0.97;
const CREDIT_NAMES = ['K. Aoyama', 'M. Tsukishiro', 'H. Imai', 'R. Kanda', 'Studio Nagi'];

/**
 * Démo du héros : la tête de lecture atteint le marqueur du générique, puis l'épisode
 * passe de 7 à 8 dans la liste. Lancée quand elle devient visible ; état final direct
 * si le visiteur demande moins d'animations.
 */
@Component({
  selector: 'sk-demo-player',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './demo-player.css',
  templateUrl: './demo-player.html',
  host: {
    role: 'figure',
    '[attr.aria-label]': 'text().label',
    '[class.credits]': "phase() !== 'playing'",
    '[class.saved]': "phase() === 'saved'",
  },
})
export class DemoPlayer {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly browser = inject(BrowserEnvironment);
  private readonly destroyRef = inject(DestroyRef);

  readonly text = input.required<DemoText>();

  protected readonly position = signal(START);
  protected readonly phase = signal<DemoPhase>('playing');
  protected readonly creditsMark = `${CREDITS * 100}%`;
  protected readonly progress = computed(() => `${(this.position() * 100).toFixed(2)}%`);
  protected readonly time = computed(() => formatPlaybackTime(this.position() * EPISODE_SECONDS));
  protected readonly duration = formatPlaybackTime(EPISODE_SECONDS);
  protected readonly credits = computed(() =>
    this.text().roll.map((role, i) => ({ role, name: CREDIT_NAMES[i % CREDIT_NAMES.length] })),
  );

  private frame = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    afterNextRender(() => {
      this.destroyRef.onDestroy(() => this.stop());
      // Sans IntersectionObserver (très vieux navigateurs, tests) : la démo démarre tout de suite.
      if (typeof IntersectionObserver === 'undefined') {
        this.play();
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer.disconnect();
            this.play();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(this.host.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected play(): void {
    this.stop();
    this.phase.set('playing');
    this.position.set(START);
    if (this.browser.prefersReducedMotion) {
      this.position.set(CREDITS);
      this.phase.set('saved');
      return;
    }
    this.later(700, () =>
      this.tween(START, CREDITS, 3200, () => {
        this.phase.set('credits');
        this.later(700, () => this.phase.set('saved'));
        this.tween(CREDITS, END, 9000);
      }),
    );
  }

  private tween(from: number, to: number, ms: number, done?: () => void): void {
    const start = performance.now();
    const step = (now: number): void => {
      const k = (now - start) / ms;
      this.position.set(interpolate(from, to, k));
      if (k < 1) {
        this.frame = requestAnimationFrame(step);
      } else {
        done?.();
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  private later(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }

  // Arrête l'animation en cours (rejouer, ou composant détruit) pour ne laisser aucun minuteur actif.
  private stop(): void {
    cancelAnimationFrame(this.frame);
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}
