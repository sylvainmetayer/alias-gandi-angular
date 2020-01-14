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

const LOCAL_STORAGE_KEY = 'token';

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
          loginObserver.next(true);
          this.isConnected.next(true);
          localStorage.setItem(LOCAL_STORAGE_KEY, data.access_token);
          this.token = data.access_token;
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          loginObserver.next(false);
          this.isConnected.next(false);
        },
        () => {
          loginObserver.complete();
        }
      );

    return loginObserver;
  }

  logout(): void {
    this.isConnected.next(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  getToken(): string {
    return this.token;
  }

  getAuthTokenPromise(): Promise<string | Error> {
    return new Promise((resolve, reject) => {
      this.token ? resolve(this.token) : reject();
    });
  }

  reconnect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (token) {
        this.token = token;
        this.isConnected.next(true);
      }
      resolve(true);
    });
  }
}
