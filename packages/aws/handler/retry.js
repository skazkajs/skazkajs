const pause = require('promise-pause-timeout');

const factory = require('./factory');

const defaultErrorHandler = require('../error/defaultErrorHandler');

const retry = factory(async (handler, options, args) => {
  const defaultOptions = {
    count: 0,
    timeout: 0,
    errorHandler: defaultErrorHandler,
  };

  const { count, timeout, errorHandler } = { ...defaultOptions, ...(options || {}) };

  const run = async (attempt = count) => {
    try {
      return await handler(...args);
    } catch (error) {
      try {
        await errorHandler(error, attempt);
      } catch (err) {
        await defaultErrorHandler(error, err);
      }

      if (attempt) {
        await pause(timeout);

        return run(attempt - 1);
      }

      throw error;
    }
  };

  return run();
});

module.exports = retry;
