const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const graphqlHTTP = require('express-graphql');

module.exports = moduleBuilder((context, options = {}) => express(context, graphqlHTTP(options)));
