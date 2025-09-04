import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgtCanvas } from "angular-three/dom";
import { Scene } from "./scene";
import { Overlay } from "./ui/overlay";

@Component({
    template: `<ngt-canvas [shadows]="true" [camera]="{ position: [0, 0, 5], fov: 30 }">
        <app-scene *canvasContent/>
    </ngt-canvas>
    <app-overlay></app-overlay>`,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [Scene, NgtCanvas, Overlay],
    host: { class: "block h-screen w-screen" }
})
export class Slideshow {

}