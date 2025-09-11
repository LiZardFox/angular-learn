import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { extend, NgtVector3 } from 'angular-three';
import { NgtsGrid } from 'angular-three-soba/abstractions';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import {
  CircleGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
} from 'three';
import { GradientSky } from './gradient-sky';
import { AxeController } from './axe-controller';
import { Target } from './target';
import { RenderMode } from 'wawa-vfx-vanilla';
import { NgtsClouds, NgtsEnvironment } from 'angular-three-soba/staging';
import { Balloons } from './balloons';
import { Particles } from './util/vfx-particles';
import { ParticleEmitter } from './util/vfx-emitter';
import { Game } from './data-access/game';
import { NgtsCameraControls } from 'angular-three-soba/controls';
import { Walls } from './walls';
import { AncientRuin } from './ancient-ruin';
import { degToRad, randFloat } from 'three/src/math/MathUtils.js';
import { Cloud } from './cloud';
import { gltfResource } from 'angular-three-soba/loaders';
import { axeSmallApp } from './models';
import { GLTF } from 'three-stdlib';

@Component({
  selector: 'game-axe-throwing-experience',
  template: `
    <ngts-camera-controls
      [options]="{
        mouseButtons: { left: 0, middle: 0, right: 0, wheel: 0 },
        touches: { one: 0, two: 0, three: 0 },
      }"
    />
    <ngt-group [position.y]="-1" [position.x]="20">
      <game-axe-throwing-target />
    </ngt-group>

    <vfx-emitter
      emitterName="stars"
      [settings]="{
        duration: 10,
        delay: 0,
        nbParticles: 2000,
        spawnMode: 'time',
        loop: true,
        startPositionMin: [-10, -20, -20],
        startPositionMax: [30, 20, 20],
        startRotationMin: [0, 0, 0],
        startRotationMax: [0, 0, 0],
        particlesLifetime: [4, 10],
        speed: [0, 0.2],
        directionMin: [-1, -1, -1],
        directionMax: [1, 1, 1],
        rotationSpeedMin: [0, 0, 0],
        rotationSpeedMax: [0, 0, 0],
        colorStart: ['#ffffff', '#b7b0e3', 'pink'],
        size: [0.05, 0.2],
      }"
    />
    <game-axe-throwing-walls />
    <game-axe-throwing-balloons />
    <game-axe-throwing-controller />
    <gradient-sky />
    <ngts-clouds [options]="{ limit: 400 }">
      @for (cloud of clouds(); track cloud.id) {
        <game-cloud
          [seed]="cloud.seed"
          [position]="cloud.position"
          [range]="cloud.range"
        />
      }
    </ngts-clouds>
    <ngts-grid
      [options]="{
        position: [0, -10, 0],
        infiniteGrid: true,
        sectionColor: '#999',
        cellColor: '#555',
        fadeStrength: 5,
      }"
    />
    <ngt-directional-light [intensity]="2" [position]="[30, 15, 30]" castShadow>
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
    <game-axe-throwing-ancient-ruin
      [options]="{
        scale: 3,
        rotation: [0, degToRad(-90), 0],
        position: [10, -8, 0],
      }"
    />
    <ngts-environment
      [options]="{ preset: 'sunset', environmentIntensity: 0.3 }"
    />
    <vfx-particles
      name="stars"
      [settings]="{
        fadeAlpha: [0.5, 0.5],
        fadeSize: [0.5, 0.5],
        gravity: [0, 0, 0],
        intensity: 5,
        nbParticles: 2000,
        renderMode: RenderMode.Billboard,
      }"
      [geometry]="circleGeometry"
    />
    <vfx-particles
      name="sparks"
      [settings]="{
        fadeAlpha: [0, 1],
        fadeSize: [0, 0],
        gravity: [0, -9.81, 0],
        intensity: 8,
        nbParticles: 23000,
        renderMode: RenderMode.Billboard,
      }"
    />
    <vfx-particles
      name="axes"
      [geometry]="axeGeometry()"
      [settings]="{
        fadeAlpha: [0, 0],
        fadeSize: [0, 1],
        intensity: 2,
        nbParticles: 40,
        renderMode: RenderMode.Mesh,
      }"
    />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtsGrid,
    NgtsPerspectiveCamera,
    GradientSky,
    AxeController,
    Target,
    NgtsEnvironment,
    Balloons,
    Particles,
    ParticleEmitter,
    NgtsCameraControls,
    Walls,
    AncientRuin,
    NgtsClouds,
    Cloud,
  ],
})
export default class AxeThrowingExperience {
  protected RenderMode = RenderMode;
  protected readonly degToRad = degToRad;

  private gameState = inject(Game);
  private controls = viewChild(NgtsCameraControls);

  clouds = signal(this.generateClouds());
  circleGeometry = new CircleGeometry(0.1, 20);

  private smallAxeGltf = gltfResource<
    GLTF & {
      nodes: {
        Axe_small: Mesh;
      };
    }
  >(() => axeSmallApp);
  protected axeGeometry = computed(() => {
    return this.smallAxeGltf.value()?.nodes.Axe_small.geometry;
  });

  generateClouds() {
    return Array(2)
      .fill(0)
      .map((_, index) => ({
        id: `cloud-${index}`,
        seed: randFloat(1, 100),
        position: [
          randFloat(-20, 0) + index * 10,
          randFloat(10, 15),
          randFloat(-2, 2),
        ] as NgtVector3,
        range: [-30, 40] as [number, number],
      }));
  }
  constructor() {
    extend({
      MeshStandardMaterial,
      Mesh,
      DirectionalLight,
      Group,
    });

    effect(() => {
      const [axeLaunched, throws, firstGame] = [
        this.gameState.axeLaunched(),
        this.gameState.throws(),
        this.gameState.firstGame(),
      ];

      const controls = this.controls()?.controls();
      if (!controls) return;

      if (firstGame) {
        controls.setLookAt(-15, -5, 20, 10, 0, 0, true);
      } else if (axeLaunched || throws === 0) {
        if (window.innerWidth < 1024) {
          controls.setLookAt(-10, 10, 40, 10, 0, 0, true);
        } else {
          controls.setLookAt(10, 0, 30, 10, 0, 0, true);
        }
      } else {
        controls.setLookAt(-0.1, 0, 0, 0, 0, 0, true);
      }
    });
  }
}
