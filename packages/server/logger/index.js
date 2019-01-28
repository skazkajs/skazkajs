const debug = require('debug')('skazka:server:logger');

const { STATUS_CODES } = require('http');

const moduleBuilder = require('@skazka/server-module');

module.exports = moduleBuilder(async (context, logger = console) => {
  debug('Logger creating...');

  if (!(logger.warn && logger.error)) {
    debug('Logger doesn\'t have "warn" and "error" methods!');

    throw new Error('Logger doesn\'t have "warn" and "error" methods!');
  }

  if (!context.get('logger')) {
    context.set('logger', logger);
  }

  if (!context.get('hasUserErrorLogger')) {
    debug('Registering user error logger...');

    context.set('hasUserErrorLogger', true);

    context.get('server').then(async (ctx) => {
      debug('Running user error logger...');

      const message = STATUS_CODES[404];
      debug('Message:', message);

      const { url } = ctx.get('req');
      debug('Url:', url);

      ctx.get('logger').warn({ message, url });
    });
  }

  if (!context.get('hasServerErrorLogger')) {
    debug('Registering server error logger...');

    context.set('hasServerErrorLogger', true);

    context.get('server').catch(async (err, ctx) => {
      debug('Running server error logger...');
      debug('Error:', err);

      const { message, stack } = err;
      debug('Message:', message);
      debug('Stack:', stack);

      const { url } = ctx.get('req');
      debug('Url:', url);

      debug('Logging error...');
      ctx.get('logger').error({ message, url, stack });
    });
  }
});
