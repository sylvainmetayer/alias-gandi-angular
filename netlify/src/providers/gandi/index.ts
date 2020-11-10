import { ProviderInterface, isDebug, BASE_DEBUG_URL } from '../providers';
import { HttpClient, HttpClientResponse } from 'typed-rest-client/HttpClient';
import { loadEnv } from '../../tools/functions';
import { of } from 'rxjs';
import { DomainResponse, MailboxResponse } from './interfaces';
import { Domain, Mailbox } from '../entities';

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
    this.httpClient = new HttpClient(
      'Gandi Email Alias Manager - V1',
      undefined,
      {
        headers: { Authorization: 'apiKey ' + this.apiKey },
      }
    );
  }

  async getDomains(): Promise<Domain[]> {
    const url = isDebug()
      ? `${BASE_DEBUG_URL}/gandi/domains`
      : `${GandiProvider.baseUrl}/domain/domains`;
    const response: HttpClientResponse = await this.httpClient.get(url);
    if (response.message.statusCode === 200) {
      const stringData = JSON.parse(await response.readBody()) as Array<
        DomainResponse
      >;
      const domains: Array<Domain> = [];

      for (const domainResponse of stringData) {
        const domain = new Domain(domainResponse.fqdn, domainResponse.id);
        const mailboxes = await this.getMailboxes(domain);
        mailboxes.forEach((mailbox: Mailbox) => {
          domain.addMailbox(mailbox);
        });
        domains.push(domain);
      }

      return of(domains).toPromise();
    }

    const error = await response.readBody();
    console.error(error);
    return of([]).toPromise();
  }

  private async getMailboxes(domain: Domain): Promise<Mailbox[]> {
    const url = isDebug()
      ? `${BASE_DEBUG_URL}/gandi/${domain.getName()}`
      : `${GandiProvider.baseUrl}/email/mailboxes/${domain.getName()}`;
    const response: HttpClientResponse = await this.httpClient.get(url);
    if (response.message.statusCode === 200) {
      const stringData = JSON.parse(await response.readBody());
      const mailboxes: Array<Mailbox> = [];
      stringData.forEach((mailBox: MailboxResponse) => {
        mailboxes.push(
          // At this point, Gandi API do not return the aliases
          new Mailbox(domain, mailBox.address, mailBox.id, undefined)
        );
      });
      return of(mailboxes).toPromise();
    }

    const error = await response.readBody();
    console.error(error);
    return of([]).toPromise();
  }

  async getMailbox(id: string, domain: Domain): Promise<Mailbox> {
    const url = isDebug()
      ? `${BASE_DEBUG_URL}/gandi/${domain.getName()}/${id}`
      : `${GandiProvider.baseUrl}/email/mailboxes/${domain.getName()}/${id}`;
    const response: HttpClientResponse = await this.httpClient.get(url);
    if (response.message.statusCode === 200) {
      const mailboxResponse = JSON.parse(
        await response.readBody()
      ) as MailboxResponse;
      console.warn('Mailbox answer:' + mailboxResponse.aliases?.length);
      const mailbox = new Mailbox(
        domain,
        mailboxResponse.address,
        mailboxResponse.id,
        mailboxResponse.aliases
      );
      return of(mailbox).toPromise();
    }

    const error = await response.readBody();
    console.error(error);
    // TODO Handle error.
    throw Error('Error.');
  }
  async updateAliases(mailbox: Mailbox): Promise<string[]> {
    const url = isDebug()
      ? `${BASE_DEBUG_URL}/gandi/${mailbox
          .getDomain()
          .getName()}/${mailbox.getId()}`
      : `${
          GandiProvider.baseUrl
        }/email/mailboxes/${mailbox.getDomain().getName()}/${mailbox.getId()}`;
    const body = JSON.stringify({ aliases: mailbox.getAliases() });
    const response = await this.httpClient.patch(url, body, {
      'Content-Type': 'application/json',
    });
    const responseBody: { message: string } = JSON.parse(
      await response.readBody()
    ) as { message: string };

    if (responseBody.message !== 'Mailbox updated.') {
      throw Error(responseBody.message);
    }

    const updatedMailbox = await this.getMailbox(
      mailbox.getId() as string,
      mailbox.getDomain()
    );

    console.warn('return :' + updatedMailbox.getAliases().length);
    return of(updatedMailbox.getAliases()).toPromise();
  }
}

export { GandiProvider };
