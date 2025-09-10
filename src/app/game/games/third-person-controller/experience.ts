import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  signal,
} from '@angular/core';
import { extend, NgtArgs } from 'angular-three';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import { Color, DirectionalLight, OrthographicCamera } from 'three';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { Map, maps } from './map';
import { NgtrPhysics } from 'angular-three-rapier';
import { CharacterController } from './characeter-controller';
import { DEG2RAD } from 'three/src/math/MathUtils.js';
import { GameStateService } from './game-state.service';

@Component({
  template: `
    <ngts-perspective-camera
      [options]="{ position: 3, makeDefault: true, near: 0.1, fov: 40 }"
    />
    <ngt-color attach="background" *args="['#ececec']" />
    <ngts-environment [options]="{ preset: 'sunset' }" />
    <ngt-directional-light
      [position]="[-15, 10, 15]"
      castShadow
      [intensity]="0.65"
      [shadow-mapSize-width]="2048"
      [shadow-mapSize-height]="2048"
      [shadow-bias]="-0.00005"
    >
      <ngt-orthographic-camera
        [left]="-22"
        [right]="15"
        [top]="10"
        [bottom]="-20"
        #shadowCamera
        attach="shadow-camera"
      />
    </ngt-directional-light>

    <ngtr-physics [options]="{ paused: !mapLoaded() }">
      <ng-template>
        <game-map
          model="./models/third-person/{{ gameStateService.map() }}.glb"
          [options]="maps[gameStateService.map()]"
          [(mapLoaded)]="mapLoaded"
        />
        <game-character-controller
          [runSpeed]="runSpeed()"
          [walkSpeed]="walkSpeed()"
          [rotationSpeed]="rotationSpeed()"
          [mapLoaded]="mapLoaded()"
        />
      </ng-template>
    </ngtr-physics>

    <!-- <tweakpane-pane title="Map Selection" right="8px">
      <tweakpane-list
        [(value)]="gameStateService.map"
        [options]="mapsNames"
        label="Selected Map"
      />
      <tweakpane-folder title="Character">
        <tweakpane-number
          [(value)]="walkSpeed"
          [params]="{
            min: 0.1,
            max: 4,
            step: 0.1,
          }"
        />
        <tweakpane-number
          [(value)]="runSpeed"
          [params]="{
            min: 0.2,
            max: 12,
            step: 0.1,
          }"
        />
        <tweakpane-number
          [(value)]="rotationSpeed"
          [params]="{
            min: DEG2RAD * 0.1,
            max: DEG2RAD * 5,
            step: DEG2RAD * 0.1,
          }"
        />
      </tweakpane-folder>
    </tweakpane-pane> -->
  `,
  imports: [
    NgtsPerspectiveCamera,
    NgtArgs,
    NgtsEnvironment,
    Map,
    NgtrPhysics,
    CharacterController,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Experience {
  protected readonly maps = maps;
  protected readonly DEG2RAD = DEG2RAD;

  protected readonly mapLoaded = signal(false);
  protected readonly walkSpeed = signal(1);
  protected readonly runSpeed = signal(2);
  protected readonly rotationSpeed = signal(DEG2RAD * 1);
  protected readonly mapsNames = Object.keys(maps);

  protected readonly gameStateService = inject(GameStateService);
  constructor() {
    extend({
      Color,
      OrthographicCamera,
      DirectionalLight,
    });

    effect(() => {
      this.gameStateService.map();
      this.mapLoaded.set(false);
    });
  }
}
