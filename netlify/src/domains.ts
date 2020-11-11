import { initSentry, catchErrors } from './tools/sentry';
import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { loadEnv, getTokenFromHeaders } from './tools/functions';
import { Token } from './tools/token';
import { exists, load } from './providers/providers';

loadEnv();
initSentry();

const handler: Handler = catchErrors(
  // tslint:disable-next-line: variable-name
  async (event: APIGatewayEvent, _context: Context, callback: Callback) => {
    if (event.httpMethod !== 'GET') {
      return callback(null, { statusCode: 405, body: 'Only GET authorized' });
    }

    const tokenValue = getTokenFromHeaders(event.headers);
    if (!tokenValue) {
      return callback(null, { statusCode: 401, body: 'Token is mandatory to fetch domains' });
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
    const domains = await provider.getDomains();
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        domains.map((domain) => {
          return {
            name: domain.getName(),
            mailboxes: domain.getMailboxes().map((mailbox) => {
              return {
                id: mailbox.getId(),
                label: mailbox.getLabel()
              };
            }),
          };
        })
      ),
    });
  }
);

export { handler };
