import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RegisterUserResponseModel, UserModel } from "../models/user.model";
import { httpEndPoints } from "./endpoints";
import { postApi } from "./api";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root',
})
export class User{
    private http = inject(HttpClient);
    registerUser = (body:UserModel):Observable<RegisterUserResponseModel>=>{
        const endpoint = httpEndPoints.registerUserEndpoint;
        return postApi<UserModel,RegisterUserResponseModel>(this.http, endpoint,body)
    }
    loginUser = (body:UserModel):Observable<RegisterUserResponseModel>=>{
        const endpoint = httpEndPoints.loginUserEndpoint;
        return postApi<UserModel,RegisterUserResponseModel>(this.http,endpoint,body)
    }
}