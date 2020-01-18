const dotenv = require('dotenv')
const fs = require('fs')

if (fs.existsSync("../.env")) {
  const envConfig = dotenv.parse(fs.readFileSync('../.env'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const jwt = require("jsonwebtoken");
const functions = require('../functions');
const fetch = require('node-fetch')
const { GANDI_API_HOST, GANDI_API_VERSION, GANDI_CLIENT_SECRET, GANDI_CLIENT_ID, GANDI_IDENTITY_HOST } = process.env;

exports.handler = function (event, context, callback) {
  if (event.httpMethod != "POST") {
    return callback(null, { statusCode: 405, body: "Only POST authorized" });
  }

  const body = JSON.parse(event.body);
  if (!Object.keys(body).includes("code")) {
    return callback(null, { statusCode: 400, body: "Missing code" });
  }

  // TODO Get token from Gandi

  const url = "https://" + GANDI_IDENTITY_HOST + '/token';

  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("code", body.code);
  urlencoded.append("client_id", GANDI_CLIENT_ID);
  urlencoded.append("client_secret", GANDI_CLIENT_SECRET);

  let options = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  console.log(options, url);

  return fetch(url, options)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const token = jwt.sign({ access_token: data.access_token }, process.env.JWT_SECRET, { expiresIn: '1h' })
      console.log(token);
      return ({
        statusCode: 200,
        body: JSON.stringify({
          "access_token": token,
          "token_type": "JWT",
          "expires_in": 3600
        }),
        headers: {
          "Content-Type": "application/json"
        },
      })
    });
}
