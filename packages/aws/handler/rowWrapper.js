const defaultErrorHandler = require('../error/defaultErrorHandler');

const factory = require('./factory');

const rowWrapper = factory(async (handler, options = {}, args) => {
  const {
    throwError = false,
    errorHandler = defaultErrorHandler,
  } = options;

  try {
    await handler(...args);
  } catch (error) {
    await errorHandler(error, error.payload || args);

    if (throwError) {
      throw error;
    }
  }
});

module.exports = rowWrapper;
