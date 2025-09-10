import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  model,
  viewChild,
} from '@angular/core';
import { extend, is, NgtArgs, NgtThreeElements } from 'angular-three';
import { gltfResource } from 'angular-three-soba/loaders';
import { animations } from 'angular-three-soba/misc';
import { Group, Mesh, Object3D } from 'three';
import { GLTF } from 'three-stdlib';
import { NgtrRigidBody } from 'angular-three-rapier';

export const maps = {
  castle_on_hills: {
    scale: 3,
    position: [-6, -7, 0],
  },
  animal_crossing_map: {
    scale: 20,
    position: [-15, -1, 10],
  },
  city_scene_tokyo: {
    scale: 0.72,
    position: [0, -1, -3.5],
  },
  de_dust_2_with_real_light: {
    scale: 0.3,
    position: [-5, -3, 13],
  },
  medieval_fantasy_book: {
    scale: 0.4,
    position: [-4, 0, -6],
  },
} as const;

@Component({
  selector: 'game-map',
  template: `
    <ngt-group #group>
      <ngt-object3D rigidBody="fixed" [options]="{ colliders: 'trimesh' }">
        <ngt-primitive *args="[scene()]" [parameters]="options()" />
      </ngt-object3D>
    </ngt-group>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs, NgtrRigidBody],
})
export class Map {
  model = input.required<string>();
  options = input<Partial<NgtThreeElements['ngt-primitive']>>({});
  mapLoaded = model(false);

  protected groupRef = viewChild.required<ElementRef<Group>>('group');
  protected gltf = gltfResource<GLTF>(this.model);
  protected scene = computed(() => {
    const gltf = this.gltf.value();
    if (!gltf) return null;

    const { scene } = gltf;

    scene.traverse((obj) => {
      if (is.three<Mesh>(obj, 'isMesh')) {
        obj.receiveShadow = obj.castShadow = true;
      }
    });

    return scene;
  });

  constructor() {
    extend({ Group, Object3D });
    const _animations = animations(this.gltf.value, this.groupRef);
    effect(() => {
      if (!_animations.isReady) return;
      this.mapLoaded.set(true);
      const actions = Object.keys(_animations.actions);
      if (actions.length > 0) {
        _animations.actions[actions[0]].play();
      }
    });
  }
}
