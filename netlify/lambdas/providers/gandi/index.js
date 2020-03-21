"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var functions = require("../../functions");
var fetch = require('node-fetch');
var _a = process.env, GANDI_API_HOST = _a.GANDI_API_HOST, GANDI_API_VERSION = _a.GANDI_API_VERSION, GANDI_API_KEY = _a.GANDI_API_KEY;
var BASE_URL = "https://" + GANDI_API_HOST + GANDI_API_VERSION;
functions.loadEnv();
var getAuthorizationHeaders = function () {
    return {
        'Authorization': 'apiKey ' + GANDI_API_KEY,
    };
};
var getRequestsOptions = function (method) {
    if (method === void 0) { method = 'GET'; }
    return {
        method: method,
        headers: getAuthorizationHeaders()
    };
};
var formatData = function (data, wantedKeys) {
    return Object.keys(data)
        .filter(function (key) { return wantedKeys.includes(key); })
        .reduce(function (obj, key) {
        obj[key] = data[key];
        return obj;
    }, {});
};
module.exports = {
    getDomains: function () {
        var url = BASE_URL + "/domain/domains";
        return fetch(url, getRequestsOptions())
            .then(function (response) { return response.json(); })
            .then(function (data) {
            return {
                statusCode: 200,
                body: JSON.stringify(data.map(function (domain) { return domain.fqdn; })),
                headers: {
                    "Content-Type": "application/json"
                },
            };
        })
            .catch(function (err) {
            console.error(err);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "An error occured" })
            };
        });
    },
    getMailboxes: function (domain) {
        var url = BASE_URL + "/email/mailboxes/" + domain;
        return fetch(url, getRequestsOptions())
            .then(function (response) {
            var json = response.json();
            json.then(function (data) { return console.log(data); });
            return json;
        })
            .then(function (data) {
            return ({
                statusCode: 200,
                body: JSON.stringify(data.map(function (mailbox) { return mailbox.id; })),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        });
    },
    getMailboxDetails: function (domain, mailboxId) {
        var url = BASE_URL + "/email/mailboxes/" + domain + "/" + mailboxId;
        var wantedKeys = ['aliases', 'domain', 'address', 'id'];
        return fetch(url, getRequestsOptions())
            .then(function (response) {
            var json = response.json();
            json.then(function (data) { return console.log(data); });
            return json;
        })
            .then(function (data) {
            return ({
                statusCode: 200,
                body: JSON.stringify(formatData(data, wantedKeys)),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }).catch(function (err) {
            console.error(err);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "An error occured" })
            };
        });
    },
    updateAliases: function (domain, mailboxId, aliases) {
        var url = BASE_URL + "/email/mailboxes/" + domain + "/" + mailboxId;
        var options = {
            method: 'PATCH',
            headers: __assign(__assign({}, getAuthorizationHeaders()), {
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "aliases": aliases
            })
        };
        return fetch(url, options)
            .then(function (response) { return response.json(); })
            .then(function (data) {
            return ({
                statusCode: 200,
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }).catch(function (err) {
            console.error(err);
            return { statusCode: err.statusCode || 500, body: "An error occured" };
        });
    }
};
//# sourceMappingURL=index.js.map