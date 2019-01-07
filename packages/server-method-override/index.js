const debug = require('debug')('skazka:server:cors');

const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const methodOverride = require('method-override');

const setMethod = (context) => {
  const { originalMethod, method } = context.get('req');

  const request = context.get('request');

  if (request) {
    request.set('method', method, true).set('originalMethod', originalMethod);
  }

  return method;
};

module.exports = moduleBuilder(async (context, getter, options = {}) => {
  debug('Getter:', getter);
  debug('Options: %O', options);

  await express(context, methodOverride(getter, options));

  return setMethod(context);
});
