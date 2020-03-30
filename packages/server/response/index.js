const moduleBuilder = require('@skazka/server-module');

const Response = require('./response');

module.exports = moduleBuilder(async (context) => {
  const response = new Response(context);

  return context
    .set('response', response.send.bind(response))
    .set('json', response.sendJSON.bind(response))
    .set('setHeader', response.setHeader.bind(response))
    .set('redirect', response.redirect.bind(response));
});
