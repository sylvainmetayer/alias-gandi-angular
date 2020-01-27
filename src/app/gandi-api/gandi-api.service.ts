import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Mailbox } from '../domain/mailbox/mailbox';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface AliasesResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GandiApiService {

  private BASE_URL = '/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private httpClient: HttpClient) { }

  updateAliases(domain: string, mailboxId: string, aliases: Array<string>): Observable<boolean> {
    const observer = new Subject<boolean>();

    const body = {
      aliases,
      domain,
      mailboxId
    };

    this.httpClient
      .post<AliasesResponse>(
        this.BASE_URL + `/aliases`,
        body,
        this.httpOptions
      )
      .subscribe(
        (data: AliasesResponse) => {
          observer.next(true);
        },
        (err: HttpErrorResponse) => {
          observer.next(false);
        },
        () => {
          observer.complete();
        }
      );

    return observer;
  }

  getDomains(): Observable<Array<string>> {
    return this.httpClient
      .get<Array<string>>(
        this.BASE_URL + '/domains',
        this.httpOptions
      );
  }

  getMailboxesIds(domain: string): Observable<Array<string>> {
    return this.httpClient
      .get<Array<string>>(
        this.BASE_URL + '/mailboxes/' + domain,
        this.httpOptions
      );
  }

  getMailboxDetails(domain: string, id: string): Observable<Mailbox | null> {
    const wantedKeys = ['aliases', 'domain', 'address', 'id'];

    return this.httpClient
      .get(
        this.BASE_URL + `/mailbox/${domain}/${id}`,
        this.httpOptions
      )
      .pipe(
        map(data => {
          const filteredData = Object.keys(data)
            .filter(key => wantedKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {}) as Mailbox || null;
          return filteredData;
        }));
  }
}
