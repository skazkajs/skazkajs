const debug = require('debug')('skazka:server:redis:index');

const moduleBuilder = require('@skazka/server-module');

const redis = require('./redis');

module.exports = moduleBuilder((context) => {
  debug('Redis created');

  context.redis = redis; // eslint-disable-line
});
