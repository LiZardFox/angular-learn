import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Character } from './entities/character';
import { beforeRender, extend, pick } from 'angular-three';
import { Group, Object3D, Vector3 } from 'three';
import { NgtrCapsuleCollider, NgtrRigidBody } from 'angular-three-rapier';
import { injectKeyboardControls } from '../../util/keyboard-controls';
import { DEG2RAD, MathUtils } from 'three/src/math/MathUtils.js';
import { GameStateService } from './game-state.service';

@Component({
  selector: 'game-character-controller',
  template: `
    <ngt-object3D
      rigidBody
      [options]="{
        colliders: false,
        lockRotations: true,
      }"
    >
      <ngt-group #container>
        <ngt-group #cameraTarget [position]="[0, 0, 1.5]" />
        <ngt-group #cameraPosition [position]="[0, 2, -2]" />
        <ngt-group #character>
          <game-character [options]="{ scale: 0.18 }" [animation]="animation()"
        /></ngt-group>
      </ngt-group>
      <ngt-object3D [capsuleCollider]="[0.08, 0.15]" />
    </ngt-object3D>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Character, NgtrRigidBody, NgtrCapsuleCollider],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CharacterController implements OnInit, OnDestroy {
  walkSpeed = input.required<number>();
  runSpeed = input.required<number>();
  rotationSpeed = input.required<number>();
  mapLoaded = input.required<boolean>();

  animation = signal<'idle' | 'walk' | 'run'>('idle');
  clicking = signal(false);
  private readonly containerRef =
    viewChild.required<ElementRef<Group>>('container');
  private readonly cameraTargetRef =
    viewChild.required<ElementRef<Group>>('cameraTarget');
  private readonly cameraPositionRef =
    viewChild.required<ElementRef<Group>>('cameraPosition');
  private readonly characterRef =
    viewChild.required<ElementRef<Group>>('character');
  private readonly rigidBodyRef = viewChild.required(NgtrRigidBody);

  private cameraWorldPosition = new Vector3();
  private cameraTargetWorldPosition = new Vector3();
  private cameraLookAt = new Vector3();
  private rotationTarget = 0;
  private characterRotationTarget = 0;
  characterControls = injectKeyboardControls({
    forward: ['KeyW', 'ArrowUp'],
    backward: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],
    jump: ['Space'],
    run: ['ShiftLeft', 'ShiftRight'],
  });
  private gameStateService = inject(GameStateService);

  resetPosition() {
    const rigidBody = this.rigidBodyRef().rigidBody();
    if (rigidBody) {
      rigidBody.setTranslation({ x: 0, y: 0, z: 0 }, false);
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, false);
      rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }

  onMouseDown = () => {
    this.clicking.set(true);
  };
  onMouseUp = () => {
    this.clicking.set(false);
  };

  ngOnInit(): void {
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('touchstart', this.onMouseDown);
    document.addEventListener('touchend', this.onMouseUp);
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousedown', () => this.clicking.set(true));
    document.removeEventListener('mouseup', () => this.clicking.set(false));
    document.removeEventListener('touchstart', () => this.clicking.set(true));
    document.removeEventListener('touchend', () => this.clicking.set(false));
  }

  constructor() {
    extend({
      Object3D,
      Group,
    });

    effect(() => {
      if (this.mapLoaded()) {
        this.resetPosition();
      }
    });

    beforeRender(({ camera, pointer }) => {
      const [container, cameraTarget, cameraPosition, character, rigidBody] = [
        this.containerRef().nativeElement,
        this.cameraTargetRef().nativeElement,
        this.cameraPositionRef().nativeElement,
        this.characterRef().nativeElement,
        this.rigidBodyRef().rigidBody(),
      ];
      if (rigidBody) {
        const velocity = rigidBody.linvel();

        const movement = { x: 0, z: 0 };

        if (this.characterControls().forward) movement.z = 1;
        if (this.characterControls().backward) movement.z = -1;
        if (this.characterControls().left) movement.x = 1;
        if (this.characterControls().right) movement.x = -1;

        let speed = this.characterControls().run
          ? this.runSpeed()
          : this.walkSpeed();

        if (this.clicking()) {
          if (Math.abs(pointer.x) > 0.1) {
            movement.x = -pointer.x;
          }
          movement.z = pointer.y + 0.4;
          if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
            speed = this.runSpeed();
          }
        }
        if (movement.x !== 0) {
          this.rotationTarget += this.rotationSpeed() * movement.x;
        }
        if (movement.x !== 0 || movement.z !== 0) {
          this.characterRotationTarget = Math.atan2(movement.x, movement.z);
          velocity.x =
            Math.sin(this.rotationTarget + this.characterRotationTarget) *
            speed;
          velocity.z =
            Math.cos(this.rotationTarget + this.characterRotationTarget) *
            speed;
          if (speed === this.runSpeed()) {
            this.animation.set('run');
          } else {
            this.animation.set('walk');
          }
        } else {
          this.animation.set('idle');
        }

        character.rotation.y = this.lerpAngle(
          character.rotation.y,
          this.characterRotationTarget,
          0.1,
        );

        rigidBody.setLinvel(velocity, true);
      }

      character.getWorldPosition(this.gameStateService.characterPosition());

      // Camera
      container.rotation.y = MathUtils.lerp(
        container.rotation.y,
        this.rotationTarget,
        0.1,
      );

      this.gameStateService.containerRotation.set(container.rotation.y);

      cameraPosition.getWorldPosition(this.cameraWorldPosition);
      camera.position.lerp(this.cameraWorldPosition, 0.1);

      cameraTarget.getWorldPosition(this.cameraTargetWorldPosition);
      this.cameraLookAt.lerp(this.cameraTargetWorldPosition, 0.1);
      camera.lookAt(this.cameraLookAt);
    });
  }

  normalizeAngle(angle: number) {
    return (angle + Math.PI * 2) % (Math.PI * 2);
  }

  lerpAngle(a: number, b: number, t: number) {
    a = this.normalizeAngle(a);
    b = this.normalizeAngle(b);
    if (Math.abs(b - a) > Math.PI) {
      if (b > a) {
        a += Math.PI * 2;
      } else {
        b += Math.PI * 2;
      }
    }
    return this.normalizeAngle(a + (b - a) * t);
  }
}
