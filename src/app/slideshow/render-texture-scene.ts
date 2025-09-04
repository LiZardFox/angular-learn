import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";
import { ShoowroomScene } from "./data-access/state";
import { extend, NgtArgs, pick } from "angular-three";
import { gltfResource } from "angular-three-soba/loaders";
import { AmbientLight, BackSide, Group, MathUtils, Mesh, SphereGeometry } from "three";
import { NgtsPerspectiveCamera } from "angular-three-soba/cameras";
import { NgtsOrbitControls } from "angular-three-soba/controls";
import { NgtsAccumulativeShadows, NgtsEnvironment, NgtsLightformer, NgtsRandomizedLights } from "angular-three-soba/staging";

@Component({
    selector: 'app-render-texture-scene',
    template: `
        <ngt-group [name]="name()">
            <ngts-perspective-camera [options]="{makeDefault: true, position: [3, 3, 8], near: 0.5}"/>
            <ngts-orbit-controls
                [options]="{
                    autoRotate: true,
                    enablePan: false,
                    maxPolarAngle: DEG2RAD * 75,
                    minDistance: 6,
                    maxDistance: 10,
                    autoRotateSpeed: 1
                }"
            />
            <ngt-primitive *args="[model()]" [parameters]="{ scale: ratioScale }"/>

            <ngt-ambient-light [intensity]="0.1 * Math.PI" color="pink"/>
            <ngts-accumulative-shadows [options]="{
                frames: 100,
                alphaTest: 0.9,
                scale: 30,
                position: [0, -0.005, 0],
                color: 'pink',
                opacity: 0.8,
            }">
                <ngts-randomized-lights [options]="{
                    amount: 4,
                    radius: 9,
                    intensity: 0.8 * Math.PI,
                    ambient: 0.25,
                    position: [10, 5, 15],
                }"/>
                <ngts-randomized-lights [options]="{
                    amount: 4,
                    radius: 5,
                    intensity: 0.5 * Math.PI,
                    position: [10, 5, 15],
                    bias: 0.001,
                }"/>
            </ngts-accumulative-shadows>

            <ngts-environment [options]="{ blur: 0.8, background: true }">
                <ng-template>
                    <ngt-mesh [scale]="15"]>
                        <ngt-sphere-geometry/>
                        <ngt-mesh-basic-material [side]="BackSide"] [color]="scene().mainColor"]></ngt-mesh-basic-material>
                    </ngt-mesh>
                    <ngts-lightformer
						[options]="{
							position: [5, 0, -5],
							form: 'rect',
							intensity: 1,
							color: 'red',
							scale: [3, 5],
							target: [0, 0, 0],
						}"
					/>
					<ngts-lightformer
						[options]="{
							position: [-5, 0, 1],
							form: 'circle',
							intensity: 1,
							color: 'green',
							scale: [2, 5],
							target: [0, 0, 0],
						}"
					/>
					<ngts-lightformer
						[options]="{
							position: [0, 5, -2],
							form: 'ring',
							intensity: 0.5,
							color: 'orange',
							scale: [10, 5],
							target: [0, 0, 0],
						}"
					/>
					<ngts-lightformer
						[options]="{
							position: [0, 0, 5],
							form: 'rect',
							intensity: 1,
							color: 'purple',
							scale: [10, 5],
							target: [0, 0, 0],
						}"
					/>
                </ng-template>
            </ngts-environment>
        </ngt-group>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [NgtArgs, NgtsPerspectiveCamera, NgtsOrbitControls, NgtsAccumulativeShadows, NgtsRandomizedLights, NgtsEnvironment, NgtsLightformer],
})
export class RenderTextureScene {
    protected readonly Math = Math;
    protected readonly DEG2RAD = MathUtils.DEG2RAD;
    protected readonly BackSide = BackSide
    protected readonly ratioScale = Math.min(1.2, Math.max(0.5, window.innerWidth / 1920));

    scene = input.required<ShoowroomScene>();

    name = pick(this.scene, 'name');

    private gltf = gltfResource(() => this.scene().resource);

    model = computed(() => {
        const model = this.gltf.scene();
        if (!model) return null;
        model.traverse((child) => {
            if ((child as Mesh).isMesh) {
                child.castShadow = child.receiveShadow = true;
            }
        });
        return model;
    })
    constructor() {
        extend({ Group, AmbientLight, Mesh, SphereGeometry });
    }
}