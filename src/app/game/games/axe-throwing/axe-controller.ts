import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { gltfResource } from 'angular-three-soba/loaders';
import { axeSmall } from './models';
import { beforeRender, NgtArgs } from 'angular-three';
import {
  NgtrIntersectionEnterPayload,
  NgtrRigidBody,
} from 'angular-three-rapier';
import { Game } from './data-access/game';
import { RigidBodyType, Vector } from '@dimforge/rapier3d-compat';
import { ParticleEmitter } from './util/vfx-emitter';
import { PositionalAudio } from './util/positonal-audio';
import { AUDIOS } from './audio';

@Component({
  selector: 'game-axe-throwing-controller',
  template: `
    <ngt-group>
      <app-positional-audio
        [url]="AUDIOS.impact"
        [loop]="false"
        [distance]="10"
        [options]="{ autoplay: false }"
        #impactSound
      />
      @if (impact(); as impact) {
        <ngt-group [position]="[impact.x, impact.y, impact.z]">
          <vfx-emitter
            emitterName="sparks"
            [settings]="{
              spawnMode: 'burst',
              nbParticles: 8000,
              duration: 1,
              size: [0.01, 0.62],
              startPositionMin: [0, 0, 0],
              startPositionMax: [0, 0, 0],
              directionMin: [-1, -1, -1],
              directionMax: [1, 1, 1],
              rotationSpeedMin: [-1, -1, -10],
              rotationSpeedMax: [1, 1, 10],
              speed: [0.1, 10],
              particlesLifetime: [0.1, 1],
              colorStart: ['orange'],
            }"
          />
        </ngt-group>
      }
      <ngt-object3D
        rigidBody="kinematicPosition"
        [position]="[0, 1, 5]"
        [options]="{ colliders: 'hull', sensor: true }"
        (intersectionEnter)="onIntersectiton($event)"
        name="axe"
      >
        <app-positional-audio
          [url]="AUDIOS.throw"
          [loop]="false"
          [distance]="50"
          [options]="{ autoplay: false }"
          #throwSound
        />
        @if (axeGltf.value(); as axeGltf) {
          <ngt-primitive *args="[axeGltf.scene]" [position.y]="-0.3" />
        }
        @if (gameState.axeLaunched() && !impact()) {
          <ngt-group>
            <vfx-emitter
              emitterName="axes"
              [settings]="{
                loop: true,
                spawnMode: 'time',
                nbParticles: 40,
                particlesLifetime: [1, 1],
                duration: 1.5,
                size: [1, 1],
                startPositionMin: [0, 0, 0],
                startPositionMax: [0, 0, 0],
                directionMin: [0, 0, 0],
                directionMax: [0, 0, 0],
                startRotationMin: [0, 0, 0],
                startRotationMax: [0, 0, 0],
                speed: [0.1, 2],
                colorStart: ['#424242'],
              }"
            />
          </ngt-group>
        }
      </ngt-object3D>
    </ngt-group>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs, NgtrRigidBody, ParticleEmitter, PositionalAudio],
})
export class AxeController implements OnInit, OnDestroy {
  protected readonly AUDIOS = AUDIOS;
  axeGltf = gltfResource(() => axeSmall);

  protected readonly impact = signal<false | Vector>(false);

  protected gameState = inject(Game);
  private rigidBody = viewChild.required(NgtrRigidBody);
  private impactSound = viewChild.required<PositionalAudio>('impactSound');
  private throwSound = viewChild.required<PositionalAudio>('throwSound');
  onPointerUp = () => this.gameState.launchAxe();
  ngOnInit() {
    window.addEventListener('pointerup', this.onPointerUp);
  }

  ngOnDestroy(): void {
    window.removeEventListener('pointerup', this.onPointerUp);
  }

  onIntersectiton(event: NgtrIntersectionEnterPayload) {
    if (event.other.rigidBodyObject?.name === 'target') {
      const rb = this.rigidBody().rigidBody()!;
      rb.setBodyType(RigidBodyType.KinematicPositionBased, false);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
      this.impact.set(rb.translation());
      const impactSound = this.impactSound().sound()?.nativeElement;
      impactSound?.stop();
      impactSound?.play();
    }
  }

  constructor() {
    effect(() => {
      const [axeLaunched] = [this.gameState.axeLaunched()];

      const throwSound = this.throwSound().sound()?.nativeElement;
      if (axeLaunched) {
        const rb = this.rigidBody().rigidBody()!;
        rb.setBodyType(RigidBodyType.Dynamic, false);
        rb.setLinvel({ x: 0, y: 0, z: 0 }, false);
        rb.setAngvel({ x: 0, y: 0, z: 0 }, false);
        rb.applyImpulse({ x: 1, y: 0.5, z: 0 }, true);
        rb.applyTorqueImpulse({ x: 0, y: 0, z: -0.2 }, true);
        throwSound?.play();
      } else {
        this.impact.set(false);
      }
    });

    effect(() => {
      const [impact] = [this.impact()];
      if (impact) {
        this.gameState.onTargetHit();
      }
    });

    beforeRender(({ pointer }) => {
      const rb = this.rigidBody().rigidBody()!;
      if (this.gameState.axeLaunched()) return;
      rb.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
      rb.setTranslation(
        { x: 1, y: pointer.y / 2 + -0.2, z: pointer.x / 2 },
        true,
      );
    });
  }
}
