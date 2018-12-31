const debug = require('debug')('skazka:server:cookie');

const cookie = require('cookie');

const moduleBuilder = require('@skazka/server-module');

module.exports = moduleBuilder((context) => {
  debug('Cookie parser');

  context.request = context.request || {}; // eslint-disable-line

  debug('Headers: %O', context.req.headers);
  debug('Cookies: %O', context.req.headers.cookie);

  try {
    context.request.cookies = cookie.parse(context.req.headers.cookie); // eslint-disable-line

    debug('Request cookies:', context.request.cookies);
  } catch (error) {
    context.request.cookies = {}; // eslint-disable-line

    debug('Error:', error);
  }

  return Promise.resolve();
});
