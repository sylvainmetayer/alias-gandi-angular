import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { Domain } from './providers/entities';
import { exists, load } from './providers/providers';
import { getTokenFromHeaders, loadEnv } from './tools/functions';
import { catchErrors, initSentry } from './tools/sentry';
import { Token } from './tools/token';

loadEnv();
initSentry();

interface AliasBody {
  domain: string;
  mailboxId: string;
  aliases: string[];
}

const handler: Handler = catchErrors(
  // tslint:disable-next-line: variable-name
  async (event: APIGatewayProxyEvent, _context: Context, callback: Callback) => {
    if (event.httpMethod !== 'POST') {
      return callback(null, { statusCode: 405, body: 'Only POST authorized' });
    }

    const tokenValue = getTokenFromHeaders(event.headers);

    if (!tokenValue) {
      return callback(undefined, { statusCode: 400, body: 'Token is mandatory to update aliases' });
    }

    const token = new Token(tokenValue);

    if (!token.isValid()) {
      return callback(null, { statusCode: 401, body: 'Invalid token' });
    }

    const providerName = token.getProviderName();
    if (!providerName || !exists(providerName)) {
      return callback(null, {
        statusCode: 401,
        body: `${providerName} does not exists`,
      });
    }

    if (event.body === null) {
      return callback(null, { statusCode: 400, body: 'Bad request' });
    }

    const body = JSON.parse(event.body) as AliasBody;
    const { domain, mailboxId, aliases } = body;

    if (domain === undefined || mailboxId === undefined) {
      return callback(null, { statusCode: 400, body: 'Bad request' });
    }

    const provider = load(providerName);

    const mailbox = await provider.getMailbox(mailboxId, new Domain(domain));
    mailbox.setAliases(aliases);
    const updatedAliases = await provider.updateAliases(mailbox);

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        aliases: updatedAliases,
      }),
    });
  }
);

export { handler };
