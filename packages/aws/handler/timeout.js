const pause = require('promise-pause-timeout');

const factory = require('./factory');

const defaultErrorHandler = require('../error/defaultErrorHandler');

const timeout = factory(async (handler, options = {}, args) => {
  const {
    seconds,
    errorHandler = defaultErrorHandler,
  } = options;

  try {
    return await Promise.race([
      pause(seconds * 1000).then(() => Promise.reject(new Error(`Timeout: ${seconds} seconds!`))),
      handler(...args),
    ]);
  } catch (error) {
    await errorHandler(error, args);

    throw error;
  }
});

module.exports = timeout;
