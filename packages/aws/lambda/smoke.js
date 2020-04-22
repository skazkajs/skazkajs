const { Lambda } = require('aws-sdk');

const lambdaWrapper = require('./wrapper');

const recursive = require('../handler/recursive');
const rowWrapper = require('../handler/wrapper');
const { SMOKE_EVENT } = require('../handler/smoke');
const { getRegion } = require('../env');


const lambda = new Lambda({ region: getRegion() });

const getNames = async () => {
  const names = [];

  const getNextNames = async (Marker) => {
    const list = await lambda.listFunctions({ Marker }).promise();

    names.push(...list.Functions.map(({ FunctionName }) => FunctionName));

    if (list.NextMarker) {
      await getNextNames(list.NextMarker);
    }
  };

  await getNextNames();

  return names.sort();
};

/**
 const smokeHandler = require('@skazka/aws/lambda/smoke');

 const nameFilter = (names = []) => names.filter((name) => name.includes('production'));

 module.exports.handler = proxyHandler({ nameFilter });
 */
const smokeHandler = (options = {}) => async (event, context) => {
  const {
    wrapper = {},
    nameFilter = (names = []) => names,
  } = options;

  const processRow = rowWrapper(
    async (FunctionName) => lambda.invoke({
      FunctionName,
      Payload: SMOKE_EVENT,
    }).promise(),
    {
      throwError: wrapper.throwError,
      errorHandler: wrapper.errorHandler,
    },
  );

  const wrapperHandler = lambdaWrapper(
    async () => recursive(processRow, nameFilter(await getNames())),
    wrapper,
  );

  return wrapperHandler(event, context);
};

module.exports = smokeHandler;
