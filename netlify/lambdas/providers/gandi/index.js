const functions = require("../../functions");
const fetch = require('node-fetch')
const { GANDI_API_HOST, GANDI_API_VERSION, GANDI_API_KEY } = process.env;

const BASE_URL = "https://" + GANDI_API_HOST + GANDI_API_VERSION;
functions.loadEnv();

const getAuthorizationHeaders = function () {
  return {
    'Authorization': 'apiKey ' + GANDI_API_KEY,
  };
};

const getRequestsOptions = function (method = 'GET') {
  return {
    method: method,
    headers: getAuthorizationHeaders()
  };
};

module.exports = {
  getDomains: function () {
    let url = BASE_URL + '/domain/domains';
    return fetch(url, getRequestsOptions())
      .then(response => response.json())
      .then((data) => {
        return {
          statusCode: 200,
          body: JSON.stringify(data.map(domain => domain.fqdn)),
          headers: {
            "Content-Type": "application/json"
          },
        }
      })
      .catch(err => {
        console.error(err);
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "An error occured" })
        }
      })
  }
}
