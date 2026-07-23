import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Genre } from '../interfaces/genre';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  private readonly api = '/deezer';

  constructor( private http: HttpClient, private router: Router) {}  

  /* Lista de todos los géneros */  
  getAllGenres(): Observable<Genre> {
    return this.http.get<Genre>(`${this.api}/genre`);
  }

  /* Se guarda el valor como parámetro, dependiendo la dificultad que se haya seleccionado */
  saveGameConfig(param: string, difficulty: 'easy' | 'hard', quantity: number) {
    /* Se limpian las claves antes de asignar un nuevo valor */
    localStorage.removeItem('search')
    localStorage.removeItem('genre')
    localStorage.removeItem('quantity')

    const key = difficulty === 'easy' ? 'search' : 'genre'
    localStorage.setItem(key, param)    
    localStorage.setItem('quantity', quantity.toString())

    this.router.navigate(['quiz'], { replaceUrl: true })
  }
}