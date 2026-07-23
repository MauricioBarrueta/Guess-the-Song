import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalScoreService } from '../../../../core/services/global-score-service';
import { ScoreResults } from '../../../../core/interfaces/score';
import { CommonModule } from '@angular/common';
import { TrackPreview } from "../../components/track-preview/track-preview";
import { ModalService } from '../../../../shared/modal/service/modal-service';
import { GameService } from '../../services/game-service';
import { Loader } from '../../../../shared/loader/loader';

@Component({
  selector: 'app-score',
  imports: [CommonModule, TrackPreview, Loader],
  templateUrl: './score.html',
})
export class Score implements OnInit {

  isLoading: boolean = true

  score: ScoreResults[] = []

  showingDetails: boolean = false
  activeSlide: number = 0

  mouseEnter: boolean = false

  constructor(private gScoreService: GlobalScoreService, private router: Router, private gGameService: GameService, private modalService: ModalService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {   
    const scoreData = this.gScoreService.getScoreData()
    /* Para evitar que se acceda a la ruta sin antes haber jugado una partida */
    // if (scoreData.length === 0) { //! DESCOMENTAR
    //   this.router.navigate(['main'])
    //   return
    // }

    setTimeout(() => {
      // this.score = scoreData
      this.score = [
  {
    "index": 0,
    "album": "https://cdn-images.dzcdn.net/images/cover/50ce1924b81171a9d17cf6a17f03846d/250x250-000000-80-0-0.jpg",
    "preview": "https://cdnt-preview.dzcdn.net/api/1/1/d/0/f/0/d0f68515dca6604b244398285673956a.mp3?hdnea=exp=1784765395~acl=/api/1/1/d/0/f/0/d0f68515dca6604b244398285673956a.mp3*~data=user_id=0,application_id=42~hmac=3ff23e8924da7527931eaec54dfd7693e1f790d98cbba9bb761e9ba87444dbc5",
    "selectedTrack": "P.S.Y.C.H.O.T.I.C.",
    "correctTrack": "P.S.Y.C.H.O.T.I.C.",
    "result": true
  },
  {
    "index": 1,
    "album": "https://cdn-images.dzcdn.net/images/cover/50ce1924b81171a9d17cf6a17f03846d/250x250-000000-80-0-0.jpg",
    "preview": "https://cdnt-preview.dzcdn.net/api/1/1/3/c/7/0/3c72e27a983f316667bde729db9bf037.mp3?hdnea=exp=1784765395~acl=/api/1/1/3/c/7/0/3c72e27a983f316667bde729db9bf037.mp3*~data=user_id=0,application_id=42~hmac=c8f2c4e151d3729e51bdeecd781a1aafa98795adcbcec4b506a8373c49c37bdf",
    "selectedTrack": "Queen of the Murder Scene",
    "correctTrack": "Queen of the Murder Scene",
    "result": true
  },
  {
    "index": 2,
    "album": "https://cdn-images.dzcdn.net/images/cover/1425b36aedd7f38eb9cb80459b473c3a/250x250-000000-80-0-0.jpg",
    "preview": "https://cdnt-preview.dzcdn.net/api/1/1/6/8/6/0/6868164c0b6640234d05f9622d84976d.mp3?hdnea=exp=1784765395~acl=/api/1/1/6/8/6/0/6868164c0b6640234d05f9622d84976d.mp3*~data=user_id=0,application_id=42~hmac=e76ce2831ab8d97a851b4b9b0e1998bce80e43bd4671d1005c6cb208bb3c8ff0",
    "selectedTrack": "Ego",
    "correctTrack": "Ego",
    "result": true
  },
  {
    "index": 3,
    "album": "https://cdn-images.dzcdn.net/images/cover/144fc90a7a93c5c82ad54bfb503dda68/250x250-000000-80-0-0.jpg",
    "preview": "https://cdnt-preview.dzcdn.net/api/1/1/2/1/c/0/21c6561d016efa5f6d3732fbcbc8c816.mp3?hdnea=exp=1784765395~acl=/api/1/1/2/1/c/0/21c6561d016efa5f6d3732fbcbc8c816.mp3*~data=user_id=0,application_id=42~hmac=e0afea5fb2549683715fdffdea04c49174444bf849b86d53bcfe1c36bcfcadd4",
    "selectedTrack": "MONEY",
    "correctTrack": "MONEY",
    "result": true
  },
  {
    "index": 4,
    "album": "https://cdn-images.dzcdn.net/images/cover/144fc90a7a93c5c82ad54bfb503dda68/250x250-000000-80-0-0.jpg",
    "preview": "https://cdnt-preview.dzcdn.net/api/1/1/d/2/e/0/d2e52c600c4f835ebacd66838c48b23d.mp3?hdnea=exp=1784765395~acl=/api/1/1/d/2/e/0/d2e52c600c4f835ebacd66838c48b23d.mp3*~data=user_id=0,application_id=42~hmac=92a2da6ee21ca724cb9742c5961b9b69296fbd9e75392274bbd5e1a8f3ade9e0",
    "selectedTrack": "The Warning",
    "correctTrack": "MARTIRIO",
    "result": false
  }
]
      this.isLoading = false
      
      /* Fuerza la detección de cambios para actualizar la vista tras el setTimeout */
      this.cdr.detectChanges()
    }, 4000); 
  }

  /* Se obtiene el numero total de respuestas correctas e incorrectas */
  get totalCorrectAnswers(): number {    
    return this.score.filter(q => q.result).length
  }

  get totalWrongAnswers(): number {
    return this.score.filter(q => !q.result).length
  }

  /* Navegación entre pestañas (índices) */
  nextSlide() {
    this.activeSlide < this.score.length - 1 ? this.activeSlide++ : this.activeSlide = 0  
  }
  prevSlide() {
    this.activeSlide > 0 ? this.activeSlide-- : this.activeSlide = this.score.length - 1  
  }  

  /* Limpia cualquiér rastro de la partida antes de volver al menú */
  exitGameAndReset() {
    this.gScoreService.clearScoreData()
    this.gGameService.clearLyricsCache()
    this.gGameService.clearViewedLyrics()

    this.router.navigate(['main'], { replaceUrl: true })
  }

  openModal(): void {
    this.modalService.showModal({
      title: '¿Volver al menú principal?',
      content: 'Podrás configurar una nueva partida',
      type: 'confirm',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => this.exitGameAndReset(),
      onCancel: () => {}
    });
  }
}