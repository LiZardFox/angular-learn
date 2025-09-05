import {
  computed,
  effect,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { Kana, kanas } from '../constants';

export const gameStates = {
  MENU: 'MENU',
  GAME: 'GAME',
  GAME_OVER: 'GAME_OVER',
} as const;

export type GameState = (typeof gameStates)[keyof typeof gameStates];

type Stage = { kanas: Kana[]; correctIdx: number };
const generateGameLevel = (stages: number) => {
  const level = [];
  const goodKanas = new Set<Kana['name']>();

  for (let i = 0; i < stages; i++) {
    const stage: Stage = { correctIdx: -1, kanas: [] };
    const options = 3 + i;
    for (let j = 0; j < options; j++) {
      let kana = null;
      while (
        !kana ||
        stage.kanas.includes(kana) ||
        level[level.length - 1]?.kanas.includes(kana) ||
        goodKanas.has(kana.name)
      ) {
        kana = kanas[Math.floor(Math.random() * kanas.length)];
      }
      stage.kanas.push(kana);
    }
    stage.correctIdx = Math.floor(Math.random() * options);
    const goodKana = stage.kanas[stage.correctIdx];
    goodKanas.add(goodKana.name);
    level.push(stage);
    console.log(goodKana, level);
  }
  return level;
};

@Injectable({
  providedIn: 'root',
})
export class KanaGameStore {
  #gameState = signal<GameState>(gameStates.MENU);
  #level = signal<Stage[]>([]);
  #currentStageKey = signal(0);
  #mode = signal<'hiragana' | 'katakana'>('hiragana');
  #wrongAnswers = signal<number>(0);

  gameState = this.#gameState.asReadonly();
  level = this.#level.asReadonly();
  mode = this.#mode.asReadonly();
  currentStageKey = this.#currentStageKey.asReadonly();
  currentStage = computed<Stage | null>(
    () => this.level()[this.currentStageKey()] ?? null,
  );
  currentKana = computed(
    () => this.currentStage()?.kanas[this.currentStage()!.correctIdx] ?? null,
  );
  wrongAnswers = this.#wrongAnswers.asReadonly();

  startGame: (config: {
    stages: number;
    mode: 'hiragana' | 'katakana';
  }) => void = ({ stages, mode }) => {
    this.playAudio('start', () => {
      this.#level.set(generateGameLevel(stages));
    });
    this.#gameState.set(gameStates.GAME);
    this.#mode.set(mode);
  };

  nextStage = () => {
    const nextIndex =
      this.level().findIndex((stage) => stage === this.currentStage()) + 1;
    if (nextIndex < this.level().length) {
      this.playAudio('good');
      this.playAudio('correct0', () => {
        this.#currentStageKey.set(nextIndex);
      });
    } else {
      this.playAudio('congratulations');
      this.#level.set([]);
      this.#currentStageKey.set(0);
      this.#gameState.set(gameStates.GAME_OVER);
    }
  };

  goToMenu = () => {
    this.#level.set([]);
    this.#currentStageKey.set(0);
    this.#gameState.set(gameStates.MENU);
    this.#wrongAnswers.set(0);
  };

  playAudio = (path: string, callback: null | (() => void) = null) => {
    const audio = new Audio(`./sounds/${path}.mp3`);
    if (callback) {
      audio.addEventListener('ended', callback);
    }
    audio.play();
  };

  kanaTouched = (kana: Kana) => {
    const currentKana = this.currentKana();
    if (!currentKana) return;
    if (kana.name === currentKana.name) {
      this.nextStage();
    } else {
      this.playAudio('wrong');
      this.playAudio(`kanas/${kana.name}`, () => {
        this.playAudio('fail');
      });
      this.#wrongAnswers.update((n) => n + 1);
    }
  };

  constructor() {
    effect(() => {
      const [currentKana] = [this.currentKana()];
      if (!currentKana) return;

      this.playAudio(`kanas/${currentKana?.name}`);
    });
  }
}
