import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { GhostSkull } from "./entities/ghost-skull";
import { NgtsCameraControls, NgtsOrbitControls } from "angular-three-soba/controls";
import { Environment } from "./environment";
import { MonsterStage } from "./monster-stage";
import { Ninja } from "./entities/ninja";
import { MushroomKing } from "./entities/mushroom-king";

@Component({
    selector: 'app-portals-scene',
    template: `
    <ngts-camera-controls [options]="{ makeDefault: true, maxPolarAngle: Math.PI / 2, minPolarAngle: Math.PI / 3, minDistance: 10, maxDistance: 10 }" />
    <app-environment />

    <app-monster-stage [texturePath]="'./ghost-town.jpg'" [position]="[0, 0, -0.5]">
        <app-ghost-skull [options]="{scale: 0.5, position: [0, -1, 0]}"/>
    </app-monster-stage>

    
    <app-monster-stage [texturePath]="'./mushroom-forest.jpg'" [position]="[-2.5, 0, 0]" [rotation]="[0, Math.PI / 8, 0]">
        <app-mushroom-king [options]="{scale: 0.5, position: [0, -1, 0]}"/>
    </app-monster-stage>

    
    <app-monster-stage [texturePath]="'./ninja-town.jpg'" [position]="[2.5, 0, 0]" [rotation]="[0, -Math.PI / 8, 0]">
        <app-ninja [options]="{scale: 0.5, position: [0, -1, 0]}"/>
    </app-monster-stage>
    `,
    styles: [``],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgtsCameraControls, Environment, MonsterStage, GhostSkull, Ninja, MushroomKing],
})
export class PortalsScene {
    protected readonly Math = Math;
}