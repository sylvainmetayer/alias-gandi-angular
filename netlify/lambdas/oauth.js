const dotenv = require('dotenv')
const fs = require('fs')

if (fs.existsSync(".env")) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

exports.handler = function (event, context, callback) {
  if (event.httpMethod != "GET") {
    return callback(null, { statusCode: 405, body: "Only GET authorized" });
  }

  const oauthHosts = JSON.parse(process.env.OAUTH_HOSTS);
  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(oauthHosts)
  });
}
