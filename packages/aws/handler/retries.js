const retry = require('./retry');

const retries = (handlers, options) => async (...args) => (
  Promise.all(handlers.map((handler) => retry(handler, options)(...args)))
);

module.exports = retries;
