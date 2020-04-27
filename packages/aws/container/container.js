const factory = require('../handler/factory');

const defaultErrorHandler = require('../error/defaultErrorHandler');

const container = factory(async (handler, options) => {
  const {
    errorHandler = defaultErrorHandler,
    useRegistry,
  } = (options || {});

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

    process.exit(0);
  } catch (error) {
    try {
      if (clearRegistry) {
        await clearRegistry();
      }
    } catch (err) {
      await defaultErrorHandler(error, err);
    }

    try {
      await errorHandler(error, error.payload);
    } catch (err) {
      await defaultErrorHandler(error, err);
    }

    process.exit(1);
  }
});

module.exports = container;
