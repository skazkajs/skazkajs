const debug = require('debug')('skazka:server:response:index');

const moduleBuilder = require('@skazka/server-module');

const Response = require('./response');

debug('Response module created');

module.exports = moduleBuilder(async (context) => {
  debug('Creating response');

  const response = new Response(context);

  return context
    .set('response', response.send.bind(response))
    .set('json', response.sendJSON.bind(response))
    .set('setHeader', response.setHeader.bind(response))
    .set('redirect', response.redirect.bind(response));
});
