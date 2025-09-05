import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  viewChildren,
} from '@angular/core';
import { KanaGameStore } from './data-access/store';
import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshNormalMaterial,
  MeshStandardMaterial,
  Object3D,
} from 'three';
import { beforeRender, extend } from 'angular-three';
import {
  NgtrAnyCollider,
  NgtrCylinderCollider,
  NgtrRigidBody,
} from 'angular-three-rapier';
import { NgtsText3D } from 'angular-three-soba/abstractions';
import { NgtsCenter } from 'angular-three-soba/staging';

@Component({
  selector: 'game-kana-spots',
  template: `
    @if (kanaStore.currentStage(); as currentStage) {
      @for (kana of currentStage.kanas; track kana.name) {
        <ngt-group
          [rotation]="[
            0,
            ($index / currentStage.kanas.length) * Math.PI * 2,
            0,
          ]"
        >
          <ngt-group [position]="[3.5, 0, -3.5]">
            <ngt-object3D
              rigidBody="fixed"
              [options]="{
                colliders: false,
              }"
              (collisionEnter)="kanaStore.kanaTouched(kana)"
            >
              <ngt-object3D [cylinderCollider]="[1 / 2, 1]">
                <ngt-mesh>
                  <ngt-cylinder-geometry [scale]="[1, 0.25, 1]" />
                  <ngt-mesh-standard-material color="white" />
                </ngt-mesh>
              </ngt-object3D>
            </ngt-object3D>

            <ngts-center [options]="{ position: [0, 1, 0] }">
              <ngts-text-3D
                [text]="
                  kanaStore.mode() === 'hiragana'
                    ? kana.character.hiragana
                    : kana.character.katakana
                "
                font="./fonts/Noto Sans JP ExtraBold_Regular.json"
                [options]="{
                  size: 0.82,
                }"
              >
                <ngt-mesh-normal-material />
              </ngts-text-3D>
            </ngts-center>
          </ngt-group>
        </ngt-group>
      }
    }
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtrAnyCollider,
    NgtrRigidBody,
    NgtrCylinderCollider,
    NgtsText3D,
    NgtsCenter,
  ],
})
export class KanaSpots {
  protected readonly kanaStore = inject(KanaGameStore);
  protected readonly Math = Math;
  private centerRefs = viewChildren(NgtsCenter);
  private rigidBodyRefs = viewChildren(NgtrRigidBody);

  constructor() {
    extend({
      Group,
      MeshNormalMaterial,
      MeshStandardMaterial,
      Object3D,
      Mesh,
      CylinderGeometry,
    });

    beforeRender(({ camera }) => {
      this.centerRefs().forEach((centerRef) => {
        const textObject = centerRef.groupRef().nativeElement;
        if (textObject) {
          textObject.lookAt(
            camera.position.x,
            textObject.position.y,
            camera.position.z,
          );
        }
      });
    });
  }
}
