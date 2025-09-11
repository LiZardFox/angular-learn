import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Game } from './data-access/game';
import { Balloon as BalloonType } from './data-access/game';
import { gltfResource } from 'angular-three-soba/loaders';
import { balloon } from './models';
import {
  NgtrConvexHullCollider,
  NgtrIntersectionEnterPayload,
  NgtrRigidBody,
} from 'angular-three-rapier';
import { GLTF } from 'three-stdlib';
import { Group, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { beforeRender, extend } from 'angular-three';
import { VFXEmitter } from 'wawa-vfx-vanilla';
import { PositionalAudio } from './util/positonal-audio';
import { AUDIOS } from './audio';
import { ParticleEmitter } from './util/vfx-emitter';
import { randFloat } from 'three/src/math/MathUtils.js';

@Component({
  selector: 'game-axe-throwing-balloon',
  template: `
    @if (ballonGltf.value(); as balloonModel) {
      @let nodes = balloonModel.nodes;
      @let materials = balloonModel.materials;
      <ngt-object3D
        rigidBody
        [position]="balloon().position"
        [options]="{
          mass: 0.1,
          gravityScale: -0.1,
          linearDamping: 0.2,
          angularDamping: 0.2,
          restitution: 1,
        }"
        (intersectionEnter)="onIntersection($event)"
      >
        @if (exploded()) {
          <app-positional-audio
            [url]="AUDIOS.pop"
            [loop]="false"
            [distance]="10"
            [options]="{ autoplay: true }"
          />
          <vfx-emitter
            emitterName="sparks"
            [settings]="{
              loop: false,
              spawnMode: 'burst',
              nbParticles: 200,
              duration: 1,
              size: [0.05, 0.3],
              startPositionMin: [-0.1, -0.1, -0.1],
              startPositionMax: [0.1, 0.1, 0.1],
              directionMin: [-0.1, 0, -0.1],
              directionMax: [0.1, 0.5, 0.1],
              rotationSpeedMin: [-1, -1, -10],
              rotationSpeedMax: [1, 1, 10],
              speed: [1, 7],
              colorStart: ['#' + balloon().material.color.getHexString()],
              particlesLifetime: [0.1, 1],
            }"
          />
        }
        <ngt-group [scale]="2" [visible]="!exploded()">
          <ngt-object3D
            [convexHullCollider]="[
              nodes.Balloon.geometry.attributes['position'].array,
            ]" />
          <ngt-mesh
            [geometry]="nodes.Balloon.geometry"
            [material]="balloon().material" />
          <ngt-mesh
            [geometry]="nodes.String.geometry"
            [material]="balloon().material" />
          <ngt-mesh
            [geometry]="nodes.Logo.geometry"
            [material]="materials.Logo"
        /></ngt-group>
      </ngt-object3D>
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtrRigidBody,
    NgtrConvexHullCollider,
    PositionalAudio,
    ParticleEmitter,
  ],
})
export class Balloon {
  protected readonly AUDIOS = AUDIOS;
  gameState = inject(Game);
  balloon = input.required<BalloonType>();
  ballonGltf = gltfResource<
    GLTF & {
      nodes: { Balloon: Mesh; String: Mesh; Logo: Mesh };
      materials: { Color: MeshStandardMaterial; Logo: MeshStandardMaterial };
    }
  >(() => balloon);
  exploded = signal(false);
  emitter = viewChild<ElementRef<VFXEmitter>>('emitter');
  rigidBody = viewChild(NgtrRigidBody);

  onIntersection(event: NgtrIntersectionEnterPayload) {
    if (event.other.rigidBodyObject?.name === 'axe') {
      this.exploded.set(true);
    }
  }

  constructor() {
    extend({ Mesh, Object3D, Group, WawaEmitter: VFXEmitter });

    effect(() => {
      const [exploded, ballon] = [this.exploded(), this.balloon()];
      if (exploded) {
        this.gameState.onBalloonHit();
        setTimeout(() => this.gameState.removeBalloon(ballon.id), 1000);
      }
    });
    effect(() => {
      const rigidBody = this.rigidBody()?.rigidBody();
      if (rigidBody) {
        rigidBody.applyTorqueImpulse(
          {
            x: Math.random() * 0.05,
            y: Math.random() * 0.05,
            z: Math.random() * 0.05,
          },
          true,
        );
      }
    });
    beforeRender(() => {
      const rigidBody = this.rigidBody()?.rigidBody();
      if (rigidBody && !this.exploded()) {
        const curTranslation = rigidBody.translation();
        if (curTranslation.y > 15) {
          curTranslation.y = randFloat(-7, -2);
          rigidBody.setLinvel(
            {
              x: 0,
              y: 0,
              z: 0,
            },
            false,
          );
          rigidBody.setAngvel(
            {
              x: 0,
              y: 0,
              z: 0,
            },
            false,
          );
          rigidBody.applyTorqueImpulse(
            {
              x: Math.random() * 0.05,
              y: Math.random() * 0.05,
              z: Math.random() * 0.05,
            },
            true,
          );
        }
        rigidBody.setTranslation(curTranslation, true);
      }
    });
  }
}

@Component({
  selector: 'game-axe-throwing-balloons',
  template: `
    @for (balloon of gameState.balloons(); track balloon.id) {
      <game-axe-throwing-balloon [balloon]="balloon" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Balloon],
})
export class Balloons {
  gameState = inject(Game);
}
