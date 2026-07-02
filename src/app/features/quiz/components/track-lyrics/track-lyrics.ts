import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { GameService } from '../../services/game-service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../../shared/modal/service/modal-service';

@Component({
  selector: 'app-track-lyrics',
  imports: [],
  templateUrl: './track-lyrics.html',
  styleUrl: './track-lyrics.scss',
})
export class TrackLyrics implements OnInit, OnChanges, OnDestroy {

  constructor(public gameService: GameService, private modalService: ModalService) {}

  lyrics: string | null = null

  @Input({ required: true }) artist!: string
  @Input({ required: true }) track!: string
  @Input({ required: true }) index!: number

  private destroy$ = new Subject<void>() /* Usado por el takeUntil para finalizar todas las suscripciones activas */
  @Output() lyricsLoaded = new EventEmitter<boolean>() /* Para notificar a Game si ya se cargó la letra o no */

  /* Estados de la letra (carga, disponibilidad y visualización) */
  isLoadingLyrics: boolean = false
  isLyricsViewed: boolean = false
  isLyricsAvailable: boolean = false

  ngOnInit(): void {
    this.loadLyrics()
  }

  ngOnChanges(changes: SimpleChanges): void {
    /* Se actualiza la letra al recibir un nuevo artista o canción */
    if (changes['artist'] || changes['track']) {
      this.loadLyrics()
    }
  }

  ngOnDestroy(): void {
    /* Libera las suscripciones activas al destruir el componente */
    this.destroy$.next()
    this.destroy$.complete()
  }

  /* Obtiene la letra de cada canción, guarda solamente los primeros versos y notifica cuando la carga finaliza */
  // loadLyrics(): void {
  //   if (!this.artist || !this.track) return

  //   this.isLoadingLyrics = true
  //   this.isLyricsAvailable = false
  //   this.isLyricsViewed = false
  //   this.lyrics = ''

  //   /* Codifica los parámetros para enviarlos de forma segura, además de borrar el contenido dentro de paréntesis -> (Live), (Acoustic), etc */
  //   const artist = encodeURIComponent(this.artist)
  //   const track = encodeURIComponent(this.track.replace(/\(.*?\)/g, '').trim())

  //   this.gameService.getTrackLyrics(artist, track)
  //     .pipe(
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         /* Conserva las primeras 8 líneas con contenido y omite líneas vacías. */
  //         this.lyrics = res?.plainLyrics ?.split(/\r?\n/).filter((line) => line.trim() !== '').slice(0, 8).join('\n') || 'Letra no disponible'
  //         // this.lyricsLoaded.emit(true)
  //         // this.isLoadingLyrics = false
  //         // this.isLyricsViewed = false
  //         // this.isLyricsAvailable = true
  //         this.isLoadingLyrics = false
  //         this.isLyricsViewed = false
  //         this.isLyricsAvailable = true
  //         queueMicrotask(() => {
  //           this.lyricsLoaded.emit(true);
  //         });

  //         // this.openModal()
  //       },
  //       error: (err) => {
  //         console.error('Error: ', err)
  //         this.isLoadingLyrics = false
  //         this.isLyricsAvailable = false
  //         this.lyricsLoaded.emit(false)
  //       }
  //     });
  // }  
  loadLyrics(): void {
  if (!this.artist || !this.track) return;

  this.isLoadingLyrics = true;
  this.isLyricsAvailable = false;
  this.isLyricsViewed = false;
  this.lyrics = '';

  /* Codifica los parámetros para enviarlos de forma segura y elimina (Live), (Acoustic), etc. */
  const artist = encodeURIComponent(this.artist);
  const track = encodeURIComponent(
    this.track.replace(/\(.*?\)/g, '').trim()
  );

  this.gameService.getTrackLyrics(artist, track)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (res) => {

        this.isLoadingLyrics = false;
        this.isLyricsViewed = false;

        /* No se encontró la letra */
        if (!res) {
          this.lyrics = 'Letra no disponible';
          this.isLyricsAvailable = false;

          queueMicrotask(() => {
            this.lyricsLoaded.emit(false);
          });

          return;
        }

        /* Conserva únicamente las primeras 8 líneas con contenido */
        this.lyrics = res.plainLyrics
          .split(/\r?\n/)
          .filter(line => line.trim() !== '')
          .slice(0, 8)
          .join('\n');

        this.isLyricsAvailable = true;

        queueMicrotask(() => {
          this.lyricsLoaded.emit(true);
        });
      },

      error: (err) => {
        console.error('Error:', err);

        this.isLoadingLyrics = false;
        this.isLyricsAvailable = false;
        this.lyrics = 'Letra no disponible';

        queueMicrotask(() => {
          this.lyricsLoaded.emit(false);
        });
      }
    });
}

  /* Verifica si la letra de la pregunta actual ya fue vista o no */
  get hasViewedLyrics(): boolean {
    return this.gameService.hasViewedLyrics(this.index)
  }

  /* Para mostrar la letra de la canción actual en el Modal, y cambia el estado a visualizada */  
  openModal(): void {
    /* Impide abrir el modal mientras carga la letra, si no está disponible o si el jugador ya utilizó esta pista */
    if (this.isLoadingLyrics || !this.isLyricsAvailable || this.hasViewedLyrics) return

    this.gameService.markLyricsAsViewed(this.index)

    this.modalService.showModal({
      icon: '⚠️',
      lyrics: `${this.lyrics}`,
      confirmText: 'Cerrar',
      onConfirm: () => {}
    });
  }
}