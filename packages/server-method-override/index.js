const debug = require('debug')('skazka:server:cors');

const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const methodOverride = require('method-override');

module.exports = moduleBuilder((context, getter, options = {}) => {
  debug('Getter:', getter);
  debug('Options: %O', options);

  return express(context, methodOverride(getter, options));
});
