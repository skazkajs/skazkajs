const debug = require('debug')('skazka:server:mysql:index');

const moduleBuilder = require('@skazka/server-module');

const pool = require('./pool');

module.exports = moduleBuilder(async (context) => {
  debug('MySQL created');

  context.set('mysql', pool);
});
