const dotenv = require('dotenv')
const fs = require('fs')

if (fs.existsSync(".env")) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const functions = require('../shared/functions');
const fetch = require('node-fetch')
const { API_HOST, API_VERSION, JWT_SECRET, API_KEY } = process.env;

const wantedKeys = ['aliases', 'domain', 'address', 'id'];
const formatData = (data) => {
  return Object.keys(data)
    .filter(key => wantedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {})
}

exports.handler = async (event, context) => {
  let [domain, mailboxId] = event.path
    .replace(/\/\.netlify\/functions\/[^/]*\//, '')
    .replace("mailbox", "").split('/');

  if (event.httpMethod != "GET") {
    return { statusCode: 405, body: "Only GET authorized" };
  }

  if (domain === undefined || mailboxId === undefined) {
    return { statusCode: 400, body: "Bad request" };
  }

  const token = functions.getToken(event.headers);
  if (token === undefined || !functions.isValidToken(token, JWT_SECRET)) {
    return { statusCode: 401, body: "Invalid token" };
  }

  const url = "https://" + API_HOST + API_VERSION + '/email/mailboxes/' + domain + "/" + mailboxId;
  let options = {
    method: 'GET',
    headers: {
      'Authorization': 'apiKey ' + API_KEY,
    }
  }

  return fetch(url, options)
    .then(response => response.json())
    .then(data => {
      return ({
        statusCode: 200,
        body: JSON.stringify(formatData(data)),
        headers: {
          "Content-Type": "application/json"
        },
      })
    });
}
