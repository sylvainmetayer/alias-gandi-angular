require('dotenv').config()
const functions = require('../shared/functions');
const fetch = require('node-fetch')
const { API_HOST, API_VERSION, JWT_SECRET, API_KEY } = process.env;

exports.handler = async (event, context) => {
  if (event.httpMethod != "GET") {
    return { statusCode: 405, body: "Only GET authorized" };
  }

  const token = functions.getToken(event.headers);
  if (token === undefined) {
    return { statusCode: 401, body: "Missing Authorization header" };
  }

  if (!functions.isValidToken(token, JWT_SECRET)) {
    return { statusCode: 401, body: "Invalid token" };
  }

  const url = "https://" + API_HOST + API_VERSION + '/domain/domains';
  let options = {
    // hostname: API_HOST,
    // port: 443,
    // path: API_VERSION + '/domain/domains',
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
        body: JSON.stringify(data.map(domain => domain.fqdn)),
        headers: {
          "Content-Type": "application/json"
        },
      })
    });
}
