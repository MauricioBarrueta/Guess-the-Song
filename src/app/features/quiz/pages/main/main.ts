import { Component, OnInit } from '@angular/core';
import { GenreService } from '../../services/genre-service';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Genre, GenreItem } from '../../interfaces/genre';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  constructor(private genreService: GenreService) {}

  search!: string;
  genres$!: Observable<GenreItem[]>
  genre: string | null = null;

  difficulty: 'easy' | 'hard' = 'easy';

  quantity: number = 1;

  ngOnInit(): void {
    // this.getAllGenres() //! DESCOMENTAR AL TERMINAR PRUEBAS
  }

  /* Controla la cantidad ingresada, impidiendo que sea mayor al límite */
  updateQty(value: number) {
    this.quantity = Math.min(25, Math.max(1, value));
  }

  /* Verifica si se presionaron las teclas (+ -) o (↑ ↓) para incrementar/decrementar la cantidad sin presionar los botones */
  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case '+':
      case 'ArrowUp':
        event.preventDefault()
        this.updateQty(this.quantity + 1)
        break

      case '-':
      case 'ArrowDown':
        event.preventDefault()
        this.updateQty(this.quantity - 1)
        break
    }
  }

  /* Se obtiene la lista de todos los géneros */
  getAllGenres() {
    this.genres$ = this.genreService.getAllGenres().pipe(map((res) => res.data));
  }

  /* Manda el parámetro de acuerdo a la dificultad que se seleccionó */
  sendParams(): void {
    const value = this.difficulty === 'easy' ? this.search?.trim() : this.genre;
    if (!value) return;
    this.genreService.sendParamToGame(value, this.difficulty, this.quantity);
  }
}
