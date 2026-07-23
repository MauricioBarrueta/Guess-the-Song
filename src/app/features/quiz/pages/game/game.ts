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
import { ModalService } from '../../../../shared/modal/service/modal-service';


@Component({
  selector: 'app-game',
  imports: [CommonModule, TrackPreview, TrackLyrics, Loader],
  templateUrl: './game.html',
})
export class Game implements OnInit, OnDestroy {

  constructor(private gameService: GameService, private gScoreService: GlobalScoreService, private modalService: ModalService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private cdr: ChangeDetectorRef) {}
  
  /* Parámetros */
  query: string = ''
  quantity!: number
  
  validSearchItems!: SearchItem[] /* Resultados que sí contienen la propiedad 'preview'*/
  gameTracks: SearchItem[] = [] //! DESCOMENTAR
//   gameTracks: SearchItem[] = [
//   {
//     "id": 3509364561,
//     "readable": true,
//     "title": "ERROR (Live from Auditorio Nacional, CDMX)",
//     "title_short": "ERROR",
//     "title_version": "(Live from Auditorio Nacional, CDMX)",
//     "isrc": "USUM72507225",
//     "link": "https://www.deezer.com/track/3509364561",
//     "duration": 237,
//     "rank": 244097,
//     "explicit_lyrics": false,
//     "explicit_content_lyrics": 0,
//     "explicit_content_cover": 0,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/7/9/3/0/793a59db7af4fd234af60c2905d34d76.mp3?hdnea=exp=1784647625~acl=/api/1/1/7/9/3/0/793a59db7af4fd234af60c2905d34d76.mp3*~data=user_id=0,application_id=42~hmac=0acc75a694d8599cb064e8f583e0f3d7ea3692dcf4a34d8179c64f4e1b924b1b",
//     "md5_image": "bfbbd20bd60ee3a7631bc7c24d8703a5",
//     "artist": {
//       "id": 7716640,
//       "name": "The Warning",
//       "link": "https://www.deezer.com/artist/7716640",
//       "picture": "https://api.deezer.com/artist/7716640/image",
//       "picture_small": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/56x56-000000-80-0-0.jpg",
//       "picture_medium": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/250x250-000000-80-0-0.jpg",
//       "picture_big": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/500x500-000000-80-0-0.jpg",
//       "picture_xl": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/1000x1000-000000-80-0-0.jpg",
//       "tracklist": "https://api.deezer.com/artist/7716640/top?limit=50",
//       "type": "artist"
//     },
//     "album": {
//       "id": 805177871,
//       "title": "Live from Auditorio Nacional, CDMX",
//       "cover": "https://api.deezer.com/album/805177871/image",
//       "cover_small": "https://cdn-images.dzcdn.net/images/cover/bfbbd20bd60ee3a7631bc7c24d8703a5/56x56-000000-80-0-0.jpg",
//       "cover_medium": "https://cdn-images.dzcdn.net/images/cover/bfbbd20bd60ee3a7631bc7c24d8703a5/250x250-000000-80-0-0.jpg",
//       "cover_big": "https://cdn-images.dzcdn.net/images/cover/bfbbd20bd60ee3a7631bc7c24d8703a5/500x500-000000-80-0-0.jpg",
//       "cover_xl": "https://cdn-images.dzcdn.net/images/cover/bfbbd20bd60ee3a7631bc7c24d8703a5/1000x1000-000000-80-0-0.jpg",
//       "md5_image": "bfbbd20bd60ee3a7631bc7c24d8703a5",
//       "tracklist": "https://api.deezer.com/album/805177871/tracks",
//       "type": "album"
//     },
//     "type": "track"
//   },
//   {
//     "id": 557063642,
//     "readable": true,
//     "title": "Our Mistakes",
//     "title_short": "Our Mistakes",
//     "title_version": "",
//     "isrc": "TCACT1649629",
//     "link": "https://www.deezer.com/track/557063642",
//     "duration": 254,
//     "rank": 225553,
//     "explicit_lyrics": false,
//     "explicit_content_lyrics": 0,
//     "explicit_content_cover": 2,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/e/e/f/0/eef51176671b7152e38d2f5e18ee7959.mp3?hdnea=exp=1784647625~acl=/api/1/1/e/e/f/0/eef51176671b7152e38d2f5e18ee7959.mp3*~data=user_id=0,application_id=42~hmac=005e1c2be4f76c40b89736fdde7978591565b9cb9611a518aff62e6f411c440c",
//     "md5_image": "e2ec7d66e3112c39d1468def954ef055",
//     "artist": {
//       "id": 7716640,
//       "name": "The Warning",
//       "link": "https://www.deezer.com/artist/7716640",
//       "picture": "https://api.deezer.com/artist/7716640/image",
//       "picture_small": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/56x56-000000-80-0-0.jpg",
//       "picture_medium": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/250x250-000000-80-0-0.jpg",
//       "picture_big": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/500x500-000000-80-0-0.jpg",
//       "picture_xl": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/1000x1000-000000-80-0-0.jpg",
//       "tracklist": "https://api.deezer.com/artist/7716640/top?limit=50",
//       "type": "artist"
//     },
//     "album": {
//       "id": 73592392,
//       "title": "XXI Century Blood",
//       "cover": "https://api.deezer.com/album/73592392/image",
//       "cover_small": "https://cdn-images.dzcdn.net/images/cover/e2ec7d66e3112c39d1468def954ef055/56x56-000000-80-0-0.jpg",
//       "cover_medium": "https://cdn-images.dzcdn.net/images/cover/e2ec7d66e3112c39d1468def954ef055/250x250-000000-80-0-0.jpg",
//       "cover_big": "https://cdn-images.dzcdn.net/images/cover/e2ec7d66e3112c39d1468def954ef055/500x500-000000-80-0-0.jpg",
//       "cover_xl": "https://cdn-images.dzcdn.net/images/cover/e2ec7d66e3112c39d1468def954ef055/1000x1000-000000-80-0-0.jpg",
//       "md5_image": "e2ec7d66e3112c39d1468def954ef055",
//       "tracklist": "https://api.deezer.com/album/73592392/tracks",
//       "type": "album"
//     },
//     "type": "track"
//   },
//   {
//     "id": 1372154132,
//     "readable": true,
//     "title": "CHOKE",
//     "title_short": "CHOKE",
//     "title_version": "",
//     "isrc": "USUM72107020",
//     "link": "https://www.deezer.com/track/1372154132",
//     "duration": 231,
//     "rank": 559567,
//     "explicit_lyrics": false,
//     "explicit_content_lyrics": 0,
//     "explicit_content_cover": 0,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/d/2/0/0/d2016b67a00f09538112f63a765fc902.mp3?hdnea=exp=1784647625~acl=/api/1/1/d/2/0/0/d2016b67a00f09538112f63a765fc902.mp3*~data=user_id=0,application_id=42~hmac=6294a16a03ad2859768466752c3c50a57bece75fd9cfa6855a89474986ccea57",
//     "md5_image": "f0de2e5a3c4b2047eb3e94b0cc523bf4",
//     "artist": {
//       "id": 7716640,
//       "name": "The Warning",
//       "link": "https://www.deezer.com/artist/7716640",
//       "picture": "https://api.deezer.com/artist/7716640/image",
//       "picture_small": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/56x56-000000-80-0-0.jpg",
//       "picture_medium": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/250x250-000000-80-0-0.jpg",
//       "picture_big": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/500x500-000000-80-0-0.jpg",
//       "picture_xl": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/1000x1000-000000-80-0-0.jpg",
//       "tracklist": "https://api.deezer.com/artist/7716640/top?limit=50",
//       "type": "artist"
//     },
//     "album": {
//       "id": 230122032,
//       "title": "CHOKE",
//       "cover": "https://api.deezer.com/album/230122032/image",
//       "cover_small": "https://cdn-images.dzcdn.net/images/cover/f0de2e5a3c4b2047eb3e94b0cc523bf4/56x56-000000-80-0-0.jpg",
//       "cover_medium": "https://cdn-images.dzcdn.net/images/cover/f0de2e5a3c4b2047eb3e94b0cc523bf4/250x250-000000-80-0-0.jpg",
//       "cover_big": "https://cdn-images.dzcdn.net/images/cover/f0de2e5a3c4b2047eb3e94b0cc523bf4/500x500-000000-80-0-0.jpg",
//       "cover_xl": "https://cdn-images.dzcdn.net/images/cover/f0de2e5a3c4b2047eb3e94b0cc523bf4/1000x1000-000000-80-0-0.jpg",
//       "md5_image": "f0de2e5a3c4b2047eb3e94b0cc523bf4",
//       "tracklist": "https://api.deezer.com/album/230122032/tracks",
//       "type": "album"
//     },
//     "type": "track"
//   },
//   {
//     "id": 2857516682,
//     "readable": true,
//     "title": "Apologize",
//     "title_short": "Apologize",
//     "title_version": "",
//     "isrc": "USUM72402495",
//     "link": "https://www.deezer.com/track/2857516682",
//     "duration": 221,
//     "rank": 486453,
//     "explicit_lyrics": false,
//     "explicit_content_lyrics": 0,
//     "explicit_content_cover": 1,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/5/0/a/0/50a1d54307efe3ad0d03a542bfcab8ff.mp3?hdnea=exp=1784647625~acl=/api/1/1/5/0/a/0/50a1d54307efe3ad0d03a542bfcab8ff.mp3*~data=user_id=0,application_id=42~hmac=420df7e2ebad81d79f1f0b9dd6b2da2c6a1f46ec023ba3735a9b501dcfe0536f",
//     "md5_image": "fec4f5e59403168725e9805a4ef9d90b",
//     "artist": {
//       "id": 7716640,
//       "name": "The Warning",
//       "link": "https://www.deezer.com/artist/7716640",
//       "picture": "https://api.deezer.com/artist/7716640/image",
//       "picture_small": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/56x56-000000-80-0-0.jpg",
//       "picture_medium": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/250x250-000000-80-0-0.jpg",
//       "picture_big": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/500x500-000000-80-0-0.jpg",
//       "picture_xl": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/1000x1000-000000-80-0-0.jpg",
//       "tracklist": "https://api.deezer.com/artist/7716640/top?limit=50",
//       "type": "artist"
//     },
//     "album": {
//       "id": 604641912,
//       "title": "Keep Me Fed",
//       "cover": "https://api.deezer.com/album/604641912/image",
//       "cover_small": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/56x56-000000-80-0-0.jpg",
//       "cover_medium": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/250x250-000000-80-0-0.jpg",
//       "cover_big": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/500x500-000000-80-0-0.jpg",
//       "cover_xl": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/1000x1000-000000-80-0-0.jpg",
//       "md5_image": "fec4f5e59403168725e9805a4ef9d90b",
//       "tracklist": "https://api.deezer.com/album/604641912/tracks",
//       "type": "album"
//     },
//     "type": "track"
//   },
//   {
//     "id": 2857516722,
//     "readable": true,
//     "title": "Satisfied",
//     "title_short": "Satisfied",
//     "title_version": "",
//     "isrc": "USUM72402499",
//     "link": "https://www.deezer.com/track/2857516722",
//     "duration": 189,
//     "rank": 416066,
//     "explicit_lyrics": false,
//     "explicit_content_lyrics": 0,
//     "explicit_content_cover": 1,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/9/5/6/0/9567aeae68c59b4329c2910db2f61fbe.mp3?hdnea=exp=1784647625~acl=/api/1/1/9/5/6/0/9567aeae68c59b4329c2910db2f61fbe.mp3*~data=user_id=0,application_id=42~hmac=74bd3bf2a260e721c83783f43535318a0e16044d3849676af71df02bfe43a495",
//     "md5_image": "fec4f5e59403168725e9805a4ef9d90b",
//     "artist": {
//       "id": 7716640,
//       "name": "The Warning",
//       "link": "https://www.deezer.com/artist/7716640",
//       "picture": "https://api.deezer.com/artist/7716640/image",
//       "picture_small": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/56x56-000000-80-0-0.jpg",
//       "picture_medium": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/250x250-000000-80-0-0.jpg",
//       "picture_big": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/500x500-000000-80-0-0.jpg",
//       "picture_xl": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/1000x1000-000000-80-0-0.jpg",
//       "tracklist": "https://api.deezer.com/artist/7716640/top?limit=50",
//       "type": "artist"
//     },
//     "album": {
//       "id": 604641912,
//       "title": "Keep Me Fed",
//       "cover": "https://api.deezer.com/album/604641912/image",
//       "cover_small": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/56x56-000000-80-0-0.jpg",
//       "cover_medium": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/250x250-000000-80-0-0.jpg",
//       "cover_big": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/500x500-000000-80-0-0.jpg",
//       "cover_xl": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/1000x1000-000000-80-0-0.jpg",
//       "md5_image": "fec4f5e59403168725e9805a4ef9d90b",
//       "tracklist": "https://api.deezer.com/album/604641912/tracks",
//       "type": "album"
//     },
//     "type": "track"
//   }
// ]

  currentTrack!: SearchItem //! DESCOMENTAR
//   currentTrack: SearchItem = {
//   "id": 2857516662,
//   "readable": true,
//   "title": "Six Feet Deep",
//   "title_short": "Six Feet Deep",
//   "title_version": "",
//   "isrc": "USUM72402489",
//   "link": "https://www.deezer.com/track/2857516662",
//   "duration": 179,
//   "rank": 519954,
//   "explicit_lyrics": false,
//   "explicit_content_lyrics": 0,
//   "explicit_content_cover": 1,
//   "preview": "https://cdnt-preview.dzcdn.net/api/1/1/4/6/5/0/465da4869674dee8f065b8e68ecaf9db.mp3?hdnea=exp=1784648198~acl=/api/1/1/4/6/5/0/465da4869674dee8f065b8e68ecaf9db.mp3*~data=user_id=0,application_id=42~hmac=16781ff82aee725a9e679834e53349bda1ad83744bc7dea8668c7a061f365613",
//   "md5_image": "fec4f5e59403168725e9805a4ef9d90b",
//   "artist": {
//     "id": 7716640,
//     "name": "The Warning",
//     "link": "https://www.deezer.com/artist/7716640",
//     "picture": "https://api.deezer.com/artist/7716640/image",
//     "picture_small": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/56x56-000000-80-0-0.jpg",
//     "picture_medium": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/250x250-000000-80-0-0.jpg",
//     "picture_big": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/500x500-000000-80-0-0.jpg",
//     "picture_xl": "https://cdn-images.dzcdn.net/images/artist/f3850a5039ccabc6691ec8ba01b27460/1000x1000-000000-80-0-0.jpg",
//     "tracklist": "https://api.deezer.com/artist/7716640/top?limit=50",
//     "type": "artist"
//   },
//   "album": {
//     "id": 604641912,
//     "title": "Keep Me Fed",
//     "cover": "https://api.deezer.com/album/604641912/image",
//     "cover_small": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/56x56-000000-80-0-0.jpg",
//     "cover_medium": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/250x250-000000-80-0-0.jpg",
//     "cover_big": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/500x500-000000-80-0-0.jpg",
//     "cover_xl": "https://cdn-images.dzcdn.net/images/cover/fec4f5e59403168725e9805a4ef9d90b/1000x1000-000000-80-0-0.jpg",
//     "md5_image": "fec4f5e59403168725e9805a4ef9d90b",
//     "tracklist": "https://api.deezer.com/album/604641912/tracks",
//     "type": "album"
//   },
//   "type": "track"
// }



  currentTrackIndex = 0
  answerOptions: SearchItem[] = []

  lyricsReady: boolean = false /* Estado de carga de la letra de la canción */
  isLoadingGame: boolean = true /* Verifica cuando ya se almacenó la letra de la primer canción en el caché */

  score: ScoreResults[] = [] 

  private destroy$ = new Subject<void>() /* Usado por el takeUntil para finalizar todas las suscripciones activas */ 

  mouseEnter: boolean = false /* Cambia el estado de acuerdo al evento (mouseenter y mouseleave) */

  ngOnInit(): void {
    /* Verifica si se está ejecutando en el navegador y no en el servidor */
    if (isPlatformBrowser(this.platformId)) {

      /* Controla y recupera el parámetro del localStorage, si no existe ninguno, redirige a /Main */
      const quantity = Number(localStorage.getItem('quantity')) || 5
      const query = localStorage.getItem('search') ?? localStorage.getItem('genre')

      this.quantity = quantity 
      
      /* Si no existe ningún parámetro, regresa al inicio */
      if (!query) { //! DESCOMENTAR
        this.router.navigate(['/main'])
        return
      }

      /* Se guarda la consulta utilizada para obtener las canciones */
      this.query = query //! DESCOMENTAR


      // this.query = 'The Warning' //* QUITAR ******************
      
      /* Limpia los datos temporales */
      localStorage.removeItem('search')
      localStorage.removeItem('genre')
      localStorage.removeItem('quantity')

      /* Obtiene las canciones */
      this.getGameTracks(this.query) //! DESCOMENTAR
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

    /* Filtra las canciones incorrectas, selecciona 3 aleatorias, conserva únicamente títulos únicos y las combina con la correcta */
    const incorrectTracks = this.validSearchItems.filter((track) => track.id !== this.currentTrack.id)    
    const uniqueTracks = new Map<string, SearchItem>() /* Utiliza el título limpio como key para evitar respuestas duplicadas */
    for (const track of this.gameService.shuffle([...incorrectTracks])) {
      const cleanTitle = this.gameService.cleanTrackTitle(track.title)
      
      /* Omite títulos duplicados */
      if (!uniqueTracks.has(cleanTitle)) {
        uniqueTracks.set(cleanTitle, track)
      }
    }
    const randomIncorrect = [...uniqueTracks.values()].slice(0, 3);
    const answers = [this.currentTrack, ...randomIncorrect]

    /* Se mezclan ahora las 4 posibles respuestas y se asignan al arreglo */
    this.answerOptions = this.gameService
      .shuffle([...answers])
      /* Crea una copia con los títulos ya modificados */
      .map(track => ({ ...track, title: this.gameService.cleanTrackTitle(track.title) }));
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

      setTimeout(() => {
        this.gScoreService.pushScoreData(this.score)
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

  openModal(): void {
    this.modalService.showModal({
      title: '¿Estás seguro de que deseas salir de la partida?',
      content: 'Se perderá todo tu progreso actual',
      type: 'confirm',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => this.exitGame(),
      onCancel: () => {}
    });
  }

  exitGame(): void {
    this.gameService.clearLyricsCache();
    this.gameService.clearViewedLyrics();

    localStorage.removeItem('search');
    localStorage.removeItem('genre');
    localStorage.removeItem('quantity');

    this.router.navigate(['main'], { replaceUrl: true });
  }
}
