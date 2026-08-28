import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Search, SearchItem } from '../interfaces/search';
import { environment } from '../../../../environments/environment.development';
import { Lyrics } from '../interfaces/lyrics';
import { Artist } from '../interfaces/artist';
 
@Injectable({
  providedIn: 'root',
})
export class GameService {

  private readonly api = '/deezer' 

  private lyricsCache = new Map<string, Lyrics | null>() /* Guarda en caché las letras consultadas para reutilizarlas durante la partida */
  
  private viewedLyrics = new Set<number>() /* Registra las preguntas cuya letra ya fue visualizada 1 vez */

  /* Observables que notifican la carga y salida de Quiz */
  private quizLoadedSubject = new Subject<void>()
  quizLoaded$ = this.quizLoadedSubject.asObservable()

  private exitedQuizSubject = new Subject<void>()
  exitedQuiz$ = this.exitedQuizSubject.asObservable()

  constructor(private http: HttpClient) {}

  /* Notifica que Quiz terminó de cargar los resultados */  
  notifyQuizLoaded(): void {
    this.quizLoadedSubject.next()
  }

  /* Notifica que se va a salir de Quiz */
  notifyQuizExited(): void {
    this.exitedQuizSubject.next()
  }

  /* Obtiene las canciones de un artista */  
  getTracksByArtist(param: string): Observable<Search | null> {
    const formattedParam = this.formatArtistParam(param) 

    return this.http.get<Artist>(`${this.api}/artist/${formattedParam}`)
      .pipe(
        switchMap((res) => {
          const artistId = res.id

          /* Devuelve null cuando no se encuentra el ID del artista */
          if (!artistId) {
              return of(null)
          }

          return this.http.get<Search>(`${this.api}/artist/${artistId}/top`)
            .pipe(
              switchMap((data) => {
                const total = data.total

                /* Obtiene todas las canciones disponibles del artista usando el total de resultados */
                return this.http.get<Search>(`${this.api}/artist/${artistId}/top?limit=${total}`)
              })
            )
        })
      )
  }  

  /* Obtiene canciones del género seleccionado y prepara una selección aleatoria de artistas para la partida */
  getTracksByGenre(genre: string): Observable<Search | null> {
    return this.http.get<Search>(`${this.api}/search?q=${genre}&limit=250`)
      .pipe(
        switchMap((res) => {
          
          /* Obtiene IDs de los artistas, elimina duplicados y los convierte nuevamente en arreglo con ... */
          const artistIds = [
            ...new Set(
              res.data
                .map((track) => track.artist?.id)
                .filter((id): id is number => !!id))]

          /* Devuelve un resultado vacío si no se encontraron artistas */
          if (!artistIds.length) {
            return of(null)
          }

          /* Mezcla los artistas y limita la selección a 25 */
          const shuffledArtists = this.shuffle([...artistIds])
          const selectedArtists = shuffledArtists.slice(0, 25) 

          /* Obtiene las canciones de todos los artistas seleccionados en paralelo */
          return forkJoin(selectedArtists.map((artistId) => this.getTracksByArtistId(artistId)))
            .pipe(
              map((results) => {
                /* Combina las canciones obtenidas en un solo arreglo y devuelve las canciones obtenidas junto con el total */
                const tracks = results.flatMap((res) => res.data)
                
                return { data: tracks, total: tracks.length }
              })
            )
        })
      )
  }

  /* Obtiene todas las canciones populares de un artista */
  getTracksByArtistId(artistId: number): Observable<Search> {
    return this.http.get<Search>(`${this.api}/artist/${artistId}/top`)
      .pipe(
        switchMap((res) => {
          const total = res.total

          /* Obtiene todas las canciones disponibles del artista usando el total de resultados */
          return this.http.get<Search>(`${this.api}/artist/${artistId}/top?limit=${total}`)
        })
      )
  }

  /* Toma el parámetro, elimina los espacios al inicio y final, y reemplaza los espacios internos y '/' por '-' */
  private formatArtistParam(param: string): string {    
    return param.trim().replace(/\s+/g, '-').replace(/\//g, '-')
  }

  /* Limpia el título de la canción, eliminando cualquier texto dentro de () - [] y espacios sobrantes */
  cleanTrackTitle(title: string): string {
    return title.replace(/\s*\([^)]*\)/g, '').replace(/\s*\[[^\]]*]/g, '').trim()
  }

  /* Se obtiene la letra de la canción y se almacena en caché para evitar solicitudes repetidas */
  getTrackLyrics(artist?: string, track?: string): Observable<Lyrics | null> {
    const key = `${artist?.toLowerCase().trim()}-${track?.toLowerCase().trim()}` /* Clave única por canción */

    /* Verifica si la letra ya existe en caché */
    if (this.lyricsCache.has(key)) { return of(this.lyricsCache.get(key)!) }

    return this.http.get<Lyrics>(`${environment.lrclibAPI}/get?artist_name=${artist}&track_name=${track}`)
      .pipe(
        tap((lyrics) => {
          /* Almacena la letra en caché */
          this.lyricsCache.set(key, lyrics)
        }),
        catchError(() => {
          /* Si no se encuentra la letra, guarda null para evitar otra consulta */
          this.lyricsCache.set(key, null)
          return of(null)
        })
      )
  }

  /* Precarga la letra de la siguiente canción en segundo plano */
  preloadTrackLyrics(track: SearchItem): Observable<Lyrics | null> {
    const artist = encodeURIComponent(track.artist.name)
    const title = encodeURIComponent(this.cleanTrackTitle(track.title))     

    return this.getTrackLyrics(artist, title)
  }

  /* Gestionan el estado de las letras durante la partida (caché y pistas utilizadas) */
  clearLyricsCache(): void {
    this.lyricsCache.clear()
  }

  markLyricsAsViewed(index: number): void {
    this.viewedLyrics.add(index)
  }

  hasViewedLyrics(index: number): boolean {
    return this.viewedLyrics.has(index)
  }

  clearViewedLyrics(): void {
    this.viewedLyrics.clear()
  }  

  /* Restablece el estado de la partida */
  exitAndResetGame(): void {
    this.clearLyricsCache()
    this.clearViewedLyrics()

    localStorage.removeItem('search')
    localStorage.removeItem('genre')
    localStorage.removeItem('quantity')
  }

  /* Algoritmo Fisher-Yates, usado para mezclar un array de manera uniforme */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      /* Intercambia el elemento actual con el elemento aleatorio */
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }
}