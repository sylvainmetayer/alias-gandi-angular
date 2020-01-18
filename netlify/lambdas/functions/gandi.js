require("dotenv").config();
const jwt = require("jsonwebtoken");

const fs = require('fs')

if (fs.existsSync("../.env")) {
  const envConfig = dotenv.parse(fs.readFileSync('../.env'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const fetch = require('node-fetch')
const { GANDI_CLIENT_SECRET, GANDI_CLIENT_ID, GANDI_IDENTITY_HOST } = process.env;

module.exports = {
  getToken: async function (code) {

    const url = GANDI_IDENTITY_HOST + '/token';

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "authorization_code");
    urlencoded.append("code", code);
    urlencoded.append("client_id", GANDI_CLIENT_ID);
    urlencoded.append("client_secret", GANDI_CLIENT_SECRET);

    let options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: urlencoded,
      redirect: 'follow'
    };

    console.log(options, url);

    return fetch(url, options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const token = jwt.sign({ gandi_access_token: data.access_token }, process.env.JWT_SECRET, { expiresIn: '1h' })
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
}
