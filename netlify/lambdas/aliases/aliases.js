require('dotenv').config()
const functions = require('../shared/functions');
const fetch = require('node-fetch')
const { GANDI_API_HOST, GANDI_API_VERSION, JWT_SECRET, GANDI_API_KEY } = process.env;

exports.handler = async (event, context) => {
  let [domain, mailboxId] = event.path
    .replace(/\/\.netlify\/functions\/[^/]*\//, '')
    .replace("mailbox", "").split('/');

  if (event.httpMethod != "POST") {
    return { statusCode: 405, body: "Only POST authorized" };
  }

  if (domain === undefined || mailboxId === undefined) {
    return { statusCode: 400, body: "Bad request" };
  }

  const token = functions.getToken(event.headers);
  if (token === undefined || !functions.isValidToken(token, JWT_SECRET)) {
    return { statusCode: 401, body: "Invalid token" };
  }

  const aliases = JSON.parse(event.body).aliases || []
  const url = "https://" + GANDI_API_HOST + GANDI_API_VERSION + '/email/mailboxes/' + domain + "/" + mailboxId;
  let options = {
    method: 'PATCH',
    headers: {
      'Authorization': 'apiKey ' + GANDI_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "aliases": aliases
    })
  }

  return fetch(url, options)
    .then(response => response.json())
    .then(data => {
      return ({
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        },
      })
    }).catch(err => {
      console.error(err);
      return { statusCode: err.statusCode || 500, body: "An error occured" }
    });
}
