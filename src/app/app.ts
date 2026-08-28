import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Modal } from "./shared/modal/modal";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ScoreService } from './features/quiz/services/score-service';
import { GameService } from './features/quiz/services/game-service';
import { MainService } from './features/quiz/services/main-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Modal, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title = signal('guess-the-song');  

  bgClass: string = 'bg-[var(--charade)]'
  isMain: boolean = false
  isQuiz: boolean = false
  isScore: boolean = false

  /* Actualiza el color y la imagen de fondo de la aplicación según la ruta activa */
  constructor(private router: Router, private mainService: MainService, private scoreService: ScoreService, private gameService: GameService, private cdr: ChangeDetectorRef) {
    /* Escucha únicamente cuando finaliza una navegación */
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url

        if (url.startsWith('/main')) {
          this.isMain = true
          this.isScore = false
          this.isQuiz = false
          this.bgClass = 'bg-[var(--charade)]'

        } else if (url.startsWith('/score')) {
          this.isMain = false
          this.isScore = false
          this.isQuiz = false
          this.bgClass = 'bg-[var(--charade)]'

        } else if (url.startsWith('/quiz')) {
          this.isMain = false
          this.isScore = false
          this.isQuiz = false
          this.bgClass = 'bg-gradient-to-b from-[var(--dusk-blue)] from-0% to-[var(--charade)] to-80%'
        }
      })
  }

  ngOnInit(): void { 
    /* Oculta la imagen mientras se cargan los datos de Main */
    this.mainService.listLoading$.subscribe(() => {
      this.isMain = false
      this.cdr.detectChanges()
    })

    /* Muestra la imagen cuando terminan de cargarse los datos de Main */
    this.mainService.listLoaded$.subscribe(() => {
      this.isMain = true
      this.cdr.detectChanges()
    })

    /* Muestra la imagen cuando Score termina de cargarse y se oculta el Loader */
    this.scoreService.scoreLoaded$.subscribe(() => {
      this.isScore = true
      this.cdr.detectChanges() 
    })

    /* Muestra la imagen cuando Quiz termina de cargarse y se oculta el Loader */
    this.gameService.quizLoaded$.subscribe(() => {
      this.isQuiz = true
      this.cdr.detectChanges()
    })

    /* Oculta la imagen al salir de Quiz */
    this.gameService.exitedQuiz$.subscribe(() => {
      this.isQuiz = false
      this.cdr.detectChanges()
    })

    /* Oculta la imagen al salir de Score */
    this.scoreService.exitedScore$.subscribe(() => {
      this.isScore = false
      this.cdr.detectChanges()
    })
  }
}