import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { extend, NgtArgs } from 'angular-three';
import {
  NgtrCuboidCollider,
  NgtrCylinderCollider,
  NgtrPhysics,
  NgtrRigidBody,
} from 'angular-three-rapier';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
} from 'three';
import { Torii } from './entities/torii';
import { NgtsMeshReflectorMaterial } from 'angular-three-soba/materials';
import { kanas } from './constants';
import { KanaGameStore } from './data-access/store';
import { KanaSpots } from './kana-spots';
import { GameStateService } from '../../data-access/game-state.service';
import { CharacterController } from './character-controller';
import { KanaMenu } from './kana-menu';
import { NgtsText } from 'angular-three-soba/abstractions';
import { Kicker } from './entities/kicker';

@Component({
  template: `<ngtr-physics
    [options]="{ debug: true, paused: gameStateService.paused() }"
  >
    <ng-template>
      <ngts-perspective-camera
        [options]="{ fov: 42, position: [0, 6, 14], makeDefault: true }"
      />
      <ngt-color attach="background" *args="['#dbecfb']" />
      <ngt-fog attach="fog" *args="['#dbecfb', 30, 40]" />
      <!-- lights -->
      <ngt-ambient-light [intensity]="1" />
      <ngt-directional-light
        castShadow
        [position]="5"
        [intesity]="0.8"
        color="#9e69da"
      />

      <!-- Background -->
      <ngt-object3D
        rigidBody="fixed"
        [options]="{ colliders: false }"
        name="void"
      >
        <ngt-mesh [position]="[0, -1.5, 0]" [rotation]="[-Math.PI / 2, 0, 0]">
          <ngt-plane-geometry *args="[50, 50]" />
          <ngts-mesh-reflector-material
            [blur]="[400, 400]"
            [resolution]="1024"
            [mixBlur]="1"
            [mixStrength]="15"
            [roughness]="1"
            [depthScale]="1"
            [minDepthThreshold]="0.85"
            [color]="'#dbecfb'"
            [metalness]="0.6"
          />
        </ngt-mesh>
        <ngt-object3D
          [cuboidCollider]="[50, 0.1, 50]"
          [position]="[0, -3.5, 0]"
          [options]="{ sensor: true }"
        />
      </ngt-object3D>

      <game-torii
        [options]="{
          scale: 16,
          position: [0, 0, -22],
          rotation: [0, Math.PI * 1.25, 0],
        }"
      />
      @if (kanaStore.currentKana(); as currentKana) {
        <ngts-text
          [fontSize]="0.82"
          [options]="{
            position: [0, -1, -20],
          }"
          [text]="currentKana.name.toUpperCase()"
        >
          <ngt-mesh-standard-material
            color="black"
            [opacity]="0.6"
            transparent
          />
        </ngts-text>
      }
      <game-torii
        [options]="{
          scale: 10,
          position: [-8, 0, -20],
          rotation: [0, Math.PI * 1.4, 0],
        }"
      />
      <game-torii
        [options]="{
          scale: 10,
          position: [8, 0, -20],
          rotation: [0, Math.PI, 0],
        }"
      />

      <ngt-group [position]="[0, -1, 0]">
        <game-kicker />
        <!-- stage -->
        <ngt-object3D
          rigidBody="fixed"
          [options]="{ colliders: false, friction: 2 }"
        >
          <ngt-object3D [cylinderCollider]="[1 / 2, 5]" />
          <ngt-mesh receiveShadow [scale]="[5, 1, 5]">
            <ngt-cylinder-geometry />
            <ngt-mesh-standard-material color="white" />
          </ngt-mesh>
        </ngt-object3D>

        <!-- character -->
        <game-character-controller [controls]="gameStateService.controls()" />

        <!-- kana -->
        <game-kana-spots />
      </ngt-group>
    </ng-template>
  </ngtr-physics>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtrPhysics,
    NgtsPerspectiveCamera,
    NgtArgs,
    NgtrRigidBody,
    NgtrCylinderCollider,
    Torii,
    NgtsMeshReflectorMaterial,
    KanaSpots,
    CharacterController,
    NgtrCuboidCollider,
    NgtsText,
    Kicker,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class KanaGame {
  protected readonly gameStateService = inject(GameStateService);
  protected readonly Math = Math;
  protected readonly kanas = kanas;
  protected readonly kanaStore = inject(KanaGameStore);
  constructor() {
    extend({
      Color,
      AmbientLight,
      DirectionalLight,
      Mesh,
      Object3D,
      MeshStandardMaterial,
      CylinderGeometry,
      PlaneGeometry,
      Group,
      Fog,
    });
    this.gameStateService.uiComponent.set(KanaMenu);
  }
}
