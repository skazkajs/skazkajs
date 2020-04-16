const { Lambda } = require('aws-sdk');

const lambdaWrapper = require('./wrapper');

const { processRecursiveRows, processRowWrapper, getRegion } = require('../helpers');

/**
 const proxyHandler = require('@skazka/aws/lambda/proxy');

 module.exports.handler = proxyHandler(['eventHandlerLambda1', 'eventHandlerLambda2']);
 */
const proxyHandler = (functionNames = [], options = {}) => async (event, context) => {
  const {
    wrapper = {},
    parallel = false,
    async = false,
  } = options;

  const lambda = new Lambda({ region: getRegion() });

  const processRow = (eventData) => processRowWrapper(
    async (functionName) => {
      if (async) {
        await lambda.invokeAsync({
          FunctionName: functionName,
          InvokeArgs: eventData,
        }).promise();
      } else {
        await lambda.invoke({
          FunctionName: functionName,
          Payload: eventData,
        }).promise();
      }
    },
    {
      throwError: wrapper.throwError,
      errorHandler: wrapper.errorHandler,
    },
  );

  const wrapperHandler = lambdaWrapper(async (eventData) => (
    parallel
      ? Promise.all(functionNames.map(processRow(eventData)))
      : processRecursiveRows(processRow(eventData), functionNames)
  ), wrapper);

  return wrapperHandler(event, context);
};

module.exports = proxyHandler;
