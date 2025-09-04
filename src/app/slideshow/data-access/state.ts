import { signal } from '@angular/core';
// @ts-expect-error
import cyberTruck from '../models/cybertruck_scene.glb' with { loader: 'file' };
// @ts-expect-error
import model3 from '../models/model3_scene.glb' with { loader: 'file' };
// @ts-expect-error
import semi from '../models/semi_scene.glb' with { loader: 'file' };
import { gltfResource } from 'angular-three-soba/loaders';

gltfResource.preload(cyberTruck);
gltfResource.preload(model3);
gltfResource.preload(semi);

export const scenes = [
  {
    resource: cyberTruck,
    name: 'Cybertruck',
    description:
      'Better utility than a truck, more performance than a sports car.',
    price: 72000,
    range: 660,
    mainColor: '#f9c0ff',
  },
  {
    resource: model3,
    name: 'Model 3',
    description: 'The Car of the Future.',
    price: 29740,
    range: 576,
    mainColor: '#c0ffe1',
  },
  {
    resource: semi,
    name: 'Semi',
    description: 'The Future of Trucking.',
    price: 150000,
    range: 800,
    mainColor: '#ffdec0',
  },
] as const;

export type ShoowroomScene = (typeof scenes)[number];

export const activeSlide = signal(0);
