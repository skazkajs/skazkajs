const {
  LAMBDA_RESPONSE,
  LAMBDA_SMOKE_TEST_EVENT,
  compareSimpleObjects,
  defaultErrorHandler,
  defaultSmokeTestHandler,
} = require('../helpers');

/**
 * useRegistry = async (registry) => {
 *   registry.pool = await ....;
 *
 *   return async () => {
 *     await registry.pool.end();
 *     delete registry.pool;
 *   };
 * }
 * Main handler:
 * async (event, context, registry) => {
 *   await registry.pool.query(...);
 * }
 */
const wrapper = (handler, options = {}) => async (event = {}, context = {}) => {
  const {
    throwError = false,
    errorHandler = defaultErrorHandler,
    smokeTestHandler = defaultSmokeTestHandler,
    callbackWaitsForEmptyEventLoop = false,
    useRegistry,
    smokeEvent = LAMBDA_SMOKE_TEST_EVENT,
  } = options;

  context.callbackWaitsForEmptyEventLoop = callbackWaitsForEmptyEventLoop; // eslint-disable-line

  let response;

  const registry = {};
  let clearRegistry;

  try {
    if (event && compareSimpleObjects(event, smokeEvent) && smokeTestHandler) {
      response = await smokeTestHandler(event, context);
    } else {
      if (useRegistry) {
        clearRegistry = await useRegistry(registry);
      }

      response = await handler(event, context, registry);

      if (clearRegistry) {
        await clearRegistry();
      }
    }
  } catch (error) {
    if (clearRegistry) {
      await clearRegistry();
    }

    response = await errorHandler(error, error.payload || event);

    if (throwError) {
      throw error;
    }
  }

  return response || LAMBDA_RESPONSE;
};

module.exports = wrapper;
