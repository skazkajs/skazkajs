const debug = require('debug')('skazka:server:cookie');

const cookie = require('cookie');

const moduleBuilder = require('@skazka/server-module');

module.exports = moduleBuilder((context) => {
  debug('Cookie parser');

  const req = context.get('req');

  debug('Headers: %O', req.headers);
  debug('Cookies: %O', req.headers.cookie);

  let cookies = {};

  try {
    cookies = cookie.parse(req.headers.cookie);

    debug('Request cookies:', cookies);
  } catch (error) {
    debug('Error:', error);
  }

  const request = context.get('request');

  if (request) {
    request.set('cookies', cookies);
  }

  return cookies;
});
