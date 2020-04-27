const factory = require('./factory');

const defaultErrorHandler = require('../error/defaultErrorHandler');

const resolver = factory(async (handler, options, args) => {
  const {
    errorHandler = defaultErrorHandler,
    useRegistry,
    errorHandlerExceptions = [],
  } = (options || {});

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
    try {
      if (clearRegistry) {
        await clearRegistry();
      }
    } catch (err) {
      await defaultErrorHandler(error, err);
    }

    try {
      if (!errorHandlerExceptions.includes(error.message)) {
        await errorHandler(error, error.payload || args);
      }
    } catch (err) {
      await defaultErrorHandler(error, err);
    }

    throw error;
  }
});

module.exports = resolver;
