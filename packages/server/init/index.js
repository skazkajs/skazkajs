const moduleBuilder = require('@skazka/server-module');

const cookiesModule = require('@skazka/server-cookies');
const errorModule = require('@skazka/server-error');
const helmetModule = require('@skazka/server-helmet');
const loggerModule = require('@skazka/server-logger');
const requestModule = require('@skazka/server-request');
const responseModule = require('@skazka/server-response');

const init = moduleBuilder(async (context, options = {}) => {
  const {
    cookies = true,
    error = true,
    helmet = true,
    logger = true,
    request = true,
    response = true,
  } = options;

  if (request) {
    await requestModule(context);
  }

  if (response) {
    await responseModule(context);
  }

  if (logger) {
    await loggerModule(context, typeof logger === 'boolean' ? undefined : logger);
  }

  if (error) {
    await errorModule(context, typeof error === 'boolean' ? undefined : error);
  }

  if (cookies) {
    await cookiesModule(context);
  }

  if (helmet) {
    await helmetModule(context, typeof helmet === 'boolean' ? undefined : helmet);
  }
});

module.exports = init;
