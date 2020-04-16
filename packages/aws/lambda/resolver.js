const { defaultErrorHandler } = require('../helpers');

const resolver = (handler, options = {}) => async (...args) => {
  const {
    errorHandler = defaultErrorHandler,
    useRegistry,
    errorHandlerExceptions = [],
  } = options;

  let response;

  const registry = {};
  let clearRegistry;

  try {
    if (useRegistry) {
      clearRegistry = await useRegistry(registry);
    }

    response = await handler(registry, ...args);

    if (clearRegistry) {
      await clearRegistry();
    }

    return response;
  } catch (error) {
    if (clearRegistry) {
      await clearRegistry();
    }

    if (!errorHandlerExceptions.includes(error.message)) {
      await errorHandler(error, error.payload || args);
    }

    throw error;
  }
};

module.exports = resolver;