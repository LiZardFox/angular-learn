import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from '@angular/core';
import { shaderMaterial } from '@pmndrs/vanilla';
import { extend, NgtArgs } from 'angular-three';
import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';

@Component({
  selector: 'gradient-sky',
  template: `
    <ngt-mesh
      [rotation.x]="degToRad(-5)"
      [depthWrite]="false"
      [depthTest]="false"
    >
      <ngt-sphere-geometry *args="[40]" />
      <ngt-gradient-material
        [colorTop]="colorTop()"
        [colorMiddle]="colorMiddle()"
        [colorBottom]="colorBottom()"
        [blendIntensity]="blendIntensity()"
        [blendMiddle]="blendMiddle()"
        [side]="BackSide"
        [toneMapped]="false"
        [depthWrite]="false"
      />
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtArgs],
})
export class GradientSky {
  protected readonly BackSide = THREE.BackSide;
  protected readonly degToRad = degToRad;

  colorTop = input('#06080d');
  colorMiddle = input('#7d6fde');
  colorBottom = input('#000000');
  blendIntensity = input(0.06);
  blendMiddle = input(0.2);

  constructor() {
    extend({
      Mesh: THREE.Mesh,
      SphereGeometry: THREE.SphereGeometry,
      GradientMaterial,
    });
  }
}

const GradientMaterial = shaderMaterial(
  {
    colorTop: new THREE.Color('white'),
    colorBottom: new THREE.Color('skyblue'),
    colorMiddle: new THREE.Color('pink'),
    blendMiddle: 0.2,
    blendIntensity: 1,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
  /* glsl */ `
    uniform vec3 colorTop;
    uniform vec3 colorBottom;
    uniform vec3 colorMiddle;
    uniform float blendMiddle;
    uniform float blendIntensity;
    varying vec2 vUv;
    void main() {
      vec3 mixedTop = mix(colorMiddle, colorTop, smoothstep(0.498, 0.502, vUv.y));
      vec3 mixedBottom = mix(colorMiddle, colorBottom, smoothstep(0.502, 0.498, vUv.y));
    
      vec3 mixedColor = mix(colorBottom, colorTop, smoothstep(0.45, 0.55, vUv.y));
      float blendMiddle = smoothstep(0.5-blendMiddle, 0.5, vUv.y)  * smoothstep(0.5 + blendMiddle, 0.5, vUv.y) * blendIntensity;
      vec3 finalColor = mix(mixedColor, colorMiddle, blendMiddle);
      gl_FragColor = vec4(finalColor, 1.0);
      
    }
    `,
);
