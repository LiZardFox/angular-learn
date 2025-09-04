import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { extend } from 'angular-three';
import { NgtsEnvironment } from 'angular-three-soba/staging';
import { AmbientLight } from 'three';

extend({ AmbientLight });

@Component({
  selector: 'app-environment',
  template: ` <ngt-ambient-light [intensity]="0.5 * Math.PI" />
    <ngts-environment [options]="{ preset: 'sunset' }" />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtsEnvironment],
})
export class Environment {
  protected readonly Math = Math;
}
