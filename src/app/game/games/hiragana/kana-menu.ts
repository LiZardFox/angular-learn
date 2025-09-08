import { Component, inject } from '@angular/core';
import { KanaGameStore } from './data-access/store';

@Component({
  selector: 'game-kana-menu',
  template: `
    @if (kanaStore.gameState() === 'MENU') {
      <div
        class="fixed h-full w-full top-0 left-0 bg-black opacity-50 backdrop-blur-md"
      ></div>

      <div
        class="fixed flex flex-col items-center justify-center h-full w-full top-0 left-0 gap-4"
      >
        <h1 class="text-4xl font-bold mb-8 text-white">Kana Menu</h1>
        <button
          class="px-6 py-3 bg-blue-600/60 text-white rounded hover:bg-blue-700/60 transition cursor-pointer"
          (click)="kanaStore.startGame({ stages: 6, mode: 'hiragana' })"
        >
          Start Hiragana Game
        </button>
        <button
          class="px-6 py-3 bg-blue-600/60 text-white rounded hover:bg-blue-700/60 transition"
          (click)="kanaStore.startGame({ stages: 6, mode: 'katakana' })"
        >
          Start Katakana Game
        </button>
      </div>
    }
    @if (kanaStore.gameState() === 'GAME_OVER') {
      <div
        class="fixed flex flex-col items-center justify-center h-full w-full top-0 left-0 gap-4"
      >
        <h1 class="text-4xl font-bold mb-8 text-white">
          Congratulations you are becoming a true master
        </h1>
        <p class="text-white mb-8 text-2xl">
          You made {{ kanaStore.wrongAnswers() }} mistakes
        </p>
        <button
          class="px-8 py-5 bg-blue-600/60 text-white rounded hover:bg-blue-700/60 transition cursor-pointer"
          (click)="kanaStore.goToMenu()"
        >
          Play again
        </button>
      </div>
    }
  `,
})
export class KanaMenu {
  protected readonly kanaStore = inject(KanaGameStore);
}
