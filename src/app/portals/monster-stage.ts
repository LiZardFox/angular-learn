import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, effect, input, signal, viewChild } from "@angular/core";
import { beforeRender, extend, injectStore, NgtArgs, NgtEuler, NgtVector3 } from "angular-three";
import { NgtsRoundedBox } from "angular-three-soba/abstractions";
import { NgtsMeshPortalMaterial } from "angular-three-soba/materials";
import { BackSide, Group, Mesh, Vector3 } from "three";
import { textureResource } from "angular-three-soba/loaders";
import { Environment } from "./environment";
import { easing } from "maath";
import CameraControls from "camera-controls";

extend({Mesh, Group});

@Component({
    selector: 'app-monster-stage',
    template: `
    <ngt-group [position]="position()" [rotation]="rotation()">
        <ngts-rounded-box [options]="{
            width: 2,
            height: 3,
            depth: 0.1,
        }"
        (dblclick)="active.set(!active())"
        >
            <ngts-mesh-portal-material>
                <ng-template>
                    <app-environment/>
                    <ng-content />
                    <ngt-mesh>
                        <ngt-sphere-geometry *args="[10, 64, 64]"/>
                        <ngt-mesh-standard-material [map]="texture.value()" [side]="BackSide"/>
                    </ngt-mesh>
                </ng-template>
            </ngts-mesh-portal-material>
        </ngts-rounded-box>
    </ngt-group>
    `,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgtsRoundedBox, NgtsMeshPortalMaterial, NgtArgs, Environment]
})
export class MonsterStage {
    texturePath = input.required<string>();
    position = input<NgtVector3>([0, 0, 0]);
    rotation = input<NgtEuler>([0, 0, 0]);

    protected active = signal(false);
    
    protected BackSide = BackSide;

    protected texture = textureResource(() => this.texturePath());

    private portalMaterialRef = viewChild.required(NgtsMeshPortalMaterial);
    private roundedBoxRef = viewChild.required(NgtsRoundedBox);

    private store = injectStore();

    constructor() {
        effect(() => {
            const [isActive, roundedBox, controls] = [this.active(), this.roundedBoxRef().meshRef().nativeElement, this.store.controls()];
            console.log(this.store());
            if (isActive) {
                const targetPosition = new Vector3(0, 0, 0);
                roundedBox.getWorldPosition(targetPosition);
                void (controls as CameraControls).setLookAt(
                    0,
                    0,
                    5,
                    targetPosition.x,
                    targetPosition.y,
                    targetPosition.z,
                    true
                );
            } else {
                void (controls as CameraControls).setLookAt(
                    0,
                    0,
                    10,
                    0,
                    0,
                    0,
                    true
                );
            }
        });

        beforeRender(({delta}) => {
            const [isActive, material] = [this.active(), this.portalMaterialRef().materialRef().nativeElement];
            easing.damp(material, 'blend', isActive ? 1 : 0, 0.2, delta);
        });
    }
}