import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Search, SearchItem } from '../interfaces/search';
import { environment } from '../../../../environments/environment.development';
import { Lyrics } from '../interfaces/lyrics';

@Injectable({
  providedIn: 'root',
})
export class GameService {

  private readonly api = '/deezer' 

  private lyricsCache = new Map<string, Lyrics | null>() /* Guarda en caché las letras consultadas para reutilizarlas durante la partida */
  
  private viewedLyrics = new Set<number>() /* Registra las preguntas cuya letra ya fue visualizada 1 vez */

  constructor(private http: HttpClient) {}

  /* Obtiene la lista de resultados que coincidan con el valor del parámetro */
  searchByParam(param: string): Observable<Search> {
    return this.http.get<Search>(`${this.api}/search?q=${param}&limit=150`)
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
          /* Si no existe la letra, guarda null para no volver a consultarla */
          this.lyricsCache.set(key, null)
          return of(null)
        })
      );
  }

  /* Precarga la letra de la canción */
  preloadTrackLyrics(track: SearchItem): Observable<Lyrics | null> {
    const artist = encodeURIComponent(track.artist.name)
    const title = encodeURIComponent(track.title.replace(/\(.*?\)/g, '').trim()) /* Elimina el contenido entre paréntesis, (Live), (Acoustic), etc */

    return this.getTrackLyrics(artist, title)
  }

  /* Borra el caché */
  clearLyricsCache(): void {
    this.lyricsCache.clear()
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