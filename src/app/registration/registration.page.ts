import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonInput, IonInputPasswordToggle, IonButton, IonText } from '@ionic/angular/standalone';
import { User } from '../httpService/user.service';
import { catchError, finalize, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonInput, IonInputPasswordToggle, IonButton, IonText, ReactiveFormsModule, ReactiveFormsModule]
})
export class RegistrationPage {
  public registerFromGroup!: FormGroup;
  private registrationService = inject(User)
  public isFormSubmitting: boolean = false;
  public error: string = ''
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  constructor(private registerFormBuilder: FormBuilder) {
    this.registerFromGroup = this.registerFormBuilder.group({
      userName: [''],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(6), Validators.required]],
    })
  }
  handleSubmit = () => {
    console.log('form submitted');
    this.isFormSubmitting = true
    if (this.registerFromGroup.valid) {
      console.log("Submitted Form: ", this.registerFromGroup.value)
      this.registrationService.registerUser(this.registerFromGroup.value)
        .pipe(
          finalize(() => {
            this.isFormSubmitting = false;

          }),
          catchError((err: any) => {
            console.log(err);
            this.error =
              err?.message ||
              'An error occurred while registration';
            return of(null);
          })
        )
        .subscribe({
          next: (res) => {
            console.log(res);
            if(res?.userId){
              localStorage.setItem('auth_token',res.token||'');
              const redirect_uri = this.activatedRoute.snapshot.queryParamMap.get('redirect_uri') 
              if(redirect_uri){
                this.router.navigateByUrl(redirect_uri)
              }
              else this.router.navigateByUrl('/home')
            }
          }
        })


    }
  }



}
