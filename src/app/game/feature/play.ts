import { Component } from '@angular/core';
import { NgtCanvasImpl } from "angular-three/dom";
import { NgtRoutedScene } from "angular-three";
import { Overlay } from "../ui/overlay";

@Component({
  imports: [NgtCanvasImpl, NgtRoutedScene, Overlay],
  template: `
    <ngt-canvas>
      <ngt-routed-scene/>
    </ngt-canvas>
    <game-overlay/>
  `,
  host: { 'class': 'block w-full h-dvh' }
})
export default class Play {

}
