import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  viewChild,
} from '@angular/core';
import { injectStore } from 'angular-three';
import { NgtsCameraControls } from 'angular-three-soba/controls';
import { injectAutoEffect } from 'ngxtension/auto-effect';
import { activeSlide } from './data-access/state';

@Component({
  selector: 'app-camera-handler',
  template: `
    <ngts-camera-controls
      [options]="{
        touches: { one: 0, two: 0, three: 0 },
        mouseButtons: $any({ left: 0, middle: 0, right: 0 }),
      }"
    />
  `,
  imports: [NgtsCameraControls],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraHandler {
  slideDistance = input(1, { transform: numberAttribute });

  private store = injectStore();
  private viewport = this.store.viewport;

  private cameraControlsRef = viewChild.required(NgtsCameraControls);

  private lastSlide = 0;
  private dollyDistance = 10;

  constructor() {
    const autoEffect = injectAutoEffect();
    afterNextRender(() => {
      autoEffect(() => {
        const viewport = this.viewport();
        const cameraControls = this.cameraControlsRef().controls();

        const id = setTimeout(() => {
          void cameraControls.setLookAt(
            activeSlide() * (viewport.width + this.slideDistance()),
            0,
            5,
            activeSlide() * (viewport.width + this.slideDistance()),
            0,
            0,
          );
        }, 200);

        return () => clearTimeout(id);
      });

      autoEffect(() => {
        const currentSlide = activeSlide();
        if (this.lastSlide === currentSlide) return;
        void this.moveToSlide();
        this.lastSlide = currentSlide;
      });
    });
  }

  private async moveToSlide() {
    const cameraControls = this.cameraControlsRef().controls();

    await cameraControls.setLookAt(
      this.lastSlide * (this.viewport().width + this.slideDistance()),
      3,
      this.dollyDistance,
      this.lastSlide * (this.viewport().width + this.slideDistance()),
      0,
      0,
      true,
    );

    await cameraControls.setLookAt(
      activeSlide() * (this.viewport().width + this.slideDistance()),
      1,
      this.dollyDistance,
      activeSlide() * (this.viewport().width + this.slideDistance()),
      0,
      0,
      true,
    );

    await cameraControls.setLookAt(
      activeSlide() * (this.viewport().width + this.slideDistance()),
      0,
      5,
      activeSlide() * (this.viewport().width + this.slideDistance()),
      0,
      0,
      true,
    );
  }
}
