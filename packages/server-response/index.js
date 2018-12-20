const debug = require('debug')('skazka:server:response:index');

const Response = require('./response');

debug('Response module created');

module.exports = () => async (ctx) => {
  debug('Creating response');

  ctx.response = new Response(ctx);
};
