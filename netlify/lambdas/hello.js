exports.handler = function (event, context, callback) {
  console.log(context);
  console.log(event);
  callback(null, {
    statusCode: 200,
    body: "Hello, World " + process.env.API_KEY
  });
}
