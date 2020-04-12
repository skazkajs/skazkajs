const { proxy, createServer } = require('aws-serverless-express');

const server = require('@skazka/server-http');
const { isProduction, isTest } = require('@skazka/env');

const wrapper = require('./wrapper');

module.exports = (app, options) => {
  if (isProduction) {
    return wrapper(
      async (event, context) => proxy(
        createServer(app.resolve()),
        event,
        context,
        'PROMISE',
      ).promise,
      options,
    );
  }

  return isTest ? () => server.createHttpServer(app) : server.createHttpServer(app);
};
