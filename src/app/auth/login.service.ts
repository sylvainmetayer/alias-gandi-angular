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

export interface OauthConfig {
  name: string;
  response_type: string;
  client_id: string;
  redirect_uri: string;
  url: string;
}

const LOCAL_STORAGE_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private BASE_URL = '/api';

  constructor(private client: HttpClient) { }

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

  oauthConfig(): Observable<OauthConfig[]> {
    const configObserver = new Subject<OauthConfig[]>();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.client
      .get<OauthConfig[]>(
        this.BASE_URL + '/oauth',
        httpOptions
      )
      .subscribe(
        data => {
          console.log(data);
          configObserver.next(data);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          configObserver.next([]);
        },
        () => {
          configObserver.complete();
        }
      );


    return configObserver;
  }

  gandiLogin(code: string): Observable<boolean> {
    const loginObserver = new Subject<boolean>();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.client
      .post<LoginResponse>(
        this.BASE_URL + '/token/gandi',
        {
          code
        },
        httpOptions
      )
      .subscribe(
        data => {
          console.log(data.access_token);
          loginObserver.next(true);
          this.isConnected.next(true);
          localStorage.setItem(LOCAL_STORAGE_KEY, data.access_token);
          this.token = data.access_token;
        },
        (err: HttpErrorResponse) => {
          loginObserver.next(false);
          this.isConnected.next(false);
        },
        () => {
          loginObserver.complete();
        }
      );

    return loginObserver;
  }
}
