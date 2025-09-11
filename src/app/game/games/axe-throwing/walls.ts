import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { extend } from 'angular-three';
import { Object3D } from 'three';
import {
  NgtrAnyCollider,
  NgtrCuboidCollider,
  NgtrRigidBody,
} from 'angular-three-rapier';

@Component({
  selector: 'game-axe-throwing-walls',
  template: `
    <ngt-object3D rigidBody="fixed" name="walls" [position]="[0, 0, -1]" ]>
      <ngt-object3D [cuboidCollider]="[100, 100, 0.1]" />
    </ngt-object3D>
    <ngt-object3D rigidBody="fixed" name="walls" [position]="[0, 0, 1]" ]>
      <ngt-object3D [cuboidCollider]="[100, 100, 0.1]" />
    </ngt-object3D>
    <ngt-object3D rigidBody="fixed" name="walls" [position]="[7.5, 0, 0]" ]>
      <ngt-object3D [cuboidCollider]="[0.1, 100, 2]" />
    </ngt-object3D>
    <ngt-object3D rigidBody="fixed" name="walls" [position]="[18.5, 0, 0]" ]>
      <ngt-object3D [cuboidCollider]="[0.1, 100, 2]" />
    </ngt-object3D>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtrRigidBody, NgtrCuboidCollider],
})
export class Walls {
  constructor() {
    extend({ Object3D });
  }
}
