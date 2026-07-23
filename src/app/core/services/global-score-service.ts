import { Injectable } from '@angular/core';
import { ScoreResults } from '../interfaces/score';

@Injectable({
  providedIn: 'root',
})
export class GlobalScoreService {

  gameScore: ScoreResults[] = []

  /* Inyecta los datos provenientes del componente Game */
  pushScoreData(score: ScoreResults[]) {
    this.gameScore = score
  }

  /* Devuelve el arreglo ya con datos */
  getScoreData() {
    return this.gameScore
  }

  /* Se resetea el arreglo */
  clearScoreData() {
    this.gameScore = []
  }
}
