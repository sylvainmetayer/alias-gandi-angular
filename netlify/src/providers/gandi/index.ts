import { ProviderInterface, Domain, Mailbox, isDebug, BASE_DEBUG_URL } from '..';
import { HttpClient, HttpClientResponse } from 'typed-rest-client/HttpClient';
import { loadEnv } from '../../tools/functions';
import { of } from 'rxjs';
import { DomainResponse, MailboxResponse } from './interfaces';

loadEnv();

// interface StringMap { [key: string]: string; }

/**
 * Must be named `folderNameCamelCase`Provider
 */
class GandiProvider implements ProviderInterface {

  private static version = 'v5';

  private static baseUrl = `https://api.gandi.net/${GandiProvider.version}`;

  public static apiKeyEnvName = 'GANDI_API_KEY';

  private apiKey: string;

  private httpClient: HttpClient;

  constructor() {
    const apiKey: string | undefined = process.env[GandiProvider.apiKeyEnvName];
    if (!apiKey) {
      throw Error('Missing Gandi API Key');
    }
    this.apiKey = apiKey;
    this.httpClient = new HttpClient('Gandi Email Alias Manager - V1', undefined, {
      headers: { Authorization: 'apiKey ' + this.apiKey }
    });
  }

  async getDomains(): Promise<Domain[]> {
    const url = isDebug() ? `${BASE_DEBUG_URL}/gandi/domains` : `${GandiProvider.baseUrl}/domain/domains`;
    const response: HttpClientResponse = await this.httpClient.get(url);
    if (response.message.statusCode === 200) {
      const stringData = JSON.parse(await response.readBody()) as Array<DomainResponse>;
      const domains: Array<Domain> = [];
      stringData.forEach((domain: DomainResponse) => {
        domains.push(new Domain(domain.fqdn, domain.id));
      });
      return of(domains).toPromise();
    }

    const error = await response.readBody();
    console.error(error);
    return of([]).toPromise();
  }

  async getMailboxes(domain: Domain): Promise<Mailbox[]> {
    const url = isDebug() ?
      `${BASE_DEBUG_URL}/gandi/${domain.getName()}`
      : `${GandiProvider.baseUrl}/email/mailboxes/${domain.getName()}`;
    const response: HttpClientResponse = await this.httpClient.get(url);
    if (response.message.statusCode === 200) {
      const stringData = JSON.parse(await response.readBody());
      const mailboxes: Array<Mailbox> = [];
      stringData.forEach((mailBox: MailboxResponse) => {
        mailboxes.push(new Mailbox(domain, mailBox.address, mailBox.id, undefined));
      });
      return of(mailboxes).toPromise();
    }

    const error = await response.readBody();
    console.error(error);
    return of([]).toPromise();
  }
  async getMailbox(id: string, domain: Domain): Promise<Mailbox> {
    const url = isDebug() ?
      `${BASE_DEBUG_URL}/gandi/${domain.getName()}/${id}`
      : `${GandiProvider.baseUrl}/email/mailboxes/${domain.getName()}/${id}`;
    const response: HttpClientResponse = await this.httpClient.get(url);
    if (response.message.statusCode === 200) {
      const mailboxResponse = JSON.parse(await response.readBody()) as MailboxResponse;
      const mailbox = new Mailbox(domain, mailboxResponse.address, mailboxResponse.id, mailboxResponse.aliases);
      return of(mailbox).toPromise();
    }

    const error = await response.readBody();
    console.error(error);
    // TODO Handle error.
    throw Error('Error.');
  }
  async updateAliases(mailbox: Mailbox): Promise<boolean> {
    const url = isDebug() ?
      `${BASE_DEBUG_URL}/gandi/${mailbox.getDomain().getName()}/${mailbox.getId()}`
      : `${GandiProvider.baseUrl}/email/mailboxes/${mailbox.getDomain().getName()}/${mailbox.getId()}`;
    const body = JSON.stringify({ aliases: mailbox.getAliases() });
    const response = await this.httpClient.patch(url, body, {
      'Content-Type': 'application/json'
    });
    return of(response.message.statusCode === 200).toPromise();
  }

}

export { GandiProvider };
