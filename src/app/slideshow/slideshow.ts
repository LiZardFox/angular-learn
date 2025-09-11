import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgtCanvas } from 'angular-three/dom';
import { Scene } from './scene';
import { Overlay } from './ui/overlay';
import { NgtsLoader } from 'angular-three-soba/loaders';

@Component({
  template: `<ngt-canvas
      [shadows]="true"
      [camera]="{ position: [0, 0, 5], fov: 30 }"
    >
      <app-scene *canvasContent />
    </ngt-canvas>
    <app-overlay></app-overlay>
    <ngts-loader /> `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [Scene, NgtCanvas, Overlay, NgtsLoader],
  host: { class: 'block h-screen w-screen' },
})
export class Slideshow {}
