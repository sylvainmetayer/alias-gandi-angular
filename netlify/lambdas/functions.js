require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const dotenv = require('dotenv')

module.exports = {
  isValidToken: function (token, secret) {
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return false;
    }
    return true;
  },
  getProviderName: function (token) {
    try {
      return jwt.decode(token);
    } catch (err) { }
    return null;
  },
  getToken: function (headers) {
    if (headers.authorization === undefined) {
      return null;
    }
    return headers.authorization.split(" ")[1]
  },
  loadEnv: function () {
    if (fs.existsSync(".env")) {
      const envConfig = dotenv.parse(fs.readFileSync('.env'))
      for (const k in envConfig) {
        process.env[k] = envConfig[k]
      }
    }
  }
}
