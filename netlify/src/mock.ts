import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { loadEnv } from './tools/functions';
import * as providers from './providers';
import { DomainResponse, MailboxResponse } from './providers/gandi/interfaces';
const fakeData = require('../data') as { domains: Array<DomainResponse>, mailboxes: Array<MailboxResponse> };
import { writeFileSync } from 'fs';
const { domains, mailboxes } = fakeData;

loadEnv();

const getDomains = (): Array<DomainResponse> => {
  return domains;
};

const getMailboxes = (domain: string): Array<MailboxResponse> => {
  return mailboxes.filter(mailbox => mailbox.domain === domain);
};

const getMailbox = (domain: string, id: string): MailboxResponse | undefined => {
  const mailbox = mailboxes.find(item => item.domain === domain && item.id === id);
  return mailbox;
};


const updateMailbox = (domain: string, id: string, aliases: string[]): MailboxResponse | null => {
  const index = mailboxes.findIndex(item => item.domain === domain && item.id === id);
  if (index === -1) {
    return null;
  }
  const mailbox = mailboxes.find(item => item.domain === domain && item.id === id);
  if (!mailbox) {
    return null;
  }
  if (!mailbox?.aliases) {
    mailbox.aliases = [];
  }
  mailbox.aliases = aliases;

  // Update data.js file
  mailboxes[index] = mailbox;
  const filename = '../data.js';
  writeFileSync(filename, `module.exports = {
  domains: ${JSON.stringify(domains)},
  mailboxes: ${JSON.stringify(mailboxes)}
};
`);

  return mailbox;
};

const gandiMock = (callback: Callback, method: string, body: string | null, domain: string, mailboxId: string | undefined) => {
  console.log(domain, mailboxId, body?.toString(), method);
  // get all domains
  if (domain === 'domains' && method === 'GET') {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(getDomains()),
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  if (!mailboxId && method === 'GET') {
    // no mailbox defined, we want all mailboxes for the given domain.
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(getMailboxes(domain))
    });
  }

  if (method === 'PATCH' && mailboxId && body) {
    // Update one mailbox aliases
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateMailbox(domain, mailboxId, JSON.parse(body).aliases))
    });
  }

  if (method === 'GET' && mailboxId) {
    const mailBox = getMailbox(domain, mailboxId);
    if (!mailBox) {
      return callback(null, {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ msg: 'not found' })
      });
    }
    // We want one mailboxe specifically
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mailBox)
    });
  }

  return callback(null, { statusCode: 500, body: 'Gandi Mock API Error : unknown case' });
};

// tslint:disable-next-line: variable-name
const handler: Handler = async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
  if (!process.env.DEBUG) {
    return callback(null, { statusCode: 400, body: 'No debug' });
  }

  if (event.httpMethod !== 'GET' && event.httpMethod !== 'PATCH') {
    return callback(null, { statusCode: 405, body: 'unauthorized methd' });
  }

  const regex = /\/(?:.+)?mock\/(?<providerName>[^\/]+)\/(?<domain>[^\/]+)(?:\/(?<mailboxId>[^\/]+))?\/*/gi;
  const regexResults = regex.exec(event.path);

  if (!regexResults) {
    return callback(null, { statusCode: 400, body: 'Regex error' });
  }

  if (!regexResults.groups?.providerName) {
    return callback(null, { statusCode: 400, body: 'Missing provider you want to mock' });
  }

  const { providerName, domain, mailboxId } = regexResults.groups;

  if (!providers.exists(providerName)) {
    return callback(null, { statusCode: 400, body: `Missing provider ${providerName} you want to mock` });
  }

  if (providerName === 'gandi') {
    return gandiMock(callback, event.httpMethod, event.body, domain, mailboxId);
  }

  // Add others mock here.
  return callback(null, { statusCode: 500, body: 'Unexpected event.' });
};

export { handler };
