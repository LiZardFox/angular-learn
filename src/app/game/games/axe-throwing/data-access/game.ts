import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Game {
  axeLaunched = signal(false);

  launchAxe() {
    this.axeLaunched.set(true);
    setTimeout(() => this.axeLaunched.set(false), 2000);
  }
}
