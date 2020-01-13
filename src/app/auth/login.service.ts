import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private BASE_URL = '/api';

  constructor(private client: HttpClient) {}

  isConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private token: string = null;

  isLoggedIn(): Observable<boolean> {
    return of(false);
  }

  login(password: string): Observable<boolean> {
    const loginObserver = new Subject<boolean>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.client
      .post<LoginResponse>(
        this.BASE_URL + '/auth',
        {
          password
        },
        httpOptions
      )
      .subscribe(
        data => {
          localStorage.setItem('token', data.access_token);
          this.token = data.access_token;
          loginObserver.next(true);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          loginObserver.next(false);
        },
        () => {
          loginObserver.complete();
        }
      );

    return loginObserver;
  }

  logout(): void {
    this.isConnected.next(false);
    localStorage.removeItem('token');
  }

  getToken(): string {
    return this.token;
  }

  getAuthTokenPromise(): Promise<string | Error> {
    return new Promise((resolve, reject) => {
      this.token ? resolve(this.token) : reject();
    });
  }
}
