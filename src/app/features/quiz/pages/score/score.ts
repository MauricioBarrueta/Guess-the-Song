import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalScoreService } from '../../../../core/services/global-score-service';
import { ScoreResults } from '../../../../core/interfaces/score';

@Component({
  selector: 'app-score',
  imports: [],
  templateUrl: './score.html',
  styleUrl: './score.scss',
})
export class Score implements OnInit {

  score: ScoreResults[] = []

  constructor(private gScoreService: GlobalScoreService, private router: Router) {}

  ngOnInit(): void {
    /* Para evitar que se acceda a la ruta sin antes haber jugado una partida */
    if (this.gScoreService.getScoreData().length === 0) {
      this.router.navigate(['main-menu'])
      return
    }
    this.score = this.gScoreService.getScoreData()
  }
}
