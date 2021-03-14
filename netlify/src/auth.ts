import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { exists } from './providers/providers';
import { loadEnv } from './tools/functions';
import { catchErrors, initSentry } from './tools/sentry';
import { TokenFactory } from './tools/token';

loadEnv();
initSentry();

interface AuthBody {
  password: string;
  provider: string;
}

const handler: Handler = catchErrors(
  // tslint:disable-next-line: variable-name
  async (event: APIGatewayProxyEvent, _context: Context, callback: Callback) => {
    if (event.httpMethod !== 'POST') {
      return callback(null, { statusCode: 405, body: 'Only POST authorized' });
    }

    // Weird case if no body.
    if (event.body === null || event.body.toString() === '[object Object]') {
      return callback(null, { statusCode: 400, body: 'Bad request' });
    }

    const body = JSON.parse(event.body) as AuthBody;
    if (
      !Object.keys(body).includes('password') ||
      body.password !== process.env.LOGIN_PASSWORD
    ) {
      return callback(null, { statusCode: 401, body: 'Bad credentials' });
    }

    if (!Object.keys(body).includes('provider')) {
      return callback(null, { statusCode: 400, body: 'Missing provider' });
    }

    const providerName = body.provider;
    if (!exists(providerName)) {
      return callback(null, {
        statusCode: 400,
        body: `${providerName} does not exists`,
      });
    }

    const token = TokenFactory.create(true, providerName, '1h');
    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: token.toJWT(),
    });
  }
);

export { handler };
