const { Lambda } = require('aws-sdk');

const lambdaWrapper = require('./wrapper');

const {
  processRecursiveRows,
  processRowWrapper,
  getRegion,
  LAMBDA_SMOKE_TEST_EVENT,
} = require('../helpers');

const lambda = new Lambda({ region: getRegion() });

const getNames = async () => {
  const names = [];

  const getNextNames = async (iteration = 0, Marker) => {
    const list = await lambda.listFunctions({ Marker }).promise();

    names.push(...list.Functions.map(({ FunctionName }) => FunctionName));

    if (list.NextMarker) {
      await getNextNames(iteration + 1, list.NextMarker);
    }
  };

  await getNextNames();

  return names.sort();
};

/**
 const smokeHandler = require('@skazka/aws/lambda/smoke');

 const wrapper = {
  smokeEvent: { test: true },
  defaultSmokeTestHandler: async (event, context) => {
    return { status: 'success' };
  };
 };

 const nameFilter = (names = []) => names.filter((name) => name.includes('production'));

 module.exports.handler = proxyHandler({ nameFilter, wrapper });
 */
const smokeHandler = (options = {}) => async (event, context) => {
  const {
    wrapper = {},
    nameFilter = (names = []) => names,
  } = options;

  const processRow = processRowWrapper(
    async (FunctionName) => lambda.invoke({
      FunctionName,
      Payload: (wrapper.smokeEvent || LAMBDA_SMOKE_TEST_EVENT),
    }).promise(),
    {
      throwError: wrapper.throwError,
      errorHandler: wrapper.errorHandler,
    },
  );

  const wrapperHandler = lambdaWrapper(
    async () => processRecursiveRows(processRow, nameFilter(await getNames())),
    wrapper,
  );

  return wrapperHandler(event, context);
};

module.exports = smokeHandler;
