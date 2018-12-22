const debug = require('debug')('skazka:server:mongoose:index');

const moduleBuilder = require('@skazka/server-module');

const mongoose = require('./mongoose');

module.exports = moduleBuilder((context) => {
  debug('Adding mongoose to context...');

  context.mongoose = mongoose; // eslint-disable-line
});
