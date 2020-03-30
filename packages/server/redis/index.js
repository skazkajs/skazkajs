const moduleBuilder = require('@skazka/server-module');

const redis = require('./redis');

module.exports = moduleBuilder((context) => {
  context.set('redis', redis);
});
