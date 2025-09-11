import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { extend, NgtArgs } from 'angular-three';
import { NgtCanvas } from 'angular-three/dom';
import { NgtrPhysics } from 'angular-three-rapier';
import { NgtpBloom, NgtpEffectComposer } from 'angular-three-postprocessing';
import { AUDIOS } from './audio';
import { KeyValuePipe } from '@angular/common';
import { Color } from 'three';
import { PositionalAudio } from './util/positonal-audio';
import AxeThrowingExperience from './experience';
import { AxeThrowingOverlay } from './ui/overlay';
import { NgtsLoader } from 'angular-three-soba/loaders';

@Component({
  template: `
    <game-axe-throwing-overlay />
    <ngt-canvas [camera]="{ position: [-0.1, 0, 0], fov: 50 }" shadows>
      <ng-template canvasContent>
        <ngt-color attach="background" *args="['#111']" />
        <ngtr-physics [options]="{ debug: false, colliders: false }">
          <ng-template>
            <game-axe-throwing-experience />
          </ng-template>
        </ngtr-physics>
        <ngtp-effect-composer>
          <ngtp-bloom
            [options]="{
              luminanceThreshold: 1.5,
              mipmapBlur: true,
              intensity: 0.3,
            }"
          ></ngtp-bloom>
        </ngtp-effect-composer>
        @for (audio of AUDIOS | keyvalue; track $index) {
          <app-positional-audio
            [url]="audio.value"
            [loop]="false"
            [options]="{ autoplay: false }"
          />
        }
      </ng-template>
    </ngt-canvas>
    <ngts-loader />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtCanvas,
    NgtArgs,
    NgtrPhysics,
    NgtpEffectComposer,
    NgtpBloom,
    KeyValuePipe,
    PositionalAudio,
    AxeThrowingExperience,
    AxeThrowingOverlay,
    NgtsLoader,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { class: 'block w-full h-dvh' },
})
export default class AxeThrowing {
  protected readonly AUDIOS = AUDIOS;
  constructor() {
    extend({ Color });
  }
}
