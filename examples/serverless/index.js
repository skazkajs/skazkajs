const awsServerlessExpress = require('aws-serverless-express');

const app = require('./app');

module.exports.handler = (event, context) => awsServerlessExpress.proxy(
  awsServerlessExpress.createServer(app.resolve()),
  event,
  context,
);
