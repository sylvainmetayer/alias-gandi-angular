const dotenv = require('dotenv')
const fs = require('fs')

if (fs.existsSync(".env")) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

const functions = require('./functions');
const fetch = require('node-fetch')
const { GANDI_API_HOST, GANDI_API_VERSION, JWT_SECRET, GANDI_API_KEY } = process.env;

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
    .replace(/\/\api\//, '')
    .replace("mailbox", "").split('/');

  console.log(`Looking for aliases on ${domain} for id : ${mailboxId}`);

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

  const url = "https://" + GANDI_API_HOST + GANDI_API_VERSION + '/email/mailboxes/' + domain + "/" + mailboxId;

  let options = {
    method: 'GET',
    headers: {
      'Authorization': 'apiKey ' + GANDI_API_KEY,
    }
  }

  console.log(`Sent request on ${url} with ${JSON.stringify(options)}`);
  return fetch(url, options)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return ({
        statusCode: 200,
        body: JSON.stringify(formatData(data)),
        headers: {
          "Content-Type": "application/json"
        },
      })
    }).catch(err => console.error(err));
}
