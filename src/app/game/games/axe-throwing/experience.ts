import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import { NgtsCameraControls } from 'angular-three-soba/controls';
import {
  beforeRender,
  createAttachFunction,
  extend,
  NgtArgs,
} from 'angular-three';
import { NgtsGrid } from 'angular-three-soba/abstractions';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import {
  BoxGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
} from 'three';
import { GradientSky } from './gradient-sky';
import { AxeController } from './axe-controller';
import { Target } from './target';
import { VFXEmitter, VFXParticles } from 'wawa-vfx-vanilla';
import { NgtsEnvironment } from 'angular-three-soba/staging';

@Component({
  selector: 'game-axe-throwing-experience',
  template: `
    <ngts-camera-controls />

    <ngt-group [position.y]="-1" [position.x]="20">
      <game-axe-throwing-target />
    </ngt-group>

    <game-axe-throwing-controller />
    <gradient-sky />
    <ngts-grid
      [options]="{
        position: [0, -10, 0],
        infiniteGrid: true,
        sectionColor: '#999',
        cellColor: '#555',
        fadeStrength: 5,
      }"
    />
    <ngt-directional-light
      [parameters]="{
        position: [30, 15, 30],
        castShadow: true,
        intensity: 1,
      }"
    >
      <ngt-value attach="shadow.mapSize.width" [rawValue]="1024" />
      <ngt-value attach="shadow.mapSize.height" [rawValue]="1024" />
      <ngt-value attach="shadow.bias" [rawValue]="-0.005" />
      <ngts-perspective-camera
        attach="shadow.camera"
        [near]="10"
        [far]="50"
        [fov]="80"
      />
    </ngt-directional-light>
    <ngts-environment [options]="{ preset: 'sunset' }" />
    <ngt-wawa-particles
      #particles
      *args="[
        'sparks',
        {
          fadeAlpha: [0, 1],
          fadeSize: [0, 0],
          gravity: [0, -9.81, 0],
          intensity: 8,
          nbParticles: 100000,
          renderMode: 'billboard',
        },
      ]"
      [attach]="attachParticles"
    />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtsCameraControls,
    NgtsGrid,
    NgtsPerspectiveCamera,
    GradientSky,
    AxeController,
    Target,
    NgtsEnvironment,
    NgtArgs,
  ],
})
export default class AxeThrowingExperience {
  particles = viewChild<ElementRef<VFXParticles>>('particles');
  attachParticles = createAttachFunction<VFXParticles>(({ store, child }) => {
    store().scene.add(child.getMesh());
  });
  constructor() {
    extend({
      MeshStandardMaterial,
      Mesh,
      BoxGeometry,
      DirectionalLight,
      Group,
      WawaParticles: VFXParticles,
      WawaEmitter: VFXEmitter,
    });

    beforeRender(({ clock }) => {
      console.log(this.particles()?.nativeElement, 'Sparkle');
      this.particles()?.nativeElement.update(clock.getElapsedTime());
    });
  }
}
