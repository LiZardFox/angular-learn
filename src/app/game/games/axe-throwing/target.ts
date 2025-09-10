import { Component, CUSTOM_ELEMENTS_SCHEMA, viewChild } from '@angular/core';
import { target } from './models';
import { gltfResource } from 'angular-three-soba/loaders';
import { beforeRender, extend, NgtArgs } from 'angular-three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { NgtrRigidBody } from 'angular-three-rapier';
import { Object3D } from 'three';

@Component({
  selector: 'game-axe-throwing-target',
  template: `
    <ngt-object3D
      rigidBody="kinematicPosition"
      name="target"
      [options]="{ colliders: 'hull' }"
    >
      @if (targetGltf.value(); as targetModel) {
        <ngt-primitive
          *args="[targetModel.scene]"
          [rotation.y]="degToRad(-90)"
          [scale]="3"
          [position.x]="0"
          [position.y]="1"
        />
      }
    </ngt-object3D>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtArgs, NgtrRigidBody],
})
export class Target {
  protected readonly degToRad = degToRad;
  targetGltf = gltfResource(() => target);
  private rigidBody = viewChild.required(NgtrRigidBody);
  constructor() {
    extend({ Object3D });

    beforeRender(({ clock }) => {
      const rb = this.rigidBody().rigidBody()!;
      rb.setTranslation(
        { x: 20, y: Math.sin(clock.getElapsedTime() * 2) * 2, z: 0 },
        true,
      );
    });
  }
}
