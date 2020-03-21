const functions = require("./functions");
const providers = require("./providers");

functions.loadEnv();

exports.handler = async (event) => {
  if (event.httpMethod != "POST") {
    return { statusCode: 405, body: "Only POST authorized" };
  }

  const token = functions.getToken(event.headers);
  if (!functions.isValidToken(token)) {
    return { statusCode: 401, body: "Invalid token" };
  }

  const providerName = functions.getProviderName(token).provider;
  if (!providers.exists(providerName)) {
    return { statusCode: 401, body: `${providerName} does not exists` };
  }

  const body = JSON.parse(event.body);
  const aliases = body.aliases || [];
  const { domain, mailboxId } = body;

  if (domain === undefined || mailboxId === undefined) {
    return { statusCode: 400, body: "Bad request" };
  }

  const provider = providers.load(providerName);
  return provider.updateAliases(domain, mailboxId, aliases);
}
