require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  isValidToken: function (token, secret) {
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return false;
    }
    return true;
  },
  getToken: function (headers) {
    if (headers.authorization === undefined) {
      return null;
    }
    return headers.authorization.split(" ")[1]
  }
}
