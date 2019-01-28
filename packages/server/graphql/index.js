const debug = require('debug')('skazka:server:graphql');

const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const graphqlHTTP = require('express-graphql');

module.exports = moduleBuilder((context, options = {}) => {
  debug('GraphQL module created');
  debug('Options: %O', options);

  return express(context, graphqlHTTP(options));
});
