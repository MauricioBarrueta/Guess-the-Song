import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { GameService } from '../../services/game-service';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SearchItem } from '../../interfaces/search';
import { ScoreResults } from '../../interfaces/score';
import { ScoreService } from '../../services/score-service';
import { TrackPreview } from "../../components/track-preview/track-preview";
import { TrackLyrics } from "../../components/track-lyrics/track-lyrics";
import { Loader } from '../../../../shared/loader/loader';
import { ModalHandlerService } from '../../../../shared/modal/service/modal-handler-service';


@Component({
  selector: 'app-game',
  imports: [CommonModule, TrackPreview, TrackLyrics, Loader],
  templateUrl: './game.html',
})
export class Game implements OnInit, OnDestroy {

  constructor(public gameService: GameService, private scoreService: ScoreService, private modalHandler: ModalHandlerService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {}
  
  /* Parámetros */
  query: string = ''
  quantity!: number
  difficulty!: string
  
  validSearchItems!: SearchItem[] /* Resultados que sí contienen la propiedad 'preview'*/
  gameTracks: SearchItem[] = [] 
  currentTrack!: SearchItem
  currentTrackIndex = 0
  answerOptions: SearchItem[][] = [] /* Bidimensional para guardar las opciones de cada pregunta para conservar su orden */

  playedPreviews = new Set<string>() /* Registra los previews que ya han sido reproducidos */
  failedPreviews = new Set<string>() /* Registra los previews que presentaron error al intentar reproducirlos */

  lyricsReady: boolean = false /* Estado de carga de la letra de la canción */
  isLoadingGame: boolean = true /* Verifica cuando ya se almacenó la letra de la primer canción en el caché */
  loaderText: string = 'Preparando la partida'
  isGameFinished: boolean = false /* Verifica si la partida terminó */

  score: ScoreResults[] = [] 

  private destroy$ = new Subject<void>() /* Usado por el takeUntil para finalizar todas las suscripciones activas */ 

  mouseEnter: boolean = false /* Cambia el estado de acuerdo al evento (mouseenter y mouseleave) */

  ngOnInit(): void {
    this.loaderText = 'Preparando la partida'

    /* Verifica si se está ejecutando en el navegador y no en el servidor */
    if (isPlatformBrowser(this.platformId)) {

      /* Controla y recupera el parámetro del localStorage, si no existe ninguno, redirige a /Main */
      const quantity = Number(localStorage.getItem('quantity')) || 10
      const query = localStorage.getItem('search') ?? localStorage.getItem('genre')
      const difficulty = localStorage.getItem('difficulty') as 'easy' | 'hard'

      this.quantity = quantity 
      this.difficulty = difficulty
      
      /* Si no existe ningún parámetro, regresa al inicio */
      if (!query) { 
        this.router.navigate(['/main'])
        return
      }

      /* Se guarda la consulta utilizada para obtener las canciones */
      this.query = query 

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

  /* Obtiene las canciones según el parámetro de búsqueda y prepara la partida */  
  getGameTracks(param: string) {
    const tracks$ = this.difficulty === 'easy' ? this.gameService.getTracksByArtist(param) : this.gameService.getTracksByGenre(param)
    tracks$
      .pipe(
        catchError((error) => {
          return throwError(() => error)
        })
      )
      .subscribe({
        next: (res) => {
          
          /* Muestra el modal si el ID no coincide con ningún artista o banda */
          if (!res) {
            this.modalHandler.resultModal(
              'fa-solid fa-magnifying-glass !text-[var(--glossy-grey)]',
              'No se pudo iniciar la partida', 'No se encontró ningún artista o banda con ese nombre',
              'warning', () => this.exitGame()
            )

            return
          }
        
          /* Almacena las canciones utilizando el título limpio como clave para evitar duplicados */          
          const uniqueTracks = new Map<string, SearchItem>() 

          for (const track of res.data) {
            /* Elimina canciones inexistentes o sin preview */
             if (!track?.preview) continue /* Con '?' accede a preview solamente si track existe */

            /* Limpia el título y evita canciones duplicadas */
            const cleanTitle = this.gameService.cleanTrackTitle(track.title)
            if (!uniqueTracks.has(cleanTitle)) {
              uniqueTracks.set(cleanTitle, track)
            }
          }
          const validTracks = [...uniqueTracks.values()]

          /* Verifica que haya canciones disponibles y al menos 5 para iniciar la partida */
          if (!validTracks.length || validTracks.length < 5) {

            this.modalHandler.resultModal(
              'fa-solid fa-triangle-exclamation', 
              'No se pudo iniciar la partida', 'No se encontraron suficientes canciones disponibles para jugar', 
              'warning', () => { this.exitGame() }
            )
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

              /* Notifica que Quiz terminó de cargar y el Loader dejó de mostrarse */
              this.gameService.notifyQuizLoaded()

              this.cdr.detectChanges()

              /* Precarga en segundo plano la letra de la siguiente canción */
              if (this.gameTracks.length > 1) {
                this.gameService.preloadTrackLyrics(this.gameTracks[1]).subscribe()
              }
            })
        },
        error: (err) => {          
          this.modalHandler.resultModal(
            'fa-solid fa-circle-xmark', 
            'Error al iniciar la partida', 'No fue posible obtener las canciones. Inténtalo de nuevo', 
            'error', () => { this.exitGame() }
          )
          console.error('ERROR:', err)
        }
      })
  }

  /* Genera las opciones de respuesta para la pregunta actual, mezclando la canción correcta con 3 incorrectas */   
  generateAnswers(): void {
    if (!this.currentTrack || !this.validSearchItems?.length) return

    /* Evita generar nuevamente las respuestas si ya fueron creadas para la pregunta actual */
    if (this.answerOptions[this.currentTrackIndex]) return

    /* Filtra las canciones incorrectas, selecciona 3 aleatorias, conserva únicamente títulos únicos y las combina con la correcta */
    const incorrectTracks = this.validSearchItems.filter((track) => track.id !== this.currentTrack.id)
    const uniqueTracks = new Map<string, SearchItem>()

    /* Título limpio de la respuesta correcta */
    const currentCleanTitle = this.gameService.cleanTrackTitle(this.currentTrack.title)

    for (const track of this.gameService.shuffle([...incorrectTracks])) {
      const cleanTitle = this.gameService.cleanTrackTitle(track.title)

      /* Omite versiones de la respuesta correcta y títulos duplicados */
      if (cleanTitle !== currentCleanTitle && !uniqueTracks.has(cleanTitle)) {
        uniqueTracks.set(cleanTitle, track)
      }
    }

    const randomIncorrect = [...uniqueTracks.values()].slice(0, 3)
    const answers = [this.currentTrack, ...randomIncorrect]

    /* Mezcla las respuestas una sola vez y las guarda para esta pregunta */
    this.answerOptions[this.currentTrackIndex] = this.gameService.shuffle([...answers])
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
      this.isGameFinished = true

      setTimeout(() => {
        this.scoreService.pushScoreData(this.score)
        this.gameService.clearLyricsCache() /* Se borra el caché al terminar la partida */
        this.gameService.clearViewedLyrics() /* Limpia el registro de letras guardadas */

        this.router.navigate(['score'], { replaceUrl: true })
      }, 800);      
    }
  }

  /* Verifica el estado de cada pregunta, si ya fue respondida o no */
  alreadyAnswered(index: number): boolean {
    return this.score.some(question => question.index === index)
  }   

  /* Registra y verifica los previews reproducidos durante la partida */
  onPreviewPlayed(preview: string) {
    this.playedPreviews.add(preview)
  }
  
  hasPlayedPreview(preview: string): boolean {
    return this.playedPreviews.has(preview)
  } 

  /* Registra el preview que presentó un error para conservar su estado durante la partida */
  onPreviewError(preview: string): void {
    this.failedPreviews.add(preview)
  }

  /* Controlan la navegación entre preguntas, verificando antes si es el primer o último índice */  
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

  /* Determinan el estado visual de los botones 'Anterior' y 'Siguiente' */
  get prevAnswered(): boolean {
    return this.currentTrackIndex > 0 && this.alreadyAnswered(this.currentTrackIndex - 1)
  }

  get nextAnswered(): boolean {
    return this.currentTrackIndex < this.gameTracks.length - 1 && this.alreadyAnswered(this.currentTrackIndex)
  }

  /* Barra de progreso, el porcentaje depende del número de canciones por partida */
  get progressBar(): number {
    return ((this.currentTrackIndex + 1) / this.gameTracks.length) * 100
  }

  showModal(): void {
    this.modalHandler.confirmModal(
      'fa-solid fa-circle-question', 
      '¿Estás seguro de que deseas salir de la partida?', 'Se perderá todo tu progreso actual', 
      () => { this.exitGame() }
    )
  }

  exitGame(): void {
    this.gameService.exitAndResetGame()
    this.isGameFinished = false

    /* Notifica que se va a salir de Quiz y se va a mostrar el Loader */
    this.gameService.notifyQuizExited()

    this.loaderText = 'Saliendo de la partida'
    this.isLoadingGame = true
    setTimeout(() => {
      this.router.navigate(['main'], { replaceUrl: true })
    }, 500);
  }  
}