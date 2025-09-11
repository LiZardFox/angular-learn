import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { beforeRender, extend, NgtArgs, NgtThreeElements } from 'angular-three';
import { VFXEmitter, VFXEmitterSettings } from 'wawa-vfx-vanilla';
import { NgtrAnyCollider } from 'angular-three-rapier';
import { Object3D, Vector3 } from 'three';

@Component({
  selector: 'vfx-emitter',
  template: `<ngt-object3D #object3D [parameters]="options()" />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticleEmitter implements OnInit, OnDestroy {
  emitterName = input.required<string>();
  settings = input<VFXEmitterSettings>({});
  localDirection = input<boolean>(false);
  autoStart = input<boolean>(true);
  options = input<Partial<NgtThreeElements['ngt-object3D']>>({});

  emitter = null as null | VFXEmitter;
  object3d = viewChild<ElementRef<Object3D>>('object3D');

  ngOnInit() {
    const [name, settings, localDirection, autoStart, object3D] = [
      this.emitterName(),
      this.settings(),
      this.localDirection(),
      this.autoStart(),
      this.object3d()?.nativeElement,
    ];
    if (this.emitter || !object3D) return;

    this.emitter = new VFXEmitter(
      name,
      settings,
      undefined,
      localDirection,
      autoStart,
    );
    object3D?.add(this.emitter);
  }

  ngOnDestroy(): void {
    const [object3D, emitter] = [this.object3d()?.nativeElement, this.emitter];
    if (!emitter || !object3D) return;
    object3D.remove(emitter);
    this.emitter = null;
  }

  stopEmitting() {
    if (this.emitter) {
      this.emitter.stopEmitting();
    }
  }

  startEmitting(reset: boolean = false) {
    if (this.emitter) {
      this.emitter.startEmitting(reset);
    }
  }

  emitAtPosition(position: Vector3, reset: boolean = false) {
    if (this.emitter) {
      this.emitter.emitAtPos(position, reset);
    }
  }

  constructor() {
    extend({ Object3D });

    effect(() => {
      const [settings] = [this.settings()];
      if (this.emitter) {
        this.emitter.updateSettings(settings);
      }
    });

    beforeRender(({ clock, delta }) => {
      this.emitter?.update(clock.getElapsedTime(), delta);
    });
  }
}
