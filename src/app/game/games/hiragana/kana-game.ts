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
  Color,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
} from 'three';
import { kanas } from './constants';
import { KanaGameStore } from './data-access/store';
import { KanaSpots } from './kana-spots';
import { GameStateService } from '../../data-access/game-state.service';
import { CharacterController } from './character-controller';
import { KanaMenu } from './kana-menu';
import { NgtsText } from 'angular-three-soba/abstractions';
import { Kicker } from './entities/kicker';
import { Stage } from './entities/stage';
import {
  NgtsContactShadows,
  NgtsEnvironment,
} from 'angular-three-soba/staging';

@Component({
  template: `<ngtr-physics [options]="{ paused: gameStateService.paused() }">
    <ng-template>
      <ngts-perspective-camera
        [options]="{ fov: 42, position: [0, 6, 14], makeDefault: true }"
      />
      <ngt-color attach="background" *args="['#dbecfb']" />
      <ngt-fog attach="fog" *args="['#dbecfb', 30, 40]" />
      <!-- lights -->
      <ngts-environment [options]="{ preset: 'sunset' }" />
      <ngt-directional-light
        castShadow
        [position]="5"
        [intesity]="0.3"
        color="#9e69da"
      />

      @if (kanaStore.currentKana(); as currentKana) {
        <ngts-text
          [options]="{
            rotation: [-Math.PI / 2, 0, 0],
            fontSize: 1.82,
          }"
          [text]="currentKana.name.toUpperCase()"
        >
          <ngt-mesh-standard-material
            color="white"
            [opacity]="0.6"
            transparent
          />
        </ngts-text>
      }
      @if (kanaStore.lastWrongKana(); as currentKana) {
        <ngts-text
          [options]="{
            position: [0, 0, 1.2],
            rotation: [-Math.PI / 2, 0, 0],
            fontSize: 1,
          }"
          [text]="currentKana.name.toUpperCase()"
        >
          <ngt-mesh-standard-material color="red" [opacity]="0.6" transparent />
        </ngts-text>
      }
      <ngt-group [position]="[0, -1, 0]">
        <game-kicker />

        <!-- Floor -->
        <ngt-object3D
          rigidBody="fixed"
          [options]="{ colliders: false }"
          name="void"
        >
          <ngt-mesh [rotation]="[-Math.PI / 2, 0, 0]">
            <ngt-plane-geometry *args="[50, 50]" />
            <ngt-mesh-basic-material color="#dbecfb" [toneMapped]="false" />
          </ngt-mesh>
          <ngt-object3D
            [cuboidCollider]="[50, 0.1, 50]"
            [position]="[0, -3.5, 0]"
            [options]="{ sensor: true }"
          />
        </ngt-object3D>
        <ngts-contact-shadows
          [options]="{
            frames: 1,
            scale: 80,
            opacity: 0.42,
            far: 50,
            blur: 0.8,
            color: '#aa9acd',
            position: [0, 0.001, 0],
          }"
        />
        <!-- stage -->
        <game-stage />
        <ngt-object3D
          rigidBody="fixed"
          [options]="{ colliders: false, friction: 2 }"
          [position]="[0, 0.5, 0]"
        >
          <ngt-object3D [cylinderCollider]="[1 / 2, 5]" />
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
    KanaSpots,
    CharacterController,
    NgtrCuboidCollider,
    NgtsText,
    Kicker,
    Stage,
    NgtsEnvironment,
    NgtsContactShadows,
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
      DirectionalLight,
      Mesh,
      Object3D,
      MeshStandardMaterial,
      MeshBasicMaterial,
      CylinderGeometry,
      PlaneGeometry,
      Group,
      Fog,
    });
    this.gameStateService.uiComponent.set(KanaMenu);
  }
}
