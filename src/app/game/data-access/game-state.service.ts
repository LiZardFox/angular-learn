import { effect, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  showOverlay = signal(false);

  private escapKeyPressed$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    tap((event) => console.log(event)),
    filter((event) => event.key === 'Escape'),
  );

  private escapKeyPressed = toSignal(this.escapKeyPressed$);

  constructor() {
    effect(() => {
      this.escapKeyPressed();

      this.showOverlay.set(true);
    });
  }
}
