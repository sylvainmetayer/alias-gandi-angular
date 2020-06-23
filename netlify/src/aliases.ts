import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { loadEnv, getTokenFromHeaders } from './tools/functions';
import { Token } from './tools/token';
import * as providers from './providers';

loadEnv();

interface AliasBody {
  domain: string;
  mailboxId: string;
  aliases: string[];
}

// tslint:disable-next-line: variable-name
const handler: Handler = async (event: APIGatewayEvent,_context: Context, callback: Callback) => {
  if (event.httpMethod !== 'POST') {
    return callback(null, { statusCode: 405, body: 'Only POST authorized' });
  }

  const tokenValue = getTokenFromHeaders(event.headers);

  if (!tokenValue) {
    return callback(undefined, { statusCode: 400, body: 'Missing token' });
  }

  const token = new Token(tokenValue);

  if (!token.isValid()) {
    return callback(null, { statusCode: 401, body: 'Invalid token' });
  }

  const providerName = token.getProviderName();
  if (!providerName || !providers.exists(providerName)) {
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

  const provider = providers.load(providerName);

  const mailbox = await provider.getMailbox(
    mailboxId,
    new providers.Domain(domain)
  );
  console.log(mailbox);
  mailbox.setAliases(aliases);
  console.log(mailbox);
  const updated = await provider.updateAliases(mailbox);

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({ message: 'OK', success: updated }),
  });
};

export { handler };
