import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  beforeRender,
  extend,
  injectStore,
  is,
  NgtArgs,
  NgtPortal,
  NgtPortalAutoRender,
} from 'angular-three';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import { GameStateService } from './game-state.service';
import { gltfResource } from 'angular-three-soba/loaders';
import { GLTF } from 'three-stdlib';
import { maps, Map } from './map';
import { NgtsEnvironment, NgtsRenderTexture } from 'angular-three-soba/staging';

@Component({
  selector: 'game-material',
  template: `
    <ngt-mesh-standard-material>
      <ngts-render-texture>
        <ng-template renderTextureContent>
          <ngt-color attach="background" *args="['#ececec']" />
          <ngt-ambient-light [intensity]="0.5" />
          <ngts-environment [options]="{ preset: 'sunset' }" />
          <ngts-perspective-camera
            #camera
            [options]="{
              makeDefault: true,
            }"
          />
          <ngt-primitive *args="[model()]" [parameters]="options()" #mapModel />
        </ng-template>
      </ngts-render-texture>
    </ngt-mesh-standard-material>
  `,
  imports: [NgtsRenderTexture, NgtArgs, NgtsPerspectiveCamera, NgtsEnvironment],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Material {
  protected readonly maps = maps;
  protected readonly Math = Math;

  map = input.required<keyof typeof maps>();

  private modelPath = computed(() => {
    return `./models/third-person/${this.map()}.glb`;
  });
  protected gltf = gltfResource<GLTF>(this.modelPath);
  protected model = computed(() => {
    const gltf = this.gltf.value();
    if (!gltf) return null;

    const { scene } = gltf;
    scene.traverse((obj) => {
      if (is.three<Mesh>(obj, 'isMesh')) {
        obj.receiveShadow = obj.castShadow = true;
      }
    });

    scene.name = 'minimap-model';

    return scene;
  });
  protected options = computed(() => maps[this.map()]);

  private gameStateService = inject(GameStateService);
  private readonly tmpVector = new Vector3();
  private cameraRef = viewChild.required(NgtsPerspectiveCamera);
  private mapModelRef = viewChild.required<ElementRef<Group>>('mapModel');
  constructor() {
    extend({
      MeshStandardMaterial,
      Color,
      AmbientLight,
      DirectionalLight,
      Group,
    });
    beforeRender(() => {
      const characterPosition = this.gameStateService.characterPosition();
      const camera = this.cameraRef().cameraRef().nativeElement;
      const mapModel = this.mapModelRef().nativeElement;
      if (characterPosition) {
        this.tmpVector.set(
          characterPosition.x,
          characterPosition.y + 12,
          characterPosition.z,
        );
        camera.position.copy(this.tmpVector);
        this.tmpVector.set(
          characterPosition.x,
          characterPosition.y,
          characterPosition.z,
        );
        camera.lookAt(this.tmpVector);
      }
    });
  }
}

@Component({
  selector: 'game-minimap-view',
  template: `<ngt-portal autoRender [container]="scene()">
    <ng-template portalContent>
      <ngts-perspective-camera
        [options]="{
          makeDefault: true,
          position: [0, 0, 5],
        }"
      />
      <ngt-ambient-light [intensity]="1" />
      <ngt-mesh #sphere [position]="spherePosition()">
        <ngt-sphere-geometry *args="[1]" />
        <game-material [map]="gameStateService.map()" />
      </ngt-mesh>
    </ng-template>
  </ngt-portal>`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtPortal,
    NgtPortalAutoRender,
    NgtArgs,
    NgtsPerspectiveCamera,
    Material,
  ],
})
export class MinimapView {
  protected readonly Math = Math;
  private store = injectStore();
  protected gameStateService = inject(GameStateService);
  protected spherePosition = computed<[number, number, number]>(() => [
    -this.store.viewport.width() / 2 + 0.5,
    this.store.viewport.height() / 2 - 0.75,
    0,
  ]);

  protected scene = computed(() => {
    const scene = new Scene();
    scene.name = 'hud-view-mini-map-scene';
    return scene;
  });

  private sphere = viewChild<ElementRef<Mesh>>('sphere');

  constructor() {
    extend({
      Mesh,
      SphereGeometry,
      MeshStandardMaterial,
      AmbientLight,
      Color,
      PlaneGeometry,
    });
    const matrix = new Matrix4();
    beforeRender(({ camera }) => {
      const sphere = this.sphere()?.nativeElement;
      if (sphere) {
        matrix.copy(camera.matrix).invert();
        sphere.quaternion.setFromRotationMatrix(matrix);
      }
    });
  }
}
