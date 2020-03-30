const moduleBuilder = require('@skazka/server-module');

const pool = require('./pool');

module.exports = moduleBuilder((context) => {
  context.set('pg', pool);
});
