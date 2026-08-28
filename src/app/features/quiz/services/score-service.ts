import { Injectable } from '@angular/core';
import { ScoreResults } from '../interfaces/score';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ScoreService {

  gameScore: ScoreResults[] = []

  /* Observables que notifican la carga y salida de Score */
  private scoreLoadedSubject = new Subject<void>()
  scoreLoaded$ = this.scoreLoadedSubject.asObservable()

  private exitedScoreSubject = new Subject<void>()
  exitedScore$ = this.exitedScoreSubject.asObservable()

  /* Notifica que Score terminó de cargar los resultados */
  notifyScoreLoaded(): void {
    this.scoreLoadedSubject.next()
  }

  /* Notifica que se va a salir de Score */
  notifyExitedScore(): void {
    this.exitedScoreSubject.next()
  }

  /* Inyecta los datos provenientes del componente Game */
  pushScoreData(score: ScoreResults[]) {
    this.gameScore = score
  }

  /* Devuelve el arreglo ya con datos */
  getScoreData() {
    return this.gameScore
  }

  /* Restablece la puntuación */
  clearScoreData() {
    this.gameScore = []
  }
}