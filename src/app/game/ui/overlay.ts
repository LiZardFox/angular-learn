import { Component, inject } from '@angular/core';
import { GameStateService } from '../data-access/game-state.service';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'game-overlay',
  template: `
    @if (gameStateService.paused()) {
      <div
        class="fixed top-0 left-0 w-full h-full bg-black opacity-50 flex flex-col items-center justify-center z-50"
      ></div>
      <div
        class="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-around z-50"
      >
        <h2 class="top-1/5 text-8xl text-white">Game Paused</h2>
        <button
          class="p-4 bg-red-800 rounded-full text-white cursor-pointer w-1/3 opacity-100"
          (click)="gameStateService.paused.set(false)"
        >
          Resume
        </button>

        <a
          class="p-4 bg-blue-800 rounded-full text-white cursor-pointer w-1/3 opacity-100"
          routerLink="/game"
        >
          Back to Menu
        </a>
      </div>
    }
    @if (gameStateService.uiComponent(); as uiComponent) {
      <ng-container *ngComponentOutlet="uiComponent" />
    }
  `,
  imports: [NgComponentOutlet, RouterLink],
})
export class Overlay {
  protected readonly gameStateService = inject(GameStateService);
}
