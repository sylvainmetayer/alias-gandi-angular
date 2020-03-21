const functions = require("./functions");
const providers = require("./providers");

functions.loadEnv();

exports.handler = async (event) => {
  const regex = /\/(?:.+)?mailbox\/(?<domain>.*)\/(?<mailboxId>.*)\/?/gi;
  const { groups: { domain, mailboxId } } = regex.exec(event.path)

  if (event.httpMethod != "GET") {
    return { statusCode: 405, body: "Only GET authorized" };
  }

  if (domain === undefined || mailboxId === undefined) {
    return { statusCode: 400, body: "Bad request" };
  }

  const token = functions.getToken(event.headers);
  if (!functions.isValidToken(token)) {
    return { statusCode: 401, body: "Invalid token" };
  }

  const providerName = functions.getProviderName(token).provider;
  if (!providers.exists(providerName)) {
    return { statusCode: 401, body: `${providerName} does not exists` };
  }

  const provider = providers.load(providerName);
  return provider.getMailboxDetails(domain, mailboxId);
}
