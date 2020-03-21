"use strict";
require("dotenv").config();
var jwt = require("jsonwebtoken");
var fs = require("fs");
var dotenv = require('dotenv');
var JWT_SECRET = process.env.JWT_SECRET;
module.exports = {
    isValidToken: function (token) {
        if (token == undefined) {
            return false;
        }
        try {
            jwt.verify(token, JWT_SECRET);
        }
        catch (err) {
            return false;
        }
        return true;
    },
    getProviderName: function (token) {
        try {
            return jwt.decode(token);
        }
        catch (err) { }
        return null;
    },
    getToken: function (headers) {
        if (headers.authorization === undefined) {
            return null;
        }
        return headers.authorization.split(" ")[1];
    },
    loadEnv: function () {
        if (fs.existsSync(".env")) {
            var envConfig = dotenv.parse(fs.readFileSync('.env'));
            for (var k in envConfig) {
                process.env[k] = envConfig[k];
            }
        }
    }
};
//# sourceMappingURL=functions.js.map