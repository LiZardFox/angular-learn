import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, NgtArgs } from 'angular-three';
import { VFXEmitter, VFXEmitterSettings } from 'wawa-vfx-vanilla';

@Component({
  selector: 'vfx-emitter',
  template: `<ngt-custom-emitter
    *args="[emitterName(), settings()]"
    #emitter
  />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgtArgs],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticleEmitter {
  emitterName = input.required<string>();
  settings = input<VFXEmitterSettings>({});

  emitter = viewChild<ElementRef<VFXEmitter>>('emitter');
  constructor() {
    extend({ CustomEmitter: VFXEmitter });

    beforeRender(({ clock }) => {
      this.emitter()?.nativeElement?.update(
        clock.getElapsedTime(),
        clock.getDelta(),
      );
    });
  }
}
