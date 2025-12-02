import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonInput, IonButton, IonText, IonInputPasswordToggle } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../httpService/user.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonInput, IonButton, IonText, IonInputPasswordToggle,RouterModule,ReactiveFormsModule]
})
export class LoginPage {
  public loginFormGroup !: FormGroup;
  private userService = inject(User)
  public isFormSubmitting:boolean = false
  public error:string = "";
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)
  constructor(private loginFormBuilder:FormBuilder) { 
    this.loginFormGroup = this.loginFormBuilder.group({
      email:['',[Validators.email,Validators.required]],
      password:['',[Validators.required,Validators.minLength(6)]]
    })
  }

  handleSubmit() {
    // Handle login logic here
    
    if(this.loginFormGroup.valid){
      this.isFormSubmitting = true;
      this.userService.loginUser(this.loginFormGroup.value)
      .pipe(
        finalize(()=>{
          this.isFormSubmitting = false
        }),
        catchError((err:any)=>{
          this.error = err.message || "There was a problem while login"
          return of(null);
        })
      )
      .subscribe({
        next:(res)=>{
          if(res?.userId){
            localStorage.setItem('auth_token',res.token||'');
            const redirect_uri = this.activatedRoute.snapshot.queryParamMap.get('redirect_uri');
            if(redirect_uri){
              this.router.navigateByUrl(redirect_uri)
            }
            else this.router.navigateByUrl('/home')
          }
        }
      })

    }
  }
  navigateToRegistrationPage(){
    const redirect_uri = this.activatedRoute.snapshot.queryParamMap.get('redirect_uri');
    if(redirect_uri){
      this.router.navigateByUrl(`/registration?redirect_uri=${redirect_uri}`)
    }
    else{
      this.router.navigateByUrl(`/registration`)
    }
  }

}
