import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import {
  beforeRender,
  createAttachFunction,
  extend,
  NgtArgs,
} from 'angular-three';
import { VFXParticles, VFXParticlesSettings } from 'wawa-vfx-vanilla';

@Component({
  selector: 'vfx-particles',
  template: `
    <ngt-custom-particles
      #particles
      *args="[name(), settings()]"
      [attach]="attachParticles"
    />
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtArgs],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Particles {
  name = input.required<string>();
  settings = input<VFXParticlesSettings>({});
  particles = viewChild<ElementRef<VFXParticles>>('particles');
  attachParticles = createAttachFunction<VFXParticles>(({ store, child }) => {
    store().scene.add(child.getMesh());
    return () => store().scene.remove(child.getMesh());
  });
  constructor() {
    extend({ CustomParticles: VFXParticles });

    beforeRender(({ clock }) => {
      this.particles()?.nativeElement.update(clock.getElapsedTime());
    });
  }
}
