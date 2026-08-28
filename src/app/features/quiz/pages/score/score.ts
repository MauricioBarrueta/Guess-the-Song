import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreService } from '../../services/score-service';
import { ScoreResults } from '../../interfaces/score';
import { CommonModule } from '@angular/common';
import { TrackPreview } from "../../components/track-preview/track-preview";
import { GameService } from '../../services/game-service';
import { Loader } from '../../../../shared/loader/loader';
import { ModalHandlerService } from '../../../../shared/modal/service/modal-handler-service';

@Component({
  selector: 'app-score',
  imports: [CommonModule, TrackPreview, Loader],
  templateUrl: './score.html',
  styleUrl: './score.scss'
})

export class Score implements OnInit {

  score: ScoreResults[] = []

  showingDetails: boolean = false
  activeSlide: number = 0

  loaderText: string = 'Calculando resultados'
  isLoading: boolean = true

  mouseEnter: boolean = false

  constructor(private scoreService: ScoreService, private router: Router, private gameService: GameService, private modalHandler: ModalHandlerService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {   
    this.loaderText = 'Calculando resultados'

    const scoreData = this.scoreService.getScoreData()
    /* Para evitar que se acceda a la ruta sin antes haber jugado una partida */
    if (scoreData.length === 0) { 
      this.router.navigate(['main'])
      return
    }

    setTimeout(() => {
      this.score = scoreData 
      this.isLoading = false
      
      /* Notifica que Score terminó de cargar y el Loader dejó de mostrarse */
      this.scoreService.notifyScoreLoaded()
      
      /* Fuerza la detección de cambios para actualizar la vista tras el setTimeout */
      this.cdr.detectChanges()
    }, 4000); 
  }

  /* Se obtiene el numero total de respuestas correctas e incorrectas */
  get totalCorrectAnswers(): number {    
    return this.score.filter(q => q.result).length
  }

  get totalWrongAnswers(): number {
    return this.score.filter(q => !q.result).length
  }

  /* Navegación entre pestañas (índices) */
  nextSlide() {
    this.activeSlide < this.score.length - 1 ? this.activeSlide++ : this.activeSlide = 0  
  }
  
  prevSlide() {
    this.activeSlide > 0 ? this.activeSlide-- : this.activeSlide = this.score.length - 1  
  }  

  openModal(): void {
    this.modalHandler.confirmModal(
      'fa-solid fa-circle-question',
      '¿Volver al menú principal?', 'Podrás configurar una nueva partida',
      () => { this.exitGameAndReset() }
    )
  }

  /* Limpia cualquier rastro de la partida antes de volver al menú */
  exitGameAndReset() {   
    this.gameService.exitAndResetGame()
    this.scoreService.clearScoreData()

    /* Notifica que salió de Score y se va a mostrar el Loader */
    this.scoreService.notifyExitedScore()

    this.loaderText = 'Volviendo al inicio'
    this.isLoading = true
    setTimeout(() => {
      this.router.navigate(['main'], { replaceUrl: true })
      
    }, 500);
  }  
}