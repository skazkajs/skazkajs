const cookie = require('cookie');

const moduleBuilder = require('@skazka/server-module');

module.exports = moduleBuilder((context) => {
  const req = context.get('req');

  let cookies = {};

  try {
    cookies = cookie.parse(req.headers.cookie);
  } catch (error) {} // eslint-disable-line

  const request = context.get('request');

  if (request) {
    request.set('cookies', cookies);
  }

  return cookies;
});
