require('dotenv').config()
const functions = require('../shared/functions');
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

  const url = "https://" + GANDI_API_HOST + GANDI_API_VERSION + '/email/mailboxes/' + domain + "/" + mailboxId;
  let options = {
    method: 'GET',
    headers: {
      'Authorization': 'apiKey ' + GANDI_API_KEY,
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
