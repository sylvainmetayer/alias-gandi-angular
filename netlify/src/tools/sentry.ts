import * as Sentry from '@sentry/node';
import {
  APIGatewayProxyEvent,
  Handler,
  APIGatewayEvent,
  Context,
  Callback,
} from 'aws-lambda';


let sentryInitialized = false;
export function initSentry() {
  const { SENTRY_DSN, COMMIT_REF } = process.env;
  if (SENTRY_DSN) {
    Sentry.init({ dsn: SENTRY_DSN, release: COMMIT_REF, debug: true });
    sentryInitialized = true;
  }
}

export async function reportError(
  error: Error | string,
  eventContext?: APIGatewayProxyEvent
) {
  console.warn(error);
  if (!sentryInitialized) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) => {
      if (eventContext) {
        const request = event.request || {};
        request.method = request.method || eventContext.httpMethod;
        request.url = request.url || eventContext.path;
        request.headers = request.headers || eventContext.headers;
        event.request = request;
      }

      return event;
    });

    if (typeof error === 'string') {
      Sentry.captureMessage(error);
    } else {
      Sentry.captureException(error);
    }
  });

  // Cast required temporarily - this is new in 4.6.0, and isn't in
  // the typings quite yet.
  await Sentry.flush();
}

export function catchErrors(handler: Handler): Handler {
  return async function(
    event: APIGatewayEvent,
    context: Context,
    callback: Callback
  ) {
    // Make sure AWS doesn't wait for an empty event loop, as that
    // can break things with Sentry
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      // @ts-ignore
      return await handler.call(this, event, context, callback);
    } catch (e) {
      // Catches sync errors & promise rejections, because we're async
      await reportError(e, event);
      throw e;
    }
  };
}
