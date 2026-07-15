import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalScoreService } from '../../../../core/services/global-score-service';
import { ScoreResults } from '../../../../core/interfaces/score';
import { CommonModule } from '@angular/common';
import { TrackPreview } from "../../components/track-preview/track-preview";

@Component({
  selector: 'app-score',
  imports: [CommonModule, TrackPreview],
  templateUrl: './score.html',
  styleUrl: './score.scss',
})
export class Score implements OnInit {

  isLoading: boolean = true

  score: ScoreResults[] = []

  showingDetails: boolean = false
  activeSlide: number = 0

  mouseEnter: boolean = false

  constructor(private gScoreService: GlobalScoreService, private router: Router) {}

  ngOnInit(): void {
    //! DESCOMENTAR TODO ESTO AL FINALIZAR PRUEBAS
    /* Para evitar que se acceda a la ruta sin antes haber jugado una partida */
    // if (this.gScoreService.getScoreData().length === 0) {
    //   this.router.navigate(['main-menu'])
    //   return
    // }
    // this.score = this.gScoreService.getScoreData()

    //! BORRAR TODO ESTO
    this.score = [
      {
        "index": 1,
        "album": "https:\/\/cdn-images.dzcdn.net\/images\/cover\/e2ec7d66e3112c39d1468def954ef055\/250x250-000000-80-0-0.jpg",
        "preview": "https://cdnt-preview.dzcdn.net/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3?hdnea=exp=1783609246~acl=/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3*~data=user_id=0,application_id=42~hmac=6060054f24971c043ffc0ca312615389cf04e2f0b4fb8ae44d2fe93389b754c0",
        "selectedTrack": "Test Song 1",
        "correctTrack": "When I'm Alone",
        "result": false
      },
      {
        "index": 2,
        "album": "https:\/\/cdn-images.dzcdn.net\/images\/cover\/e2ec7d66e3112c39d1468def954ef055\/250x250-000000-80-0-0.jpg",
        "preview": "https://cdnt-preview.dzcdn.net/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3?hdnea=exp=1783609246~acl=/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3*~data=user_id=0,application_id=42~hmac=6060054f24971c043ffc0ca312615389cf04e2f0b4fb8ae44d2fe93389b754c0",
        "selectedTrack": "S!CK",
        "correctTrack": "S!CK",
        "result": true
      },
      {
        "index": 3,
        "album": "https:\/\/cdn-images.dzcdn.net\/images\/cover\/e2ec7d66e3112c39d1468def954ef055\/250x250-000000-80-0-0.jpg",
        "preview": "https://cdnt-preview.dzcdn.net/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3?hdnea=exp=1783609246~acl=/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3*~data=user_id=0,application_id=42~hmac=6060054f24971c043ffc0ca312615389cf04e2f0b4fb8ae44d2fe93389b754c0",
        "selectedTrack": "MORE",
        "correctTrack": "MORE",
        "result": true
      },
      {
        "index": 4,
        "album": "https:\/\/cdn-images.dzcdn.net\/images\/cover\/e2ec7d66e3112c39d1468def954ef055\/250x250-000000-80-0-0.jpg",
        "preview": "https://cdnt-preview.dzcdn.net/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3?hdnea=exp=1783609246~acl=/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3*~data=user_id=0,application_id=42~hmac=6060054f24971c043ffc0ca312615389cf04e2f0b4fb8ae44d2fe93389b754c0",
        "selectedTrack": "Test Song 4",
        "correctTrack": "AMOUR",
        "result": false
      },
      {
        "index": 5,
        "album": "https:\/\/cdn-images.dzcdn.net\/images\/cover\/e2ec7d66e3112c39d1468def954ef055\/250x250-000000-80-0-0.jpg",
        "preview": "https://cdnt-preview.dzcdn.net/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3?hdnea=exp=1783609246~acl=/api/1/1/2/a/1/0/2a198f5b94920eb6ceeb0b316f6263cd.mp3*~data=user_id=0,application_id=42~hmac=6060054f24971c043ffc0ca312615389cf04e2f0b4fb8ae44d2fe93389b754c0",
        "selectedTrack": "Kerosene",
        "correctTrack": "Kerosene",
        "result": true
      },
    ]



    setTimeout(() => {
      this.isLoading = false
    }, 3000);
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

  exitGameAndReset() {
    this.router.navigate(['main-menu']).then(() => {
      // this.gameService.destroyGoogleTranslate() 
      localStorage.removeItem('params')
    })
  }
}
