import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Genre } from '../interfaces/genre';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MainService {

  constructor( private http: HttpClient, private router: Router) {}  

  private readonly api = '/deezer'

  /* Observables que notifican el inicio y final de la carga de la lista de géneros */
  private listLoadedSubject = new Subject<void>()
  listLoaded$ = this.listLoadedSubject.asObservable()

  private listLoadingSubject = new Subject<void>()
  listLoading$ = this.listLoadingSubject.asObservable()
  
  /* Notifica que la lista de géneros terminó de cargar */
  notifyListLoaded(): void {
    this.listLoadedSubject.next()
  }

  /* Notifica que comenzó la carga de la lista de géneros */
  notifyListLoading(): void {
    this.listLoadingSubject.next()
  }

  /* Lista de todos los géneros */  
  getAllGenres(): Observable<Genre> {
    return this.http.get<Genre>(`${this.api}/genre`);
  }

  /* Se guarda el valor como parámetro, dependiendo la dificultad que se haya seleccionado */  
  saveGameConfig(param: string, difficulty: 'easy' | 'hard', quantity: number) {
    /* Se limpian las claves antes de asignar un nuevo valor */
    localStorage.removeItem('search')
    localStorage.removeItem('genre')
    localStorage.removeItem('difficulty')
    localStorage.removeItem('quantity')

    const key = difficulty === 'easy' ? 'search' : 'genre'

    localStorage.setItem(key, param)
    localStorage.setItem('difficulty', difficulty)
    localStorage.setItem('quantity', quantity.toString())

    this.router.navigate(['quiz'], { replaceUrl: true })
  }
}