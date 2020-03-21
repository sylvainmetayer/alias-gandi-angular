const functions = require("./functions");
const jwt = require("jsonwebtoken");
const providers = require("./providers");

functions.loadEnv();

exports.handler = function (event, context, callback) {
  if (event.httpMethod != "POST") {
    return callback(null, { statusCode: 405, body: "Only POST authorized" });
  }

  const body = JSON.parse(event.body);

  if (!Object.keys(body).includes("password") || body.password != process.env.LOGIN_PASSWORD) {
    return callback(null, { statusCode: 401, body: "Bad credentials" });
  }

  if (!Object.keys(body).includes("provider")) {
    return callback(null, { statusCode: 401, body: "Missing provider" });
  }

  const providerName = body.provider;

  if (!providers.exists(providerName)) {
    return callback(null, { statusCode: 401, body: `${providerName} does not exists` });
  }

  const token = jwt.sign({ logged: true, provider: providerName }, process.env.JWT_SECRET, { expiresIn: '1h' })

  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "access_token": token,
      "token_type": "JWT",
      "expires_in": 3600
    })
  });
}