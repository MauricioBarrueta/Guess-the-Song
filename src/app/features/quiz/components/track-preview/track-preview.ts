import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-track-preview',
  imports: [],
  templateUrl: './track-preview.html',
  styleUrl: './track-preview.scss',
})
export class TrackPreview implements OnChanges {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>
  isPlaying: boolean = false

  @Input({ required: true }) preview!: string
  @Input({ required: true }) albumCover!: string

  ngOnChanges(changes: SimpleChanges): void {
    /* Evita que el preview anterior continúe reproduciéndose al cambiar de canción */
    if (changes['preview'] && !changes['preview'].firstChange) {
      this.resetAudio()
    }     
  }  

  /* Controla la reproducción del preview y actualiza el estado del botón */
  togglePlay() {
    const audio = this.audioPlayer.nativeElement

    //! NO SÉ SI AQUÍ FALTE ALGUNA VALIDACIÓN, SOBRE SI EXISTE EL AUDIO O NO, FALTA REVISAR ESO (ver error en game.html)
    if (audio.paused) {
      audio.play()
      this.isPlaying = true
    } else {
      audio.pause()
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
    audio.currentTime = 0
    this.isPlaying = false
  }
}