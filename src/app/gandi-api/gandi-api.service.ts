import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mailbox } from '../domain/mailbox/mailbox';

@Injectable({
  providedIn: 'root'
})
export class GandiApiService {
  updateAliases(mailboxId: string, aliases: Array<string>): Observable<boolean> {
    return of(true);
  }

  constructor() { }

  getDomains(): Observable<Array<string>> {
    return of(['sylvainmetayer.fr']);
  }

  getMailboxesIds(domain: string): Observable<Array<string>> {
    return of(['id1', 'id2']);
  }

  getMailboxDetails(id: string): Observable<Mailbox> {
    const wantedKeys = ['aliases', 'login', 'domain', 'address', 'id'];
    const data = {
      aliases: [
        'test3'
      ],
      login: 'debug',
      mailbox_type: 'standard',
      responder: {
        message: '',
        enabled: false
      },
      domain: 'sylvainmetayer.fr',
      quota_used: 9,
      address: `${id}@sylvainmetayer.fr`,
      href: 'https://api.gandi.net',
      id
    };

    // {aliases: [], id, address: 'debug@sylvainmetayer.fr', domain: 'sylvainmetayer.fr', login: 'debug'};
    const filteredData = Object.keys(data)
      .filter(key => wantedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {}) as Mailbox;

    return of(filteredData);
  }
}
