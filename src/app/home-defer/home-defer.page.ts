import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonList, IonItem, IonSkeletonText, IonAvatar, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent, IonSpinner } from '@ionic/angular/standalone';

import { catchError, finalize } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Movie } from '../httpService/movie.service';
import { environment } from 'src/environments/environment';
import { MovieDetailsModel, MoviesResponseModel } from '../models/movie';

@Component({
  selector: 'app-home-defer',
  templateUrl: './home-defer.page.html',
  styleUrls: ['./home-defer.page.scss'],
  standalone: true,
  imports: [IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonSkeletonText,
    IonAvatar,
    IonAlert,
    IonLabel,
    DatePipe,
    RouterModule,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent, IonSpinner]
})
export class HomeDeferPage {
  private movieService = inject(Movie);
  public isLoading: boolean = false;
  public imageBaseUrl: string = environment.image_base_url;
  public movies: MovieDetailsModel[] = [];
  public error: string = "";
  private currentPage: number = 1;
  public dummyArray = new Array(10);
  constructor() {
    this.loadTopRatedMovies();
  }
  loadTopRatedMovies(event?: InfiniteScrollCustomEvent) {
    if (!event) {
      this.isLoading = true;
    }
    this.movieService.getTopRatedMovies().pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      catchError((err: any) => {
        this.error =
          err?.error?.status_message ||
          'An error occurred while fetching movies.';
        return [];
      })
    ).subscribe({
      next: (res) => {
        this.movies.push(...res.results);
        if (event) {
          event.target.disabled = this.currentPage === res.total_pages;
        }
      }
    });
  }
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadTopRatedMovies(event);
  }
}
