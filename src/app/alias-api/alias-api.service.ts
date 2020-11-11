import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DomainInterface, MailboxInterface } from './entities';

export class AliasError extends Error {}

export interface AliasesResponse {
  aliases: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AliasApiService {
  private BASE_URL = '/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  updateAliases(
    domain: string,
    mailboxId: string,
    aliases: Array<string>
  ): Observable<string[]> {
    const observer = new Subject<string[]>();

    const body = {
      aliases,
      domain,
      mailboxId,
    };

    this.httpClient
      .post<AliasesResponse>(this.BASE_URL + `/aliases`, body, this.httpOptions)
      .subscribe(
        (data: AliasesResponse) => {
          observer.next(data.aliases);
        },
        (err: HttpErrorResponse) => {
          observer.error(new AliasError());
        },
        () => {
          observer.complete();
        }
      );

    return observer;
  }

  getDomains(): Observable<Array<DomainInterface>> {
    return this.httpClient.get<Array<DomainInterface>>(
      this.BASE_URL + '/domains',
      this.httpOptions
    );
  }

  getMailboxDetails(
    domain: string,
    id: string
  ): Observable<MailboxInterface | null> {
    const wantedKeys = ['aliases', 'domain', 'label', 'id'];

    return this.httpClient
      .get(this.BASE_URL + `/mailbox/${domain}/${id}`, this.httpOptions)
      .pipe(
        map((data) => {
          const filteredData =
            (Object.keys(data)
              .filter((key) => wantedKeys.includes(key))
              .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
              }, {}) as MailboxInterface) || null;
          return filteredData;
        })
      );
  }
}
