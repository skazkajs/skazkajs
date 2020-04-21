const factory = require('../handler/factory');

const defaultErrorHandler = require('../error/defaultErrorHandler');

const container = factory(async (handler, options = {}) => {
  const {
    errorHandler = defaultErrorHandler,
    useRegistry,
  } = options;

  const registry = {};
  let clearRegistry;

  try {
    if (useRegistry) {
      clearRegistry = await useRegistry(registry);
    }

    await handler(registry);

    if (clearRegistry) {
      await clearRegistry();
    }
  } catch (error) {
    if (clearRegistry) {
      await clearRegistry();
    }

    await errorHandler(error, error.payload);
  }
});

module.exports = container;
