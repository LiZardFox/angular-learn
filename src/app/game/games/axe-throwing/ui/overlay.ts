import { Component, computed, inject } from '@angular/core';
import { Game } from '../data-access/game';

@Component({
  selector: 'game-axe-throwing-overlay',
  template: `
    <section
      class="fixed inset-0 z-10 flex items-center justify-center pointer-events-none transition-colors duration-500"
      [class]="backgroundClasses()"
    >
      <div
        class="absolute left-4 md:left-15 -translate-x-1/2 -rotate-90 flex items-center gap-4 animation-delay-1500 animate-fade-in-down opacity-0"
      >
        <div class="w-20 h-px bg-white/60"></div>
        <p class="text-white/60 text-xs">Break the curse</p>
      </div>

      <div
        class="p-4 flex flex-col items-center gap-2 md:gap-4 mt-[50vh] animate-fade-in-up opacity-0 animation-delay-1000"
      >
        @if (gameState.throws() === 0) {
          <h1
            class="bold text-white/80 text-4xl md:text-5xl font-extrabold text-center"
          >
            🪓 Training Center
          </h1>
          <p class="text-white/70 text-sm">
            Become an axe master and break the curse of the temple by exploding
            balloons. 🎈 <br />
          </p>
          <button
            class="bg-white/80 text-black font-bold px-4 py-2 rounded-lg shadow-md hover:bg-white/100 transition duration-200 pointer-events-auto cursor-pointer"
            (click)="gameState.startGame()"
          >
            Start Game
          </button>
        }
      </div>
      <div
        class="absolute right-4 top-4 flex flex-col items-end justify-center gap-4"
      >
        <div class="flex flex-col items-center gap-2 saturate-0">
          <p>
            @for (throw of throws(); track $index) {
              <span class="text-white text-6xl"> 🪓 </span>
            }
          </p>
        </div>
        @if (!gameState.firstGame()) {
          <div class="text-right">
            <p class="text-sm font-medium text-white">SCORE</p>
            <p class="text-6xl text-white font-bold">
              {{ gameState.score() }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-white">HIGH SCORE</p>
            <p class="text-4xl text-white font-bold">
              {{ gameState.highScore() }}
            </p>
          </div>
          <p class="text-3xl text-white font-bold">
            🎈 {{ gameState.balloonsHit() }}
          </p>
          <p class="text-3xl text-white font-bold">
            🎯 {{ gameState.targetsHit() }}
          </p>
        }
      </div>
    </section>
  `,
})
export class AxeThrowingOverlay {
  gameState = inject(Game);
  throws = computed(() => Array(this.gameState.throws()).fill(0));
  backgroundClasses = computed(() => {
    const [throws] = [this.gameState.throws()];
    const showMenu = throws === 0;
    return {
      'bg-black/20': showMenu,
      'bg-background-blur': showMenu,
    };
  });
}
