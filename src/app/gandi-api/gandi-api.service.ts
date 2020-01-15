import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Mailbox } from '../domain/mailbox/mailbox';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

export interface AliasesResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GandiApiService {

  private BASE_URL = '/api';

  constructor(private httpClient: HttpClient) { }

  updateAliases(domain: string, mailboxId: string, aliases: Array<string>): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const observer = new Subject<boolean>();

    const body = {
      aliases,
      domain,
      mailboxId
    };

    console.log(body);
    this.httpClient
      .post<AliasesResponse>(
        this.BASE_URL + `/aliases`,
        body,
        httpOptions
      )
      .subscribe(
        (data: AliasesResponse) => {
          console.log(data);
          observer.next(true);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          observer.next(false);
        },
        () => {
          observer.complete();
        }
      );

    return observer;
  }

  getDomains(): Observable<Array<string>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const observer = new Subject<string[]>();

    this.httpClient
      .get<any>(
        this.BASE_URL + '/domains',
        httpOptions
      )
      .subscribe(
        data => {
          observer.next(data);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          observer.next([]);
        },
        () => {
          observer.complete();
        }
      );

    return observer;
  }

  getMailboxesIds(domain: string): Observable<Array<string>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const observer = new Subject<string[]>();

    this.httpClient
      .get<any>(
        this.BASE_URL + '/mailboxes/' + domain,
        httpOptions
      )
      .subscribe(
        data => {
          observer.next(data);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          observer.next([]);
        },
        () => {
          observer.complete();
        }
      );
    return observer;
  }

  getMailboxDetails(domain: string, id: string): Observable<Mailbox | null> {
    const wantedKeys = ['aliases', 'domain', 'address', 'id'];

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const observer = new Subject<Mailbox>();

    this.httpClient
      .get<any>(
        this.BASE_URL + `/mailbox/${domain}/${id}`,
        httpOptions
      )
      .subscribe(
        data => {
          console.log(data);
          const filteredData = Object.keys(data)
            .filter(key => wantedKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {}) as Mailbox || null;
          observer.next(filteredData);
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          observer.next(null);
        },
        () => {
          observer.complete();
        }
      );
    return observer;
  }
}
