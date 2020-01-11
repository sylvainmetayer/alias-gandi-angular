export function handler (event, context, callback) {
  console.log(context);
  console.log(event);
  callback(null, {
    statusCode: 200,
    body: "Hello, World"
  });
}
