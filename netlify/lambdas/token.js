const functions = require('./functions/auth');
const gandi = require('./functions/gandi');

exports.handler = function (event, context, callback) {
  const regex = /(?:\/\.netlify\/functions\/|\/api\/)token\/(?<provider>.*)/gi;
  const { groups: { provider } } = regex.exec(event.path);


  if (event.httpMethod != "POST") {
    return callback(null, { statusCode: 405, body: "Only POST authorized" });
  }

  const body = JSON.parse(event.body);
  if (!Object.keys(body).includes("code")) {
    return callback(null, { statusCode: 400, body: "Missing code" });
  }

  switch (provider) {
    case "gandi":
      return gandi.getToken(body.code);
    default:
      return callback(null, { statusCode: 404, body: "Unknown provider" });
  }
}
