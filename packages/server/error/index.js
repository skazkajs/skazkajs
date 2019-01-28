const debug = require('debug')('skazka:server:error');

const { STATUS_CODES } = require('http');

const moduleBuilder = require('@skazka/server-module');
const Response = require('@skazka/server-response/response');

module.exports = moduleBuilder(async (context, options = {}) => {
  debug('Running error handler...');

  debug('Options:', options);

  const {
    isJSON = false,
    hasUserError = true,
    hasServerError = true,
  } = options;

  if (isJSON) {
    debug('Setting json header...');
    debug('Header: "Content-Type: application/json"');

    context.res.setHeader('Content-Type', 'application/json');
  }

  if (hasUserError && !context.get('hasUserError')) {
    debug('Registering 404 error handler...');

    context.set('hasUserError', true);

    context.get('server').then(async (ctx) => {
      debug('Running 404 error handler...');

      const response = new Response(ctx);

      if (!response.isFinished()) {
        debug('Sending 404 error...');

        const statusCode = 404;
        debug('Status code:', statusCode);

        const message = STATUS_CODES[statusCode];
        debug('Message:', message);

        await response
          .send(isJSON ? { message } : message, statusCode)
          .catch(() => null);
      }
    });
  }

  if (hasServerError && !context.get('hasServerError')) {
    debug('Registering 500 error handler...');

    context.set('hasServerError', true);

    context.get('server').catch(async (err, ctx) => {
      debug('Running 500 error handler...');

      debug('Error:', err);

      const response = new Response(ctx);

      if (!response.isFinished()) {
        debug('Sending 500 error...');

        const statusCode = err.code && STATUS_CODES[err.code] ? err.code : 500;
        debug('Status code:', statusCode);

        const message = err.message || STATUS_CODES[statusCode];
        debug('Error message:', message);

        await response
          .send(isJSON ? { message } : message, statusCode)
          .catch(() => null);
      }
    });
  }
});
