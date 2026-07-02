import { Injectable } from '@angular/core';
import { catchError, from, map, mergeMap, Observable, of, tap, toArray } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Search, SearchItem } from '../interfaces/search';
import { Playlist } from '../interfaces/playlist';
import { environment } from '../../../../environments/environment.development';
import { Lyrics } from '../interfaces/lyrics';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly api = '/deezer';

  private lyricsCache = new Map<string, Lyrics | null>();


    private viewedLyrics = new Set<number>();


  constructor(private http: HttpClient) {}

  /* Obtiene la lista de resultados que coincidan con el valor del parámetro */
  searchByParam(param: string): Observable<Search> {
    return this.http.get<Search>(`${this.api}/search?q=${param}&limit=100`);
  }

  //! FALTA AGREGAR &limit
  /* Se obtiene la lista de playlist de acuerdo al valor del parámetro del género */
  searchByGenre(genre: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.api}/search/playlist?q=${genre}`);
  } 

  /* Se obtiene la letra de la canción y se almacena en caché para evitar solicitudes repetidas */
  // getTrackLyrics(artist?: string, track?: string): Observable<Lyrics | null> {
  //   const key = `${artist?.toLowerCase().trim()}-${track?.toLowerCase().trim()}` /* Clave única por canción */

  //   /* Verifica si la letra ya existe en caché y la devuelve */
  //   const cachedLyrics = this.lyricsCache.get(key)
  //   if (cachedLyrics !== undefined) {
  //     return of(cachedLyrics);
  //   }

  //   return this.http.get<Lyrics>(`${environment.lrclibAPI}/get?artist_name=${artist}&track_name=${track}`)
  //     .pipe(        
  //       tap((lyrics) => {
  //         /* Se almacena la letra en caché para futuras consultas */
  //         this.lyricsCache.set(key, lyrics)
  //       }),
  //       catchError(() => {
  //         this.lyricsCache.set(key, null);
  //          return of(null);
  //       }),
  //     );
  // }
  getTrackLyrics(artist?: string, track?: string): Observable<Lyrics | null> {
    const key = `${artist?.toLowerCase().trim()}-${track?.toLowerCase().trim()}` /* Clave única por canción */
    
    /* Verifica si la letra ya existe en caché y la devuelve */
    const cachedLyrics = this.lyricsCache.get(key)
    if (cachedLyrics !== undefined) return of(cachedLyrics)

      return this.http.get<Lyrics>(`${environment.lrclibAPI}/get?artist_name=${artist}&track_name=${track}`)
        .pipe(
          tap((lyrics) => {
            /* Se almacena la letra en caché para futuras consultas */
            this.lyricsCache.set(key, lyrics)
          }),
          catchError(() => {
            /* Si no existe la letra, la almacena como null para evitar que vuelva a hacer la consulta cuando se detecte un error */
            this.lyricsCache.set(key, null)
            return of(null)
          })
        );
  }



  preloadTracksLyrics(tracks: SearchItem[]): Observable<void> {
    return from(tracks)
      .pipe(
        /* Procesa máximo 5 canciones al mismo tiempo */
        mergeMap((track) => this.getTrackLyrics(track.artist.name,track.title)
          .pipe(
            /* Si una canción no tiene letra disponible, la omite y continúa con las demás */
            catchError(() => of(null))
          ), 5
        ),
        /* Espera a que todas finalicen */
        toArray(),
        /* El componente no necesita el arreglo de respuestas */
        map(() => void 0)
      );
  }



  /* Borra el caché */
  clearLyricsCache(): void {
    this.lyricsCache.clear()
    alert('Borrado') //! ESTO NO VA ***************************************************************************
  }

  /* Marca la letra de una pregunta como ya visualizada */
  markLyricsAsViewed(index: number): void {
    this.viewedLyrics.add(index);
  }

  /* Indica si la letra de una pregunta ya fue visualizada */
  hasViewedLyrics(index: number): boolean {
    return this.viewedLyrics.has(index);
  }

  /* Reinicia el registro de letras visualizadas */
  clearViewedLyrics(): void {
    this.viewedLyrics.clear();
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