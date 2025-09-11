import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { beforeRender, NgtVector3 } from 'angular-three';
import { NgtsCloud } from 'angular-three-soba/staging';
import { Group } from 'three';
import { randFloatSpread } from 'three/src/math/MathUtils.js';

@Component({
  selector: 'game-cloud',
  template: `
    <ngt-group #group [position]="position()">
      <ngts-cloud
        [options]="{
          seed: seed(),
          fade: 30,
          speed: 0.1,
          growth: 4,
          segments: 40,
          volume: 6,
          opacity: 0.6,
          bounds: [4, 3, 1],
        }"
      />
      <ngts-cloud
        [options]="{
          seed: seed() + 1,
          fade: 30,
          position: [0, 1, 0],
          speed: 0.5,
          growth: 4,
          volume: 10,
          opacity: 1,
          bounds: [6, 2, 1],
        }"
      />
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtsCloud],
})
export class Cloud {
  seed = input.required<number>();
  position = input.required<NgtVector3>();
  range = input<[number, number]>([-100, 100]);
  maxVelocity = signal(2);
  group = viewChild<ElementRef<Group>>('group');
  velocity = randFloatSpread(0.5);

  constructor() {
    beforeRender(({ delta }) => {
      const [group, maxVelocity, range] = [
        this.group()?.nativeElement,
        this.maxVelocity(),
        this.range(),
      ];
      if (!group) return;
      this.velocity += randFloatSpread(0.5);
      this.velocity = Math.min(
        Math.max(this.velocity, -maxVelocity),
        maxVelocity,
      );
      group.position.x += this.velocity * delta;
      if (group.position.x > range[1]) {
        this.velocity = -this.velocity / 4;
        group.position.x = range[1];
      }
      if (group.position.x < range[0]) {
        this.velocity = -this.velocity / 4;
        group.position.x = range[0];
      }
    });
  }
}
