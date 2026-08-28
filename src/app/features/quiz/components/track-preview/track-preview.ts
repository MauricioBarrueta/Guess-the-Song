import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlbumCover } from './album-cover/album-cover';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-preview',
  templateUrl: './track-preview.html',
  imports: [ CommonModule, AlbumCover ],
  styleUrl: './track-preview.scss'
})
export class TrackPreview implements OnChanges {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>
  isPlaying: boolean = false

  @Input({ required: true }) preview!: string
  @Input({ required: true }) albumCover!: string
  @Input() instrText = true /* Cambia el texto dependiendo en dónde sea llamado el componente */

  @Output() previewPlayed = new EventEmitter<string>() /* Emite el preview cuando comienza su reproducción */
  @Output() previewError = new EventEmitter<string>() /* Emite el preview cuando presenta un error al intentar reproducirlo */
  @Input() hasPreviewError = false /* Recibe el estado que determina si el botón debe deshabilitarse */

  mouseEnter: boolean = false

  constructor(private cdr: ChangeDetectorRef) {}

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

    /* Evita reproducir el audio si el preview no está disponible */
    if (!this.hasPreview || !this.preview) return

    const audio = this.audioPlayer.nativeElement

    /* Captura errores síncronos durante la carga o reproducción del preview */    
    try {
      if(audio.paused) {
        audio.src = this.preview 
        audio.load()

        /* Detecta errores al cargar el recurso de audio */        
        audio.onerror = () => {
          /* Marca y registra el preview como no disponible para mantener el botón deshabilitado aunque cambie de canción */
          this.hasPreviewError = true
          this.previewError.emit(this.preview)

          this.isPlaying = false
        }

        audio.play()
          .then(() => {
            this.isPlaying = true
            this.cdr.detectChanges()

            /* Emite el evento únicamente cuando la Promise se resuelve correctamente */
            this.previewPlayed.emit(this.preview)
          })
          /* Captura errores durante la reproducción */
          .catch((err) => {

            /* Detecta si el navegador canceló la reproducción y detiene el audio */
            if (err.name === 'AbortError') {
              this.isPlaying = false
              return
            }
            console.error('Error reproduciendo preview:', err)
            this.isPlaying = false
          })

      } else {
        audio.pause()
        this.isPlaying = false
      }
    } catch (err) {
      console.error('Error reproduciendo preview:', err)
  
      this.isPlaying = false    
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
    audio.src = ''
    this.isPlaying = false
  }
}