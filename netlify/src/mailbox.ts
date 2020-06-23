import { initSentry, catchErrors } from './tools/sentry';
import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { loadEnv, getTokenFromHeaders } from './tools/functions';
import { Token } from './tools/token';
import { exists, load, Domain } from './providers/providers';

loadEnv();
initSentry();


const handler: Handler = catchErrors(
  // tslint:disable-next-line: variable-name
  async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
    if (event.httpMethod !== 'GET') {
      return callback(null, { statusCode: 405, body: 'Only GET authorized' });
    }

    const regex = /\/(?:.+)?mailbox\/(?<domain>.*)\/(?<mailboxId>.*)\/?/gi;
    const regexResults = regex.exec(event.path);

    if (!regexResults || !regexResults.groups) {
      return callback(null, { statusCode: 400, body: 'Bad request' });
    }

    const domain = regexResults.groups.domain;
    const mailboxId = regexResults.groups.mailboxId;

    const tokenValue = getTokenFromHeaders(event.headers);
    if (!tokenValue) {
      return callback(null, { statusCode: 401, body: 'Missing token' });
    }

    const token = new Token(tokenValue);

    if (!token.isValid()) {
      return callback(null, { statusCode: 401, body: 'Invalid token' });
    }

    const providerName = token.getProviderName();
    if (!providerName || !exists(providerName)) {
      return callback(null, {
        statusCode: 400,
        body: `${providerName} does not exists`,
      });
    }

    const provider = load(providerName);
    const mailbox = await provider.getMailbox(mailboxId, new Domain(domain));
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      // TODO Change it and change angular service
      body: JSON.stringify({
        aliases: mailbox.getAliases(),
        domain: mailbox.getDomain().getName(),
        address: mailbox.getLabel(),
        id: mailbox.getId(),
      }),
    });
  }
);

export { handler };
