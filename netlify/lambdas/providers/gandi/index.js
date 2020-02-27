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

const formatData = (data, wantedKeys) => {
  return Object.keys(data)
    .filter(key => wantedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {})
}

module.exports = {
  getDomains: function () {
    let url = `${BASE_URL}/domain/domains`;
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
  },
  getMailboxes: function (domain) {
    let url = `${BASE_URL}/email/mailboxes/${domain}`;
    return fetch(url, getRequestsOptions())
      .then(response => {
        const json = response.json();
        json.then(data => console.log(data));
        return json;
      })
      .then(data => {
        return ({
          statusCode: 200,
          body: JSON.stringify(data.map(mailbox => mailbox.id)),
          headers: {
            "Content-Type": "application/json"
          },
        })
      });
  },
  getMailboxDetails: function (domain, mailboxId) {
    let url = `${BASE_URL}/email/mailboxes/${domain}/${mailboxId}`;
    const wantedKeys = ['aliases', 'domain', 'address', 'id'];
    return fetch(url, getRequestsOptions())
      .then(response => {
        const json = response.json();
        json.then(data => console.log(data));
        return json;
      })
      .then(data => {
        return ({
          statusCode: 200,
          body: JSON.stringify(formatData(data, wantedKeys)),
          headers: {
            "Content-Type": "application/json"
          },
        })
      }).catch(err => {
        console.error(err)
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "An error occured" })
        }
      });
  }
}
