import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { MovieResponse,MovieResult } from './interfaces';
const BASE_URL:string = 'https://api.themoviedb.org/3';
const API_KEY:string = environment.moviedbApiKey;
@Injectable({
  providedIn: 'root',
})
export class Movie {
  private http = inject(HttpClient)
  constructor() {
    
  }
  getTopRatedMovies(page = 1):Observable<MovieResponse>{
    return this.http.get<MovieResponse>(`${BASE_URL}/movie/top_rated?language=en-US&page=1&api_key=${API_KEY}`).pipe(delay(5000))
  }

  getMovideDetails(movieId:string):Observable<MovieResult>{
    return this.http.get<MovieResult>(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
  }
}
