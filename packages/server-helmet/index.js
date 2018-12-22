const debug = require('debug')('skazka:server:helmet');

const wrapper = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const helmet = require('helmet');

module.exports = moduleBuilder((context, options = {}) => {
  debug('Options: %O', options);

  return wrapper(context, helmet(options));
});
