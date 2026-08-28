import { ChangeDetectorRef, Component } from '@angular/core';
import { MainService } from '../../services/main-service';
import { catchError, map, Observable, of } from 'rxjs';
import { GenreItem } from '../../interfaces/genre';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityForm } from '../../components/quantity-form/quantity-form';
import { Loader } from '../../../../shared/loader/loader';
import { ModalHandlerService } from '../../../../shared/modal/service/modal-handler-service';

@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule, QuantityForm, Loader],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  
  constructor(private mainService: MainService, private modalHandler: ModalHandlerService, private cdr: ChangeDetectorRef) {}

  difficulty: 'easy' | 'hard' | null = null
  search!: string;
  genres$!: Observable<GenreItem[]>
  genre: string | null = null
  quantity: number = 10

  mouseEnter: boolean = false

  selectDifficulty(difficulty: 'easy' | 'hard'): void {
    this.difficulty = difficulty

    if (difficulty === 'hard') {
      /* Notifica que comenzó la carga de la lista de géneros */
      this.mainService.notifyListLoading()
      
      this.getAllGenres()
    }
  }
  
  /* Se obtiene la lista de todos los géneros */    
  getAllGenres() {
    this.genres$ = this.mainService.getAllGenres()
      .pipe(
        map((res) => {
          /* Obtiene todos los géneros a excepción del id '0' ('All') */
          const genres = res.data.filter((g) => g.id !== 0)
          this.genre = genres[0]?.name.toLowerCase() ?? ''

          /* Notifica que la lista terminó de cargar y el Loader dejó de mostrarse */
          this.mainService.notifyListLoaded()

          return genres
        }),
        catchError((error) => {
          this.modalHandler.resultModal(
            'fa-solid fa-circle-xmark',
            'Error al obtener las opciones', 'No fue posible obtener los géneros. Inténtalo de nuevo',
            'error', () => { this.difficulty = null }
          )
          console.error('ERROR:', error)

          /* Devuelve un arreglo vacío para finalizar el flujo después del error */
          return of([])
        })
      )
  }

  /* Inicia la partida con la configuración ingresada */
  startGame(): void {
    const param = this.difficulty === 'easy' ? this.search?.trim() : this.genre

    if (!param || !this.difficulty) return

    this.mainService.saveGameConfig(param, this.difficulty, this.quantity)
  }

  showModal(): void {
    this.modalHandler.confirmModal(
      'fa-solid fa-circle-question', 
      '¿Seguro que deseas cambiar la dificultad?', 'Se perderá la configuración actual de la partida', 
      () => { this.difficulty = null; this.quantity = 10 }
    )     
  }  
}