import { Component, inject } from "@angular/core";
import { GameStateService } from "../data-access/game-state.service";

@Component({
    selector: 'game-overlay',
    template: `
        @if (gameStateService.showOverlay()) {
            <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                <h2>Game Paused</h2>
                <button class="p-4 bg-red text-white" (click)="gameStateService.showOverlay.set(false)">Resume</button>
            </div>
        }
    `,
})
export class Overlay {
    protected readonly gameStateService = inject(GameStateService);
}