import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonList, IonItem, IonSkeletonText, IonAvatar, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar } from '@ionic/angular/standalone';
import { catchError, finalize, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Movie } from '../httpService/movie.service';
import { environment } from 'src/environments/environment';
import { MovieDetailsModel } from '../models/movie';

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
    IonInfiniteScrollContent,
    IonSearchbar
],
})
export class HomePage {
  private movieService = inject(Movie);
  private currentPage: number = 1;
  private movies: MovieDetailsModel[] = [];
  public error: string = "";
  public isLoading: boolean = false;
  public dummyArray = new Array(9);
  public searchText:string = "";
  public imageBaseUrl: string = environment.image_base_url;
  public filteredMovies:MovieDetailsModel[] = [];
  private router = inject(Router)
  constructor() {
    this.loadMovies();
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
          this.applysearch();
          if (event) {
            event.target.disabled = this.currentPage === res.total_pages;
          }
        },
      });
  }
  applysearch(event?:any){
    if(event){
      this.searchText = event.target.value;
    }
    
    const searchTerm = this.searchText.trim().toLowerCase();
    if(searchTerm === ""){
      this.filteredMovies = this.movies;
    } else {
      this.filteredMovies = this.movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));
    }
  }
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
  navigateToDetailsPage(movieId:number){
    const auth_token = localStorage.getItem('auth_token');
    if(!auth_token||auth_token?.trim()===''){
        this.router.navigateByUrl(`/login?redirect_uri=/details/${movieId}`)
    }
    else{
        this.router.navigateByUrl(`/details/${movieId}`)
    }
  }
 
}
