const debug = require('debug')('skazka:server:pg:index');

const moduleBuilder = require('@skazka/server-module');

const pool = require('./pool');

module.exports = moduleBuilder((context) => {
  debug('PostgreSQL client created');

  context.set('pg', pool);
});
