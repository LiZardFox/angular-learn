import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, NgtArgs } from 'angular-three';
import { NgtrRigidBody } from 'angular-three-rapier';
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from 'three';
import { KanaGameStore } from '../data-access/store';

@Component({
  selector: 'game-kicker',
  template: `
    @if (kanaStore.gameState() === 'GAME' && kanaStore.currentStageKey() > 2) {
      <ngt-object3D
        rigidBody="kinematicPosition"
        [options]="{
          position: [0, 0.1, 0],
        }"
      >
        <ngt-group [position]="[3, 1, 0]">
          <ngt-mesh>
            <ngt-mesh-standard-material color="mediumpurple" />
            <ngt-box-geometry *args="[1, 0.2, 0.2]" />
          </ngt-mesh>
        </ngt-group>
      </ngt-object3D>
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtrRigidBody, NgtArgs],
})
export class Kicker {
  protected readonly kanaStore = inject(KanaGameStore);
  rigidbodyRef = viewChild(NgtrRigidBody);

  constructor() {
    extend({
      Group,
      Object3D,
      MeshStandardMaterial,
      BoxGeometry,
      Mesh,
    });

    beforeRender(({ delta }) => {
      const rigidBody = this.rigidbodyRef()?.rigidBody();
      if (!rigidBody) return;

      const { x, y, z, w } = rigidBody.rotation();
      const currentRotation = new Quaternion(x, y, z, w);
      const incrementRotation = new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0),
        delta * 8,
      );
      currentRotation.multiply(incrementRotation);
      rigidBody.setNextKinematicRotation(currentRotation);
    });
  }
}
