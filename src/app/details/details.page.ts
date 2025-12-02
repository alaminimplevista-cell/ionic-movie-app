import { Component, inject, Input, signal, WritableSignal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonSkeletonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonAvatar } from '@ionic/angular/standalone';

import {cashOutline,calendarOutline} from 'ionicons/icons'
import {addIcons} from 'ionicons'
import { RouterModule } from '@angular/router';
import { Movie } from '../httpService/movie.service';
import { MovieDetailsModel } from '../models/movie';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSkeletonText,
    DatePipe,
  RouterModule, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge]
})
export class DetailsPage{
  private movieService = inject(Movie);
  public imageBaseUrl: string = environment.image_base_url;
  public movie:WritableSignal<MovieDetailsModel | null> = signal(null);
  @Input()
  set id(movieId:string){
    this.movieService.getMovieDetails(movieId).subscribe(res => {
      console.log(res);
      this.movie.set(res);
      
    });
  }
  constructor() { 
    addIcons({cashOutline,calendarOutline});
  }

}
