const { STATUS_CODES } = require('http');

const moduleBuilder = require('@skazka/server-module');

module.exports = moduleBuilder(async (context, logger = console) => {
  if (!(logger.warn && logger.error)) {
    throw new Error('Logger doesn\'t have "warn" and "error" methods!');
  }

  if (!context.get('logger')) {
    context.set('logger', logger);
  }

  if (!context.get('hasUserErrorLogger')) {
    context.set('hasUserErrorLogger', true);

    context.get('server').then(async (ctx) => {
      const message = STATUS_CODES[404];

      const { url } = ctx.get('req');

      ctx.get('logger').warn({ message, url });
    });
  }

  if (!context.get('hasServerErrorLogger')) {
    context.set('hasServerErrorLogger', true);

    context.get('server').catch(async (err, ctx) => {
      const { message, stack } = err;

      const { url } = ctx.get('req');

      ctx.get('logger').error({ message, url, stack });
    });
  }
});
