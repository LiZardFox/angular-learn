import { computed, effect, Injectable, signal, untracked } from '@angular/core';
import { MeshStandardMaterial, Vector3 } from 'three';
import { randFloat, randFloatSpread } from 'three/src/math/MathUtils.js';

const BALLOON_COLORS = [
  '#fff',
  '#b7b0e3',
  '#ffb3c1',
  '#ffecb3',
  '#b3ffec',
  '#b3d9ff',
];

const ballonMaterials: Record<string, MeshStandardMaterial> = {};

BALLOON_COLORS.forEach((color) => {
  ballonMaterials[color] = new MeshStandardMaterial({
    color,
    metalness: 0.3,
    roughness: 0.7,
  });
});

export interface Balloon {
  id: string;
  position: Vector3;
  material: MeshStandardMaterial;
}

@Injectable({
  providedIn: 'root',
})
export class Game {
  firstGame = signal(true);
  axeLaunched = signal(false);
  balloons = signal<Balloon[]>([]);
  balloonsHit = signal(0);
  targetsHit = signal(0);
  throws = signal(0);
  highScore = signal(0);

  readonly score = computed(
    () => this.balloonsHit() * 5 + this.targetsHit() * 25,
  );
  launchAxe() {
    if (this.axeLaunched() || this.throws() <= 0) return;
    this.axeLaunched.set(true);
    this.throws.update((t) => t - 1);
    setTimeout(() => this.axeLaunched.set(false), 2000);
  }
  startGame() {
    this.firstGame.set(false);
    this.throws.set(3);
    this.balloonsHit.set(0);
    this.targetsHit.set(0);
    this.axeLaunched.set(false);
    this.balloons.set(
      new Array(75).fill(0).map((_, i) => ({
        id: `balloon_${i}_${Math.random()}`,
        position: new Vector3(
          randFloat(8, 18),
          randFloat(-20, 0),
          randFloatSpread(1),
        ),
        material:
          ballonMaterials[
            BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]
          ],
      })),
    );
  }
  removeBalloon(id: string) {
    this.balloons.set(this.balloons().filter((b) => b.id !== id));
  }
  onBalloonHit() {
    this.balloonsHit.update((h) => h + 1);
  }
  onTargetHit() {
    this.targetsHit.update((h) => h + 1);
  }

  constructor() {
    this.loadHighScore();
    effect(() => {
      const [score, highScore] = [this.score(), untracked(this.highScore)];
      if (score > highScore) {
        this.highScore.set(score);
        this.saveHighScore(highScore);
      }
    });
  }

  saveHighScore(highScore: number) {
    localStorage.setItem('axe-throwing-high-score', highScore.toString());
  }

  loadHighScore() {
    const saved = localStorage.getItem('axe-throwing-high-score');
    if (saved) {
      this.highScore.set(parseInt(saved, 10));
    }
  }
}
