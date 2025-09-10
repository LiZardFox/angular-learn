import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, merge, scan } from 'rxjs';

type KeyboardControls = {
  [key: string]: string[];
};

type BooleanKeyboardControls<T extends KeyboardControls> = {
  [K in keyof T]: boolean;
};

export function injectKeyboardControls<T extends KeyboardControls>(
  controls: T,
) {
  const keyCodes = new Set(Object.values(controls).flat());

  const keyboardControlsService = inject(KeyboardControlsService);
  const controls$ = keyboardControlsService.keyboardEvents$.pipe(
    filter((e) => keyCodes.has(e.code)),
    scan((next, curr) => {
      if (curr.type === 'keydown') next.add(curr.code);
      else next.delete(curr.code);
      return next;
    }, new Set<string>()),
    map((keys) => {
      const activeControls: Record<string, boolean> = {};
      for (const [control, keyCodes] of Object.entries(controls)) {
        activeControls[control] = keyCodes.some((keyCode) => keys.has(keyCode));
      }
      return activeControls as BooleanKeyboardControls<T>;
    }),
  );
  return toSignal(controls$, {
    initialValue: Object.fromEntries(
      Object.keys(controls).map((key) => [key, false]),
    ) as BooleanKeyboardControls<T>,
  });
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardControlsService {
  keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');
  keyup$ = fromEvent<KeyboardEvent>(document, 'keyup');
  keyboardEvents$ = merge(this.keydown$, this.keyup$);
}
