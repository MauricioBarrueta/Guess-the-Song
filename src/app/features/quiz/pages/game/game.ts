import { ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { GameService } from '../../services/game-service';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Playlist, PlaylistItem } from '../../interfaces/playlist';
import { Router } from '@angular/router';
import { Search, SearchItem } from '../../interfaces/search';
import { ScoreResults } from '../../../../core/interfaces/score';
import { GlobalScoreService } from '../../../../core/services/global-score-service';
import { TrackPreview } from "../../components/track-preview/track-preview";
import { TrackLyrics } from "../../components/track-lyrics/track-lyrics";


@Component({
  selector: 'app-game',
  imports: [CommonModule, TrackPreview, TrackLyrics],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnInit, OnDestroy {

  constructor(private gameService: GameService, private gScoreService: GlobalScoreService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {}
  
  /* Parámetros */
  genre: string = ''
  search: string = ''
  quantity!: number

  playlistItems: PlaylistItem[] = [] /* Lista de todas las playlists obtenidas */
  selectedPlaylist: PlaylistItem | null = null /* Playlist obtenida de manera aleatoria */

  validSearchItems!: SearchItem[] /* Resultados que sí contienen la propiedad 'preview'*/
  gameTracks: SearchItem[] = [] /* Resultados aleatorios para cada partida de acuerdo a la cantidad ingresada */
  currentTrack!: SearchItem; /* Almacena la información de la canción correspondiente a la pregunta actual */
  currentTrackIndex = 0
  answerOptions: SearchItem[] = [] /* Almacena las 4 posibles respuestas para cada canción */

  // @Output() answerSelected = new EventEmitter<SearchItem>();

  score: ScoreResults[] = [] /* Almacena las respuestas y el resultado de cada pregunta de la partida */

  lyricsReady = false;


  mouseEnter: boolean = false



  isLoadingGame: boolean = true /* Verifica si se está cargando la partida */
  private destroy$ = new Subject<void>() /* Usado por el takeUntil para finalizar todas las suscripciones activas */ 

  ngOnInit(): void {
    /* Verifica si se está ejecutando en el navegador y no en el servidor */
    if (isPlatformBrowser(this.platformId)) {

      //! QUITAR AL TERMINAR PRUEBAS
      this.quantity = 10;
      this.search = 'The Warning';
      
      this.initGame()

      //* DESCOMENTAR TODO ESTO TRAS PRUEBAS     
      /* Controla y recupera el parámetro del localStorage, si no existe ninguno, redirige a /Main */
      // const genre = localStorage.getItem('genre')
      // const search = localStorage.getItem('search')
      // const quantity = Number(localStorage.getItem('quantity')) || 1

      // this.quantity = quantity;

      // if (!genre && !search) {
      //   this.router.navigate(['/main'])
      //   return
      // }

      // if (genre) {
      //   this.genre = genre
      //   localStorage.removeItem('genre')

      //   this.getPlaylistByGenre()
      // }

      // if (search) {
      //   this.search = search
      //   localStorage.removeItem('search')

      //   this.getListBySearch()
      // }

      // localStorage.removeItem('quantity')
    }
  }

  ngOnDestroy(): void {
    /* Libera las suscripciones activas al destruir el componente */
    this.destroy$.next()
    this.destroy$.complete()
  }


  initGame(): void {
  this.getListBySearch();
}


  getPlaylistByGenre() {
    this.gameService
      .searchByGenre(this.genre)
      .pipe(
        // tap((res: Playlist) => {
        //   this.playlist$ = res
        // }),
        catchError((error) => {
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: (res: Playlist) => {
          /* Se guarda la lista de playlist en el array */
          this.playlistItems = res.data;

          //! AÚN NO DEFINO EL SI SE FILTRAN O NO, Y EL LÍMITE
          /* Se filtran las playlist con +20 canciones */
          const validPlaylists = this.playlistItems.filter((p) => p.nb_tracks >= 20);

          if (!validPlaylists.length) {
            console.warn('No hay playlists válidas');
            return;
          }

          /* Se elige una playlist de manera aleatoria y se almacena */
          const randomPlaylist = validPlaylists[Math.floor(Math.random() * validPlaylists.length)];
          this.selectedPlaylist = randomPlaylist;

          console.log('Playlist elegida: ', this.selectedPlaylist);

          // Próximo paso
          // this.getTracks(randomPlaylist.id);
        },
        error: (err) => {
          console.error('ERROR:', err);
        },
      });
  }

  /* Se obtiene la lista de canciones de acuerdo al parámetro de búsqueda y prepara la partida */
  // getListBySearch() {
  //   this.gameService.searchByParam(this.search)
  //     .pipe(
  //       catchError((error) => {
  //         return throwError(() => error)
  //       }),
  //     )
  //     .subscribe({
  //       next: (res: Search) => {

  //         /* Filtra las canciones con preview, verifica que existan resultados válidos y los almacena */
  //         const validTracks = res.data.filter((t) => t.preview)
  //         if (!validTracks.length) {
  //           console.warn('No se encontraron tracks válidas')
  //           return
  //         }          
  //         this.validSearchItems = validTracks

  //         /* Se mezclan aleatoriamente las canciones usando Fisher–Yates */
  //         const shuffled = this.gameService.shuffle([...validTracks])

  //         /* Evita pedir más canciones de las disponibles */
  //         const amount = Math.min(this.quantity, validTracks.length)

  //         /* Se asignan las canciones de la partida de acuerdo a la cantidad ingresada */
  //         this.gameTracks = shuffled.slice(0, amount)
  //         this.currentTrack = this.gameTracks[this.currentTrackIndex]
  //         this.generateAnswers()

  //         this.cdr.detectChanges() /* Detecta los cambios, previene error */          
  //       },
  //       error: (err) => { console.error('ERROR:', err); },
  //     });
  // }
  getListBySearch() {
  this.gameService.searchByParam(this.search)
    .pipe(
      catchError((error) => {
        console.error('ERROR SEARCH:', error);
        return throwError(() => error);
      }),
    )
    .subscribe({
      next: (res: Search) => {

        console.log('===== SEARCH COMPLETADA =====');

        /* Filtra las canciones con preview */
        const validTracks = res.data.filter((t) => t.preview);

        console.log('Tracks válidas:', validTracks.length);

        if (!validTracks.length) {
          console.warn('No se encontraron tracks válidas');
          return;
        }

        this.validSearchItems = validTracks;

        /* Se mezclan aleatoriamente */
        const shuffled = this.gameService.shuffle([...validTracks]);

        /* Cantidad para la partida */
        const amount = Math.min(this.quantity, validTracks.length);

        this.gameTracks = shuffled.slice(0, amount);

        console.log('gameTracks:', this.gameTracks.length);
        console.log('Primer track:', this.gameTracks[0]);

        /* Inicializa la partida */
        this.currentTrackIndex = 0;

        console.log('Índice:', this.currentTrackIndex);

        this.currentTrack = this.gameTracks[this.currentTrackIndex];

        console.log('currentTrack asignado:', this.currentTrack);

        this.generateAnswers();

        console.log('answerOptions:', this.answerOptions);

        /* Ya está lista la información, oculta loader */
        this.isLoadingGame = false;

        console.log('isLoadingGame:', this.isLoadingGame);

        this.cdr.detectChanges();

        /* Precarga de letras en segundo plano */
        console.log('===== INICIANDO PRELOAD =====');

        this.gameService.preloadTracksLyrics(this.gameTracks)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              console.log('✅ PRELOAD NEXT');
            },
            complete: () => {
              console.log('🏁 PRELOAD COMPLETE');
            },
            error: (err) => {
              console.error('❌ PRELOAD ERROR:', err);
            }
          });
      },
      error: (err) => {
        console.error('ERROR:', err);
      },
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

  /* Registra la respuesta de cada pregunta, evita duplicados y envía los resultados al finalizar la partida */  
  onAnswerSelected(answer: string) {    
    /* Verifica si la pregunta actual ya fue respondida */
    const isAnswered = this.score.some(question => question.index === this.currentTrackIndex)

    if(!isAnswered) {
      this.score.push({
        index: this.currentTrackIndex,
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





  onLyricsLoaded(status: boolean) {
  this.lyricsReady = status;
}







  /* Controla la navegación entre preguntas, no sin antes verificar si no se encuentra en la primera o en la última */
  nextQuestion() {
    if (this.currentTrackIndex >= this.gameTracks.length - 1) return

    this.currentTrackIndex++
    this.currentTrack = this.gameTracks[this.currentTrackIndex]
    this.generateAnswers()
  }

  prevQuestion() {
    if (this.currentTrackIndex <= 0) return

    this.currentTrackIndex--
    this.currentTrack = this.gameTracks[this.currentTrackIndex]
    this.generateAnswers()
  }
}
