import { Injectable } from '@angular/core';
import { ScoreResults } from '../interfaces/score';

@Injectable({
  providedIn: 'root',
})

export class ScoreService {

  gameScore: ScoreResults[] = []

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