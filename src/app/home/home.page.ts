import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonList,
  IonItem,
  IonSkeletonText,
  IonAvatar,
  IonAlert,
  IonLabel,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { Movie } from '../services/movie';
import { MovieResult } from '../services/interfaces';
import { catchError, finalize, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
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
    IonInfiniteScrollContent
  ],
})
export class HomePage {
  private movieService = inject(Movie);
  private currentPage: number = 1;
  public movies: MovieResult[] = [];
  public error: any = null;
  public isLoading: boolean = false;
  public dummyArray = new Array(10);
  public imageBaseUrl: string = 'https://image.tmdb.org/t/p';
  constructor() {
    this.loadMovies();

    // this.loadMovieDetails();
  }
  loadMovies(event?: InfiniteScrollCustomEvent) {
    if (!event) {
      this.isLoading = true;
    }
    this.movieService
      .getTopRatedMovies(this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          event?.target.complete();
        }),
        catchError((err: any) => {
          console.log(err);
          this.error =
            err?.error?.status_message ||
            'An error occurred while fetching movies.';
          return [];
        })
      )
      .subscribe({
        next: (res) => {
          this.movies.push(...res.results);
          if (event) {
            event.target.disabled = this.currentPage === res.total_pages;
          }
        },
      });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
  //  loadMovieDetails(){
  //   this.movieService.getMovideDetails('278').subscribe(res => {
  //     console.log(res);
  //   })
  // }
}
