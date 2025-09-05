import { effect, Injectable, signal, Type } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, merge, scan } from 'rxjs';

export const controls = {
  forward: ['KeyW', 'ArrowUp'],
  backward: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
};

const keyCodes = new Set(Object.values(controls).flat());

export type Control = keyof typeof controls;

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  paused = signal(false);
  uiComponent = signal<Type<any> | null>(null);

  keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');
  keyup$ = fromEvent<KeyboardEvent>(document, 'keyup');
  controls$ = merge(this.keydown$, this.keyup$).pipe(
    filter((e) => keyCodes.has(e.code)),
    scan((next, curr) => {
      if (curr.type === 'keydown') next.add(curr.code);
      else next.delete(curr.code);
      return next;
    }, new Set<string>()),
    map((keys) => {
      const activeControls = new Set<string>();
      for (const [control, keyCodes] of Object.entries(controls)) {
        if (keyCodes.some((keyCode) => keys.has(keyCode))) {
          activeControls.add(control);
        }
      }
      return activeControls as Set<Control>;
    }),
  );
  controls = toSignal(this.controls$, {
    initialValue: new Set<Control>(),
  });

  private escapKeyPressed$ = this.keydown$.pipe(
    filter((event) => event.key === 'Escape' && !event.repeat),
  );

  private escapKeyPressed = toSignal(this.escapKeyPressed$);

  constructor() {
    effect(() => {
      const keyPressed = this.escapKeyPressed();
      if (keyPressed) {
        this.paused.update((value) => !value);
      }
    });
  }
}
