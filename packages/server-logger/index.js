const debug = require('debug')('skazka:server:logger');

const { STATUS_CODES } = require('http');

module.exports = (logger = console) => async (context) => {
  debug('Logger creating...');

  if (!(logger.warn && logger.error)) {
    debug('Logger doesn\'t have "warn" and "error" methods!');

    throw new Error('Logger doesn\'t have "warn" and "error" methods!');
  }

  context.logger = logger; // eslint-disable-line

  if (!context.app.hasUserErrorLogger) {
    debug('Registering user error logger...');

    context.app.hasUserErrorLogger = true; // eslint-disable-line

    context.app.then(async (ctx) => {
      debug('Running user error logger...');

      const message = STATUS_CODES[404];
      debug('Message:', message);

      const { url } = ctx.req;
      debug('Url:', url);

      ctx.logger.warn({ message, url });
    });
  }

  if (!context.app.hasServerErrorLogger) {
    debug('Registering server error logger...');

    context.app.hasServerErrorLogger = true; // eslint-disable-line

    context.app.catch(async (err, ctx) => {
      debug('Running server error logger...');
      debug('Error:', err);

      const { message, stack } = err;
      debug('Message:', message);
      debug('Stack:', stack);

      const { url } = ctx.req;
      debug('Url:', url);

      debug('Logging error...');
      ctx.logger.error({ message, url, stack });
    });
  }
};
