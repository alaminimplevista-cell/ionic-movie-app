import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { httpEndPoints } from '../httpService/endpoints';
import { MovieDetailsModel, MoviesResponseModel } from '../models/movie';
import { getApi } from './api';

const API_KEY: string = environment.moviedbApiKey;

@Injectable({
    providedIn: 'root',
})
export class Movie {
    private http = inject(HttpClient)
    constructor() { }

    getTopRatedMovies(page = 1): Observable<MoviesResponseModel> {
        const endPoint = httpEndPoints.getTopRatedMoviesEndpoint;
        const query = `?language=en-US&page=${page}&api_key=${API_KEY}`;
        return getApi<MoviesResponseModel>(this.http, endPoint, query);
    }

    getMovieDetails(movieId: string): Observable<MovieDetailsModel> {
        const endPoint = httpEndPoints.getMovieDetailsEndpoint(movieId);
        const query = `?api_key=${API_KEY}`;
        return getApi<MovieDetailsModel>(this.http, endPoint, query).pipe(delay(1000));
    }
}
