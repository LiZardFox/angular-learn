import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import {
  extend,
  injectStore,
  loaderResource,
  NgtArgs,
  NgtThreeElements,
} from 'angular-three';
import {
  AudioLoader,
  Object3D,
  Object3DEventMap,
  PositionalAudio as PositionalAudioImpl,
  AudioListener,
} from 'three';

export type PositionalAudioInputs = Partial<
  NgtThreeElements['ngt-positional-audio']
>;

@Component({
  selector: 'app-positional-audio',
  template: `<ngt-positional-audio
    [parameters]="options()"
    *args="[listener]"
    #sound
  />`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtArgs],
})
export class PositionalAudio implements OnInit, OnDestroy {
  url = input.required<string>();
  distance = input<number>(1);
  loop = input<boolean>(true);
  options = input<PositionalAudioInputs>({});
  listener = new AudioListener();
  buffer = loaderResource(() => AudioLoader, this.url);
  ended = output<void>();

  sound = viewChild<ElementRef<PositionalAudioImpl>>('sound');

  private store = injectStore();

  constructor() {
    extend({ PositionalAudio: PositionalAudioImpl });

    effect(() => {
      const [buffer, camera, distance, loop, autoplay] = [
        this.buffer.value(),
        this.store.camera(),
        this.distance(),
        this.loop(),
        this.options().autoplay,
      ];
      if (!buffer || !camera) return;

      const sound = this.sound()?.nativeElement;
      if (sound) {
        sound.setBuffer(buffer);
        sound.setRefDistance(distance);
        sound.setLoop(loop);
        if (autoplay && !sound.isPlaying) sound.play();
      }
    });

    effect((onCleanup) => {
      const [sound, buffer] = [
        this.sound()?.nativeElement,
        this.buffer.value(),
      ];
      if (!buffer || !sound?.source) return;

      const onEnded = () => this.ended.emit();
      sound.source?.addEventListener('ended', onEnded);
      onCleanup(() => sound.source?.removeEventListener('ended', onEnded));
    });
  }

  ngOnInit() {
    this.store
      .camera()
      .add(this.listener as unknown as Object3D<Object3DEventMap>);
  }
  ngOnDestroy() {
    const camera = this.store.camera();
    const listener = this.listener as unknown as Object3D<Object3DEventMap>;
    const sound = this.sound()?.nativeElement;
    camera.remove(listener);
    if (sound) {
      if (sound.isPlaying) sound.stop();
      if (sound.source && (sound.source as any)._connected) sound.disconnect();
    }
  }
}
