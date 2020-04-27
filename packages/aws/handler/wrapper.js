const defaultErrorHandler = require('../error/defaultErrorHandler');

const factory = require('./factory');

const wrapper = factory(async (handler, options, args) => {
  const {
    throwError = false,
    errorHandler = defaultErrorHandler,
  } = (options || {});

  let result;

  try {
    result = await handler(...args);
  } catch (error) {
    try {
      await errorHandler(error, error.payload || args);
    } catch (err) {
      await defaultErrorHandler(error, err);
    }

    if (throwError) {
      throw error;
    }
  }

  return result;
});

module.exports = wrapper;
