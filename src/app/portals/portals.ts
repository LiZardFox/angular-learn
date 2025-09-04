import { Component } from '@angular/core';
import { NgtCanvas } from 'angular-three/dom';
import { PortalsScene } from './portals-scene';

@Component({
  imports: [NgtCanvas, PortalsScene],
  template: `
    <ngt-canvas [camera]="{ position: [0, 0, 10], fov: 30 }">
      <app-portals-scene *canvasContent />
    </ngt-canvas>
  `,
  styles: ``,
  host: { class: 'block h-dvh w-full' },
})
export default class Portals {}
