import { Injectable, signal } from '@angular/core';
import { maps } from './map';
import { Vector3 } from 'three';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  map = signal<keyof typeof maps>('medieval_fantasy_book');
  characterPosition = signal<Vector3>(new Vector3(0, 0, 0));
  containerRotation = signal<number>(0);
}
