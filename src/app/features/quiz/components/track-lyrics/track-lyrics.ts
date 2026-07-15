import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { GameService } from '../../services/game-service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../../shared/modal/service/modal-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-lyrics',
  imports: [CommonModule],
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

  mouseEnter: boolean = false

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
  loadLyrics(): void {
    if (!this.artist || !this.track) return

    this.isLoadingLyrics = true
    this.isLyricsAvailable = false
    this.isLyricsViewed = false
    this.lyrics = null

    /* Codifica los parámetros para enviarlos de forma segura, además de borrar el contenido entre paréntesis */
    const artist = encodeURIComponent(this.artist)
    const track = encodeURIComponent(this.track.replace(/\(.*?\)/g, '').trim())
    
    this.gameService.getTrackLyrics(artist, track)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.isLoadingLyrics = false
          this.isLyricsViewed = false

          /* La canción no tiene letra disponible */
          if (!res) {
            this.lyrics = null
            this.isLyricsAvailable = false
            /* Evita conflictos con la detección de cambios al notificar que no hay letra disponible */
            queueMicrotask(() => { this.lyricsLoaded.emit(false) })
            return
          }
          
          /* Conserva el formato original de la letra y limita la pista a las primeras 8 líneas con contenido */
          const lines = res.plainLyrics
            .replace(/\n{3,}/g, '\n\n').split(/\r?\n/) /* Normaliza los saltos de línea y divide la letra en líneas individuales */
          let count = 0
          const result: string[] = []

          for (const line of lines) {
            result.push(line)

            /* Cuenta únicamente las líneas con contenido y detiene el recorrido al alcanzar el límite */
            if (line.trim() !== '') { count++ }

            if (count === 6) { break }
          }
          this.lyrics = result.join('\n') + '\n\n…'
          
          this.isLyricsAvailable = true
          queueMicrotask(() => { this.lyricsLoaded.emit(true) })
        },
        error: (err) => {
          console.error('Error:', err)

          this.isLoadingLyrics = false
          this.isLyricsAvailable = false
          this.lyrics = 'Letra no disponible'
          queueMicrotask(() => { this.lyricsLoaded.emit(false) })
        }
      });
  }

  /* Devuelve el texto e ícono dependiendo el estado de la letra */
  get lyricsMessage() {
    if (this.isLoadingLyrics) {
      return { icon: 'fa-magnifying-glass', text: 'Buscando fragmento de la letra...' }
    }
    
    if (!this.isLyricsAvailable) {
      return { icon: 'fa-ban', text: 'Letra no disponible' }
    }

    if (!this.hasViewedLyrics) {
      return { icon: 'fa-circle-question', text: '¿Necesitas una pista? Puedes ver parte de la letra una vez:' }
    }

    return { icon: 'fa-circle-info', text: 'Pista utilizada' }
  }

  /* Verifica si la letra de la pregunta actual ya fue vista o no */
  get hasViewedLyrics(): boolean {
    return this.gameService.hasViewedLyrics(this.index)
  }
  
  /* Muestra la letra de la canción actual en un modal y marca la pista como utilizada */
  openModal(): void {
    /* Impide abrir el modal mientras carga, si no existe letra, si ya fue vista o si por alguna razón lyrics está vacía */
    if (this.isLoadingLyrics || !this.isLyricsAvailable || this.hasViewedLyrics || !this.lyrics) { return }

    /* Marca la pista como utilizada */
    this.gameService.markLyricsAsViewed(this.index)

    this.modalService.showModal({
      title: 'Pista',
      content: this.lyrics,
      type: 'info',
      confirmText: 'Continuar',
      onConfirm: () => {},
    });
  }
}

/**
 * ! AGREGAR UN TIMER CUANDO SE ABRE EL MODAL, DESPUÉS DE x SEGUNDOS SE CIERRA AUTOMÁTICAMENTE
 */