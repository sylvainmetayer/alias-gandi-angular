require('dotenv').config()
const functions = require('../shared/functions');
const fetch = require('node-fetch')
const { GANDI_API_HOST, GANDI_API_VERSION, JWT_SECRET, GANDI_API_KEY } = process.env;

exports.handler = async (event, context) => {
  if (event.httpMethod != "GET") {
    return { statusCode: 405, body: "Only GET authorized" };
  }

  const token = functions.getToken(event.headers);
  if (token === undefined || !functions.isValidToken(token, JWT_SECRET)) {
    return { statusCode: 401, body: "Invalid token" };
  }

  const url = "https://" + GANDI_API_HOST + GANDI_API_VERSION + '/domain/domains';
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
        body: JSON.stringify(data.map(domain => domain.fqdn)),
        headers: {
          "Content-Type": "application/json"
        },
      })
    });
}
