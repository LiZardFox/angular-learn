import { Injectable, signal } from '@angular/core';
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
  axeLaunched = signal(false);
  balloons = signal<Balloon[]>([]);
  launchAxe() {
    if (this.axeLaunched()) return;
    this.axeLaunched.set(true);
    setTimeout(() => this.axeLaunched.set(false), 2000);
  }
  startGame() {
    this.balloons.set(
      new Array(50).fill(0).map((_, i) => ({
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
}
