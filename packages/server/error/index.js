const { STATUS_CODES } = require('http');

const moduleBuilder = require('@skazka/server-module');
const Response = require('@skazka/server-response/response');

module.exports = moduleBuilder(async (context, options = {}) => {
  const {
    isJSON = false,
    hasUserError = true,
    hasServerError = true,
  } = options;

  if (isJSON) {
    context.res.setHeader('Content-Type', 'application/json');
  }

  if (hasUserError && !context.get('hasUserError')) {
    context.set('hasUserError', true);

    context.get('server').then(async (ctx) => {
      const response = new Response(ctx);

      if (!response.isFinished()) {
        const statusCode = 404;
        const message = STATUS_CODES[statusCode];

        await response
          .send(isJSON ? { message } : message, statusCode)
          .catch(() => null);
      }
    });
  }

  if (hasServerError && !context.get('hasServerError')) {
    context.set('hasServerError', true);

    context.get('server').catch(async (err, ctx) => {
      const response = new Response(ctx);

      if (!response.isFinished()) {
        const statusCode = err.code && STATUS_CODES[err.code] ? err.code : 500;
        const message = err.message || STATUS_CODES[statusCode];

        await response
          .send(isJSON ? { message } : message, statusCode)
          .catch(() => null);
      }
    });
  }
});
