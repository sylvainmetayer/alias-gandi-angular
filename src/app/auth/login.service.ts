import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoginResponse } from './login-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private BASE_URL = '/api';

  constructor(private client: HttpClient) { }

  isLoggedIn(): Observable<boolean> {
    return of(false);
  }

  login(password: string): Observable<LoginResponse> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };

    return this.client.post<LoginResponse>(this.BASE_URL + '/auth', {
      password: password
    }).pipe(response => {
      // if(!response.ok) {
      //   return false;
      // }
      // localStorage.setItem('token', response.access_token)
      // return true;
      // console.log(response);
      return response;
    });

  }
}
