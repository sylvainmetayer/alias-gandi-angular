const functions = require("./functions");
const jwt = require("jsonwebtoken");
const providers = require("./providers");

functions.loadEnv();

exports.handler = async (event, context) => {
  if (event.httpMethod != "GET") {
    return { statusCode: 405, body: "Only GET authorized" };
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
  return provider.getDomains();
}
