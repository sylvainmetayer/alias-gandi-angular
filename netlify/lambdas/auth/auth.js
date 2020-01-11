require('dotenv').config()
const jwt = require("jsonwebtoken");

console.log(process.cwd())

exports.handler = function (event, context, callback) {
  if (event.httpMethod != "POST") {
    return callback(null, { statusCode: 405, body: "Only POST authorized" });
  }

  console.log(process.env.LOGIN_PASSWORD);

  const body = JSON.parse(event.body);

  if (!Object.keys(body).includes("password") || body.password != process.env.LOGIN_PASSWORD) {
    return callback(null, { statusCode: 401, body: "Bad credentials" });
  }

  // Valid password ! Let's generate a JWT token
  callback(null, {
    statusCode: 401,
    body: "Hello, World " + process.env.API_KEY
  });
}
