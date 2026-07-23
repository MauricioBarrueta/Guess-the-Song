import { Component, OnInit } from '@angular/core';
import { MainService } from '../../services/main-service';
import {  map, Observable } from 'rxjs';
import { GenreItem } from '../../interfaces/genre';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityForm } from '../../components/quantity-form/quantity-form';
import { ModalService } from '../../../../shared/modal/service/modal-service';
import { Loader } from '../../../../shared/loader/loader';

@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule, QuantityForm, Loader],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  
  constructor(private mainService: MainService, private modalService: ModalService) {}

  difficulty: 'easy' | 'hard' | null = null
  search!: string;
  genres$!: Observable<GenreItem[]>
  genre: string | null = null
  quantity: number = 5

  mouseEnter: boolean = false

  ngOnInit(): void {
    this.getAllGenres()
  }
  
  /* Se obtiene la lista de todos los géneros */  
  getAllGenres() {
    this.genres$ = this.mainService.getAllGenres()
      .pipe(
        map((res) => {
          /* Obtiene todos los géneros a excepción del id '0'('All'), toma el nuevo primer elemento, regresa '' si devuelve null o undefined */
          const genres = res.data.filter((g) => g.id !== 0)
          this.genre = genres[0]?.name.toLowerCase() ?? ''
          return genres
        })
      );
  }

  /* Inicia la partida con la configuración ingresada */
  startGame(): void {
    const value = this.difficulty === 'easy' ? this.search?.trim() : this.genre

    if (!value || !this.difficulty) return

    this.mainService.saveGameConfig(value, this.difficulty, this.quantity)
  }

  openModal(): void {
    this.modalService.showModal({
      title: '¿Seguro que deseas cambiar la dificultad?',
      content: 'Se perderá la configuración actual de la partida',
      type: 'confirm',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => this.difficulty = null,
      onCancel: () => {}
    });
  }
}
