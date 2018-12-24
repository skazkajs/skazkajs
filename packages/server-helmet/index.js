const debug = require('debug')('skazka:server:helmet');

const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const helmet = require('helmet');

module.exports = moduleBuilder((context, options = {}) => {
  debug('Options: %O', options);

  return express(context, helmet(options));
});
