const debug = require('debug')('skazka:server:cors');

const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const cors = require('cors');

module.exports = moduleBuilder((context, options = {}) => {
  debug('Options: %O', options);

  return express(context, cors(options));
});
