const debug = require('debug')('skazka:server:helmet');

const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const helmet = require('helmet');

const helmetModule = moduleBuilder((context, options = {}) => {
  debug('Options: %O', options);

  return express(context, helmet(options));
});

Object.keys(helmet).forEach((key) => {
  debug('Helmet key:', key);

  helmetModule[key] = moduleBuilder((context, options = {}) => {
    debug('Options: %O', options);

    return express(context, helmet[key](options));
  });
});

module.exports = helmetModule;
