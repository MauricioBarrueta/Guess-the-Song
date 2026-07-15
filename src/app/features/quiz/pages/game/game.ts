import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { GameService } from '../../services/game-service';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Search, SearchItem } from '../../interfaces/search';
import { ScoreResults } from '../../../../core/interfaces/score';
import { GlobalScoreService } from '../../../../core/services/global-score-service';
import { TrackPreview } from "../../components/track-preview/track-preview";
import { TrackLyrics } from "../../components/track-lyrics/track-lyrics";
import { Loader } from '../../../../shared/loader/loader';


@Component({
  selector: 'app-game',
  imports: [CommonModule, TrackPreview, TrackLyrics, Loader],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnInit, OnDestroy {

  constructor(private gameService: GameService, private gScoreService: GlobalScoreService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {}
  
  /* Parámetros */
  query: string = ''
  quantity!: number
  
  validSearchItems!: SearchItem[] /* Resultados que sí contienen la propiedad 'preview'*/
  gameTracks: SearchItem[] = [] /* Resultados aleatorios para cada partida de acuerdo a la cantidad ingresada */
  currentTrack!: SearchItem; /* Almacena la información de la canción correspondiente a la pregunta actual */
  currentTrackIndex = 0
  answerOptions: SearchItem[] = [] /* Almacena las 4 posibles respuestas para cada canción */

  score: ScoreResults[] = [] /* Almacena las respuestas y el resultado de cada pregunta de la partida */

  lyricsReady: boolean = false /* Estado de carga de la letra de la canción */

  isLoadingGame: boolean = true /* Cambia su estado cuando se almacena la letra de la 1er canción en el caché */
  private destroy$ = new Subject<void>() /* Usado por el takeUntil para finalizar todas las suscripciones activas */ 

  mouseEnter: boolean = false  

  ngOnInit(): void {
    /* Verifica si se está ejecutando en el navegador y no en el servidor */
    if (isPlatformBrowser(this.platformId)) {

      /* Controla y recupera el parámetro del localStorage, si no existe ninguno, redirige a /Main */
      const quantity = Number(localStorage.getItem('quantity')) || 5
      const query = localStorage.getItem('search') ?? localStorage.getItem('genre')

      // this.quantity = quantity //! DESCOMENTAR
      this.quantity = 5
      
      //! DESCOMENTAR
      /* Si no existe ningún parámetro, regresa al inicio */
      // if (!query) {
      //   this.router.navigate(['/main'])
      //   return
      // }

      /* Se guarda la consulta utilizada para obtener las canciones */
      // this.query = query //!DESCOMENTAR
      this.query = 'The Warning'
      
      /* Limpia los datos temporales */
      localStorage.removeItem('search')
      localStorage.removeItem('genre')
      localStorage.removeItem('quantity')

      /* Obtiene las canciones */
      this.getGameTracks(this.query)
    }
  }

  ngOnDestroy(): void {
    /* Libera las suscripciones activas al destruir el componente */
    this.destroy$.next()
    this.destroy$.complete()
  }

  /* Se obtiene la lista de canciones de acuerdo al parámetro de búsqueda y prepara la partida */
  getGameTracks(param: string) {
    this.gameService.searchByParam(param)
      .pipe(
        catchError((error) => {
          return throwError(() => error)
        }),
      )
      .subscribe({
        next: (res: Search) => {

          /* Filtra las canciones con preview, verifica que existan resultados válidos y los almacena */
          const validTracks = res.data.filter((t) => t.preview)
          if (!validTracks.length) {
            console.warn('No se encontraron tracks válidas')
            return
          }          
          this.validSearchItems = validTracks

          /* Se mezclan aleatoriamente las canciones usando Fisher–Yates */
          const shuffled = this.gameService.shuffle([...validTracks])

          /* Evita pedir más canciones de las disponibles */
          const amount = Math.min(this.quantity, validTracks.length)          
          
          /* Se asignan las canciones de la partida de acuerdo a la cantidad ingresada */
          this.gameTracks = shuffled.slice(0, amount)
          this.currentTrackIndex = 0
          this.currentTrack = this.gameTracks[this.currentTrackIndex]          

          /* Espera únicamente la letra de la primera canción */
          this.gameService.preloadTrackLyrics(this.currentTrack)
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe(() => {
              this.generateAnswers()
              this.isLoadingGame = false
              this.cdr.detectChanges()
              
              /* Precarga en segundo plano la letra de la siguiente canción */
              if (this.gameTracks.length > 1) {
                this.gameService.preloadTrackLyrics(this.gameTracks[1]).subscribe()
              }
            }) 
        },
        error: (err) => { console.error('ERROR:', err); },
      });
  }

  /* Genera las opciones de respuesta para la pregunta actual, mezclando la canción correcta con 3 incorrectas */
  generateAnswers() {
    if (!this.currentTrack || !this.validSearchItems?.length) return

    /* Filtra las canciones incorrectas, selecciona 3 aleatorias y las combina con la correcta */
    const incorrectTracks = this.validSearchItems.filter((track) => track.id !== this.currentTrack.id)
    const randomIncorrect = this.gameService.shuffle([...incorrectTracks]).slice(0, 3)
    const answers = [this.currentTrack, ...randomIncorrect]

    /* Se mezclan ahora las 4 posibles respuestas y se asignan al arreglo answers[] */
    this.answerOptions = this.gameService.shuffle([...answers])
  }

  /* Se obtiene la respuesta correcta de cada canción de la partida */
  getCorrectAnswer(selected: string): boolean{
    const correct = this.currentTrack.title
    return selected === correct
  }

  /* Actualiza el estado de carga de la letra de la canción actual */
  onLyricsLoaded(status: boolean) {
    this.lyricsReady = status
  }

  /* Registra la respuesta de cada pregunta, evita duplicados y envía los resultados al finalizar la partida */  
  onAnswerSelected(answer: string) {    
    /* Verifica si la pregunta actual ya fue respondida */
    const isAnswered = this.score.some(question => question.index === this.currentTrackIndex)

    if(!isAnswered) {
      this.score.push({
        index: this.currentTrackIndex,
        album: this.currentTrack.album.cover_medium,
        preview: this.currentTrack.preview,
        selectedTrack: answer,
        correctTrack: this.currentTrack.title,
        result: this.getCorrectAnswer(answer)
      });      
    }
    
    if(this.score.length === this.gameTracks.length) {
      this.gScoreService.pushScoreData(this.score)
      this.gameService.clearLyricsCache() /* Se borra el caché al terminar la partida */
      this.gameService.clearViewedLyrics() /* Limpia el registro de letras guardadas */
      this.router.navigate(['game-score'], { replaceUrl: true })
    }
  }

  /* Verifica el estado de cada pregunta, si ya fue respondida o no */
  alreadyAnswered(index: number): boolean {
    return this.score.some(question => question.index === index)
  }   

  /* Controla la navegación entre preguntas, no sin antes verificar si no se encuentra en la primera o en la última */  
  nextQuestion() {
    if (this.currentTrackIndex >= this.gameTracks.length - 1) return

    this.currentTrackIndex++
    this.currentTrack = this.gameTracks[this.currentTrackIndex]
    this.generateAnswers()

    /* Precarga la letra de la siguiente canción */
    const nextIndex = this.currentTrackIndex + 1
    if (nextIndex < this.gameTracks.length) {
      this.gameService.preloadTrackLyrics(this.gameTracks[nextIndex])
        .subscribe()
    }
  }

  prevQuestion() {
    if (this.currentTrackIndex <= 0) return

    this.currentTrackIndex--
    this.currentTrack = this.gameTracks[this.currentTrackIndex]
    this.generateAnswers()
  }
}
