const dotenv = require('dotenv')
const fs = require('fs')

if (fs.existsSync(".env")) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const jwt = require("jsonwebtoken");

exports.handler = function (event, context, callback) {
  if (event.httpMethod != "POST") {
    return callback(null, { statusCode: 405, body: "Only POST authorized" });
  }

  const body = JSON.parse(event.body);
  if (!Object.keys(body).includes("password") || body.password != process.env.LOGIN_PASSWORD) {
    return callback(null, { statusCode: 401, body: "Bad credentials" });
  }

  const token = jwt.sign({ logged: true }, process.env.JWT_SECRET, { expiresIn: '1h' })

  // Valid password ! Let's generate a JWT token
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
