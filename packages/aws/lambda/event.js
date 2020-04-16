const lambdaWrapper = require('./wrapper');

const { processRecursiveRows, processRowWrapper } = require('../helpers');

/**
 const eventHandler = require('@skazka/aws/lambda/event');
 const convert = require('@skazka/aws/dynamodb/convert');
 const createPool = require('@skazka/aws/pg/pool');

 const handler = async ({ dynamodb }, registry) => {
  const { oldData, newData } = convert(dynamodb);

  await registry.pool.save(oldData, newData);
};

 const wrapper = {
  useRegistry: async (registry) => {
    registry.pool = await createPool(); // eslint-disable-line

    return async () => {
      await registry.pool.end();
      delete registry.pool; // eslint-disable-line
    };
  },
};

 module.exports.handler = eventHandler(handler, { wrapper, retry });
 */
const eventHandler = (handler, options = {}) => async (event, context) => {
  const {
    wrapper = {},
    parallel = false,
  } = options;

  const processRow = processRowWrapper(
    handler,
    {
      throwError: wrapper.throwError,
      errorHandler: wrapper.errorHandler,
    },
  );

  const wrapperHandler = lambdaWrapper(async (eventData) => (
    parallel
      ? Promise.all(eventData.Records.map(processRow))
      : processRecursiveRows(processRow, eventData.Records)
  ), wrapper);

  return wrapperHandler(event, context);
};

module.exports = eventHandler;
