import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AlbumCover } from './album-cover/album-cover';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-preview',
  templateUrl: './track-preview.html',
  imports: [ CommonModule, AlbumCover ]
})
export class TrackPreview implements OnChanges {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>
  isPlaying: boolean = false

  @Input({ required: true }) preview!: string
  @Input({ required: true }) albumCover!: string
  @Input() instrText = true /* Cambia el texto dependiendo en dónde sea llamado el componente */

  ngOnChanges(changes: SimpleChanges): void {
    /* Evita que el preview anterior continúe reproduciéndose al cambiar de canción */
    if (changes['preview'] && !changes['preview'].firstChange) {
      this.resetAudio()
    }     
  }  

  /* Valida si existe un preview o no */
  get hasPreview(): boolean {
    return !!this.preview && this.preview.trim().length > 0
  }

  /* Controla la reproducción del preview y actualiza el estado del botón */  
  togglePlay(): void {

    /* Evita reproducir el audio si el preview no esta disponible */
    if (!this.hasPreview) return

    const audio = this.audioPlayer.nativeElement
    if (!audio || !this.preview) return

    /* Captura errores durante la carga o reproducción del preview */
    try {
      if (audio.paused) {
        /* Carga el nuevo preview antes de iniciar la reproducción */
        audio.src = this.preview 
        audio.load()
        audio.play()
        this.isPlaying = true
      } else {
        audio.pause()
        this.isPlaying = false
      }
    } catch (err) {
      console.error('Error reproduciendo preview:', err)
    }
  }

  /* Reinicia la reproducción y actualiza el estado del botón al finalizar el preview*/
  onPreviewEnded() {
    const audio = this.audioPlayer.nativeElement

    audio.currentTime = 0
    this.isPlaying = false
  }

  /* Detiene y reinicia por completo la reproducción del audio */
  resetAudio() {
    const audio = this.audioPlayer?.nativeElement

    /* Previente cualquier error si el elemento no existe */
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    this.isPlaying = false
  }
}