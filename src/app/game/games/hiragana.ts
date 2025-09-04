import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { extend, NgtArgs } from 'angular-three';
import { NgtrPhysics } from 'angular-three-rapier';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import { AmbientLight, Color, DirectionalLight } from 'three';
import { NgtsOrbitControls } from 'angular-three-soba/controls';

@Component({
  template: `<ngtr-physics debug>
    <ngts-perspective-camera [options]="{ fov: 30, position: 3 }" />
    <ngt-color attach="background" *args="['#ececec']" />
    <ngts-orbit-controls />
    <!-- lights -->
    <ngt-ambient-light [intensity]="1" />
    <ngt-directional-light castShadow [position]="5" [intesity]="" />
  </ngtr-physics>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtrPhysics, NgtsPerspectiveCamera, NgtArgs, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Hiragana {
  constructor() {
    extend({ Color, AmbientLight, DirectionalLight });
  }

  name(params: number) {
    const hello = 'hello';
    const world = 'world';
    return `${hello} ${world} ${params}`;
  }
}
