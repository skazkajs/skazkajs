const moduleBuilder = require('@skazka/server-module');

const pool = require('./pool');

module.exports = moduleBuilder(async (context) => {
  context.set('mysql', pool);
});
