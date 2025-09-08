import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Character } from './entities/character';
import { beforeRender, extend } from 'angular-three';
import { Group, Object3D, Vector3 } from 'three';
import {
  NgtrCapsuleCollider,
  NgtrIntersectionEnterPayload,
  NgtrRigidBody,
} from 'angular-three-rapier';
import { Control } from '../../data-access/game-state.service';
import { KanaGameStore } from './data-access/store';

const JUMP_FORCE = 0.5;
const MOVEMENT_SPEED = 0.1;
const MAX_VELOCITY = 3;
const RUN_VELOCITY = 1.5;

@Component({
  selector: 'game-character-controller',
  template: `
    <ngt-group>
      <ngt-object3D
        rigidBody
        [options]="{
          colliders: false,
          enabledRotations: [false, false, false],
        }"
        [scale]="0.5"
        (collisionEnter)="isOnFloor.set(true)"
        (intersectionEnter)="onIntersectionEnter($event)"
      >
        <ngt-object3D [capsuleCollider]="[0.8, 0.4]" [position]="[0, 1.2, 0]" />
        <ngt-group #character>
          <game-character [characterState]="characterState()" />
        </ngt-group>
      </ngt-object3D>
    </ngt-group>
  `,
  imports: [Character, NgtrRigidBody, NgtrCapsuleCollider],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterController {
  readonly controls = input<Set<Control>>(new Set());

  protected readonly isOnFloor = signal(true);
  protected readonly characterState = signal<'Idle' | 'Run'>('Idle');

  private readonly jumpPressed = computed(() => this.controls().has('jump'));
  private readonly forwardPressed = computed(() =>
    this.controls().has('forward'),
  );
  private readonly backwardPressed = computed(() =>
    this.controls().has('backward'),
  );
  private readonly leftPressed = computed(() => this.controls().has('left'));
  private readonly rightPressed = computed(() => this.controls().has('right'));

  private rigidBodyRef = viewChild.required(NgtrRigidBody);
  private characterRef = viewChild.required<ElementRef<Group>>('character');

  private readonly kanaStore = inject(KanaGameStore);
  constructor() {
    extend({ Group, Object3D });

    effect(() => {
      this.kanaStore.currentStage();
      this.kanaStore.wrongAnswers();

      this.resetPosition();
    });

    beforeRender(({ camera }) => {
      const [rigidBody, character] = [
        this.rigidBodyRef().rigidBody(),
        this.characterRef().nativeElement,
      ];
      if (!rigidBody) return;

      const impulse = { x: 0, y: 0, z: 0 };
      if (this.jumpPressed() && this.isOnFloor()) {
        impulse.y += JUMP_FORCE;
        this.isOnFloor.set(false);
      }

      const linvel = rigidBody.linvel();
      let changeRotation = false;
      if (this.rightPressed() && linvel.x < MAX_VELOCITY) {
        impulse.x += MOVEMENT_SPEED;
        changeRotation = true;
      }
      if (this.leftPressed() && linvel.x > -MAX_VELOCITY) {
        impulse.x -= MOVEMENT_SPEED;
        changeRotation = true;
      }
      if (this.backwardPressed() && linvel.z < MAX_VELOCITY) {
        impulse.z += MOVEMENT_SPEED;
        changeRotation = true;
      }
      if (this.forwardPressed() && linvel.z > -MAX_VELOCITY) {
        impulse.z -= MOVEMENT_SPEED;
        changeRotation = true;
      }

      rigidBody.applyImpulse(impulse, true);
      if (changeRotation) {
        const angle = Math.atan2(linvel.x, linvel.z);
        character.rotation.y = angle;
      }

      const characterState = this.characterState();
      if (
        Math.abs(linvel.x) > RUN_VELOCITY ||
        Math.abs(linvel.z) > RUN_VELOCITY
      ) {
        if (characterState !== 'Run') {
          this.characterState.set('Run');
        }
      } else {
        if (characterState !== 'Idle') {
          this.characterState.set('Idle');
        }
      }

      const characterWorldPosition = character.getWorldPosition(new Vector3());
      camera.position.x = characterWorldPosition.x;
      camera.position.z = characterWorldPosition.z + 14;

      const targetLookAt = characterWorldPosition.clone();
      camera.lookAt(targetLookAt);
    });
  }

  resetPosition() {
    const rigidBody = this.rigidBodyRef().rigidBody();
    if (!rigidBody) return;
    rigidBody.setTranslation({ x: 0, y: 1, z: 0 }, true);
    rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
  }

  onIntersectionEnter(event: NgtrIntersectionEnterPayload) {
    if (event.other.rigidBodyObject?.name === 'void') {
      this.resetPosition();
      this.kanaStore.playAudio('fall', () => {
        this.kanaStore.playAudio('ganbatte');
      });
    }
  }
}
