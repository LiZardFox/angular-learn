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
import { NgtsMeshTransmissionMaterial } from 'angular-three-soba/materials';

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
          <ngt-group [position]="[3.5, 0.5, -3.5]">
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
            <ngt-mesh [scale]="1.22" [position]="[0, 1.2, 0]">
              <ngts-mesh-transmission-material
                [options]="{
                  transmissionSampler: false,
                  backside: false,
                  samples: 10,
                  resolution: 1024,
                  transmission: 1,
                  roughness: 0.0,
                  thickness: 0,
                  ior: 1,
                  chromaticAberration: 0,
                  anisotropy: 0,
                  distortion: 0,
                  distortionScale: 0,
                  temporalDistortion: 0,
                  clearcoat: 1,
                  attenuationDistance: 1,
                  color: '#efbeff',
                }"
              />
              <ngt-sphere-geometry />
            </ngt-mesh>
            <ngts-center
              [options]="{
                position: [0, 1, 0],
                rotation: [
                  0,
                  -(($index / currentStage.kanas.length) * Math.PI * 2),
                  0,
                ],
              }"
            >
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
                <ngt-mesh-standard-material
                  color="orange"
                  [toneMapped]="false"
                />
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
    NgtsMeshTransmissionMaterial,
  ],
})
export class KanaSpots {
  protected readonly kanaStore = inject(KanaGameStore);
  protected readonly Math = Math;
  private centerRefs = viewChildren(NgtsCenter);

  constructor() {
    extend({
      Group,
      MeshNormalMaterial,
      MeshStandardMaterial,
      Object3D,
      Mesh,
      CylinderGeometry,
    });
  }
}
