const debug = require('debug')('skazka:server:error');

const { STATUS_CODES } = require('http');

const moduleBuilder = require('@skazka/server-module');

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

  if (hasUserError && !context.app.hasUserError) {
    debug('Registering 404 error handler...');

    context.app.hasUserError = true; // eslint-disable-line

    context.app.then(async (ctx) => {
      debug('Running 404 error handler...');

      if (!ctx.res.finished) {
        debug('Sending 404 error...');

        ctx.res.statusCode = 404;
        debug('Status code:', 404);

        const message = STATUS_CODES[404];
        debug('Message:', message);

        if (isJSON) {
          ctx.res.end(JSON.stringify({ message }));
        } else {
          ctx.res.end(message);
        }
      }
    });
  }

  if (hasServerError && !context.app.hasServerError) {
    debug('Registering 500 error handler...');

    context.app.hasServerError = true; // eslint-disable-line

    context.app.catch(async (err, ctx) => {
      debug('Running 500 error handler...');

      debug('Error:', err);

      if (!ctx.res.finished) {
        debug('Sending 500 error...');

        const statusCode = err.code && STATUS_CODES[err.code] ? err.code : 500;
        debug('Status code:', statusCode);

        const message = err.message || STATUS_CODES[statusCode];
        debug('Error message:', message);

        ctx.res.statusCode = statusCode;

        if (isJSON) {
          ctx.res.end(JSON.stringify({ message }));
        } else {
          ctx.res.end(message);
        }
      }
    });
  }
});
