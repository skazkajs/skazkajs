const moduleBuilder = require('@skazka/server-module');

const mongoose = require('./mongoose');

module.exports = moduleBuilder((context) => {
  context.set('mongoose', mongoose);
});
