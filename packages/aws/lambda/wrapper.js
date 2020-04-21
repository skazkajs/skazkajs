const factory = require('../handler/factory');

const { defaultSmokeHandler, isSmokeEvent, RESPONSE } = require('../handler/smoke');

const defaultErrorHandler = require('../error/defaultErrorHandler');

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
const wrapper = factory(async (handler, options = {}, args) => {
  const {
    throwError = false,
    errorHandler = defaultErrorHandler,
    smokeHandler = defaultSmokeHandler,
    callbackWaitsForEmptyEventLoop = false,
    useRegistry,
  } = options;

  const [event = {}, context = {}] = args;

  context.callbackWaitsForEmptyEventLoop = callbackWaitsForEmptyEventLoop; // eslint-disable-line

  let response;

  const registry = {};
  let clearRegistry;

  try {
    if (isSmokeEvent(event) && smokeHandler) {
      response = await smokeHandler(event, context);
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

  return response || RESPONSE;
});

module.exports = wrapper;
