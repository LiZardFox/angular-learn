import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, injectStore, NgtArgs } from 'angular-three';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DodecahedronGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  TorusGeometry,
} from 'three';
import { NgtsEnvironment, NgtsRenderTexture } from 'angular-three-soba/staging';
import { activeSlide, scenes } from './data-access/state';
import { NgtsGrid } from 'angular-three-soba/abstractions';
import { RenderTextureScene } from './render-texture-scene';
import { CameraHandler } from './camera-handler';

@Component({
  selector: 'app-scene',
  template: `
    <ngt-color attach="background" *args="['#ececec']" />

    <ngt-ambient-light [intensity]="Math.PI * 0.2" />

    <ngts-environment [options]="{ preset: 'city' }" />

    <app-camera-handler [slideDistance]="slideDistance" />

    <ngts-grid
      [options]="{
        position: [0, -viewport().height / 2, 0],
        sectionSize: 1,
        sectionColor: 'purple',
        cellSize: 0.5,
        cellColor: '6f6f6f',
        cellThickness: 0.6,
        infiniteGrid: true,
        fadeDistance: 50,
        fadeStrength: 5,
      }"
    />

    @for (scene of scenes; track scene.name) {
      <ngt-mesh
        [position]="[(viewport().width + slideDistance) * $index, 0, 0]"
      >
        <ngt-plane-geometry *args="[viewport().width, viewport().height]" />
        <ngt-mesh-basic-material [toneMapped]="false">
          <ngts-render-texture>
            <app-render-texture-scene [scene]="scene" *renderTextureContent />
          </ngts-render-texture>
        </ngt-mesh-basic-material>
      </ngt-mesh>
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtArgs,
    NgtsEnvironment,
    NgtsGrid,
    NgtsRenderTexture,
    RenderTextureScene,
    CameraHandler,
  ],
})
export class Scene {
  protected readonly Math = Math;
  protected readonly scenes = scenes;
  protected readonly slideDistance = 1;

  private store = injectStore();
  protected viewport = this.store.viewport;

  constructor() {
    extend({
      Mesh,
      BoxGeometry,
      MeshStandardMaterial,
      MeshBasicMaterial,
      Color,
      AmbientLight,
      Group,
      TorusGeometry,
      DodecahedronGeometry,
      PlaneGeometry,
    });
  }
}
