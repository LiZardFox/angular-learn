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
import { VFXEmitter } from 'wawa-vfx-vanilla';

@Component({
  selector: 'game-axe-throwing-controller',
  template: `
    @if (impact(); as impact) {
      <ngt-group [position]="[impact.x, impact.y, impact.z]">
        <ngt-wawa-emitter
          *args="[
            'sparks',
            {
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
            },
          ]"
          #emitter
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
      @if (axeGltf.value(); as axeGltf) {
        <ngt-primitive *args="[axeGltf.scene]" [position.y]="-0.3" />
      }
    </ngt-object3D>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs, NgtrRigidBody],
})
export class AxeController implements OnInit, OnDestroy {
  axeGltf = gltfResource(() => axeSmall);

  protected readonly impact = signal<false | Vector>(false);

  private gameState = inject(Game);
  private rigidBody = viewChild.required(NgtrRigidBody);
  private emitter = viewChild<ElementRef<VFXEmitter>>('emitter');
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
    }
  }

  constructor() {
    effect(() => {
      const [axeLaunched] = [this.gameState.axeLaunched()];
      if (axeLaunched) {
        const rb = this.rigidBody().rigidBody()!;
        rb.setBodyType(RigidBodyType.Dynamic, false);
        rb.applyImpulse({ x: 1, y: 0.5, z: 0 }, true);
        rb.applyTorqueImpulse({ x: 0, y: 0, z: -0.2 }, true);
      } else {
        this.impact.set(false);
      }
    });

    beforeRender(({ pointer, clock }) => {
      console.log(this.emitter()?.nativeElement, 'Sparkle');
      this.emitter()?.nativeElement.update(
        clock.getElapsedTime(),
        clock.getDelta(),
      );
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
