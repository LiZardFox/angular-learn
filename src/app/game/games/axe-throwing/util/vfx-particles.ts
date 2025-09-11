import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  input,
  untracked,
} from '@angular/core';
import { beforeRender, createAttachFunction, NgtArgs } from 'angular-three';
import { VFXParticles, VFXParticlesSettings } from 'wawa-vfx-vanilla';
import * as THREE from 'three';

@Component({
  selector: 'vfx-particles',
  template: `@if (mesh) {
    <ngt-primitive *args="[mesh]" />
  }`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtArgs],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Particles {
  name = input.required<string>();
  settings = input<VFXParticlesSettings>({});
  alphaMap = input<THREE.Texture>();
  geometry = input<THREE.BufferGeometry>();

  particles = null as null | VFXParticles;
  mesh = null as null | THREE.Mesh;
  attachParticles = createAttachFunction<VFXParticles>(({ store, child }) => {
    store().scene.add(child.getMesh());
    return () => store().scene.remove(child.getMesh());
  });
  constructor() {
    effect((onCleanup) => {
      const [name, alphaMap, geometry, settings] = [
        this.name(),
        this.alphaMap(),
        this.geometry(),
        untracked(this.settings),
      ];

      if (!name) return;
      this.particles = new VFXParticles(
        name,
        settings,
        undefined,
        alphaMap,
        geometry,
      );
      this.mesh = this.particles.getMesh();
      onCleanup(() => {
        if (this.particles) {
          this.particles?.dispose();
          this.particles = null;
          this.mesh = null;
        }
      });
    });

    effect(() => {
      const settings = this.settings();
      if (this.particles && settings) {
        this.particles.updateSettings(settings);
      }
    });

    beforeRender(({ clock }) => {
      this.particles?.update(clock.getElapsedTime());
    });
  }
}
