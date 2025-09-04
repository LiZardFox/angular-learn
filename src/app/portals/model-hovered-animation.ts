import { computed, DOCUMENT, effect, inject } from "@angular/core";
import { NgtsAnimationApi, NgtsAnimationClip } from "angular-three-soba/misc";

export function modelHoveredAnimation<TAnimationApi extends NgtsAnimationApi<NgtsAnimationClip> & {isReady: true}>(
    hovered: () => boolean,
    animations: () => TAnimationApi | null | undefined,
    defaultAnimationName: keyof TAnimationApi['actions'],
    hoverAnimationName: keyof TAnimationApi['actions']
) {
    const document = inject(DOCUMENT);

    const animationName = computed(() => hovered() ? hoverAnimationName : defaultAnimationName);
    effect(() => {
        const cursor = hovered() ? 'pointer' : 'default';
        void (document.body.style.cursor = cursor);
    });

    effect((onCleanup) => {
      const animationsApi = animations();
      if (!animationsApi) return;

      const animation = animationName();

      animationsApi.actions[animation].reset().fadeIn(0.5).play();
      onCleanup(() => animationsApi.actions[animation].fadeOut(0.5));
    });
}