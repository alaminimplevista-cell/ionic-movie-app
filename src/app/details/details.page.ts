import { Component, inject, Input, input, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonSkeletonText,
    IonAvatar,
    IonAlert,
    IonLabel,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent} from '@ionic/angular/standalone';
import { Movie } from '../services/movie';
import { MovieResult } from '../services/interfaces';
import {cashOutline,calendarOutline} from 'ionicons/icons'
import {addIcons} from 'ionicons'
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [ IonHeader,
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
export class DetailsPage{
  private movieService = inject(Movie);
  public imageBaseUrl: string = 'https://image.tmdb.org/t/p';
  public movie:WritableSignal<MovieResult | null> = signal(null);
  @Input()
  set id(movieId:string){
    this.movieService.getMovideDetails(movieId).subscribe(res => {
      console.log(res);
      this.movie.set(res);
      
    });
  }
  constructor() { 
    addIcons({cashOutline,calendarOutline});
  }

}
