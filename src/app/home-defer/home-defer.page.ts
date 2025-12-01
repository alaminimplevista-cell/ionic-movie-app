import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonHeader,
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
import { MovieResult } from '../services/interfaces';
import { Movie } from '../services/movie';
import { catchError, finalize } from 'rxjs';
import { RouterModule } from '@angular/router';

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
    IonInfiniteScrollContent]
})
export class HomeDeferPage{
  private movieService = inject(Movie);
  public isLoading:boolean = false;
  public imageBaseUrl:string = 'https://image.tmdb.org/t/p';
  public movies:MovieResult[]=[];
  public error:any=null
  private currentPage:number = 1;
  public dummyArray = new Array(10);
  constructor() {
    this.loadTopRatedMovies();
  }
  loadTopRatedMovies(event?:InfiniteScrollCustomEvent){
    if(!event){
      this.isLoading = true;
    }
    this.movieService.getTopRatedMovies().pipe(
      finalize(()=>{
        this.isLoading = false;
        if(event){
          event.target.complete();
        }
      }),
       catchError((err: any) => {
          console.log(err);
          this.error =
            err?.error?.status_message ||
            'An error occurred while fetching movies.';
          return [];
        })
    ).subscribe({
      next:(res)=>{
        console.log(res);
        this.movies.push(...res.results);
        if(event){
          event.target.disabled = this.currentPage === res.total_pages;
        }
      }
    });
  }
  loadMore(event:InfiniteScrollCustomEvent){
    this.currentPage++;
    this.loadTopRatedMovies(event);
  }
}
