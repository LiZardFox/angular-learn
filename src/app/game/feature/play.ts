import { Component } from '@angular/core';
import { NgtCanvas } from 'angular-three/dom';
import { NgtRoutedScene } from 'angular-three';
import { Overlay } from '../ui/overlay';

@Component({
  imports: [NgtCanvas, NgtRoutedScene, Overlay],
  template: `
    <ngt-canvas shadows>
      <ngt-routed-scene *canvasContent />
    </ngt-canvas>
    <game-overlay />
  `,
  host: { class: 'block w-full h-dvh' },
  styles: [':host { touch-action: none; }'],
})
export default class Play {}
