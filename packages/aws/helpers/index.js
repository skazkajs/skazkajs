const getRegion = () => process.env.REGION || 'us-east-1';

const isOffline = () => !!process.env.IS_OFFLINE;

const getLocalhost = (defaultHost = '192.168.0.1') => (
  process.env.LOCALSTACK_HOSTNAME ? defaultHost : 'localhost'
);

const STAGE_DEV = 'dev';
const STAGE_STAGING = 'staging';
const STAGE_TEST = 'test';
const STAGE_PRODUCTION = 'production';

const getStage = () => {
  const { STAGE = STAGE_DEV } = process.env;

  return isOffline() ? STAGE_DEV : STAGE;
};

const isDev = () => getStage() === STAGE_DEV;
const isStaging = () => getStage() === STAGE_STAGING;
const isTest = () => getStage() === STAGE_TEST;
const isProduction = () => getStage() === STAGE_PRODUCTION;

const LAMBDA_RESPONSE = { status: 'success' };

const LAMBDA_SMOKE_TEST_EVENT = { isSmokeTest: true };

const defaultSmokeTestHandler = async (event, context) => {
  console.log(event, context); // eslint-disable-line

  return LAMBDA_RESPONSE;
};

const defaultErrorHandler = async (error, payload = null) => {
  console.error(error, payload); // eslint-disable-line

  return LAMBDA_RESPONSE;
};

const createError = (message, payload = null) => {
  const error = new Error(message);

  error.payload = payload;

  return error;
};

const processRecursiveRows = async (processRow, list, index = 0) => {
  const row = list[index];

  if (row) {
    await processRow(row);

    await processRecursiveRows(processRow, list, index + 1);
  }
};

const pause = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retry = async (callback, options = {}) => {
  const defaultOptions = {
    count: 0,
    timeout: 0,
    errorHandler: defaultErrorHandler,
  };

  const { count, timeout, errorHandler } = { ...defaultOptions, options };

  const run = async (attempt = count) => {
    try {
      return await callback();
    } catch (error) {
      await errorHandler(error, attempt);

      if (attempt) {
        await pause(timeout);

        return run(attempt - 1);
      }

      throw error;
    }
  };

  return run();
};

const retries = async (handlers, options) => Promise.all(handlers.map((handler) => retry(handler, options))); // eslint-disable-line

const processRowWrapper = (handler, options = {}) => async (...args) => {
  const {
    throwError = false,
    errorHandler = defaultErrorHandler,
    retry: retryOptions = {},
  } = options;

  try {
    await retry(
      async () => handler(...args),
      retryOptions,
    );
  } catch (error) {
    await errorHandler(error, error.payload || args);

    if (throwError) {
      throw error;
    }
  }
};

const compareSimpleObjects = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const clearDataForDynamoDB = (data) => JSON.parse(JSON.stringify(data).replace(/:""/g, ':null'));

const DYNAMODB_PORT = '4569';
const getDynamoDbPort = () => DYNAMODB_PORT;

const S3_PORT = '4572';
const getS3Port = () => S3_PORT;

const getAccessKeyId = () => process.env.AWS_ACCESS_KEY_ID || 'AWS_ACCESS_KEY_ID';
const getSecretAccessKey = () => process.env.AWS_SECRET_ACCESS_KEY || 'AWS_SECRET_ACCESS_KEY';

module.exports = {
  getRegion,
  isOffline,
  getLocalhost,
  STAGE_DEV,
  STAGE_STAGING,
  STAGE_TEST,
  STAGE_PRODUCTION,
  getStage,
  isDev,
  isStaging,
  isTest,
  isProduction,
  LAMBDA_RESPONSE,
  LAMBDA_SMOKE_TEST_EVENT,
  defaultSmokeTestHandler,
  defaultErrorHandler,
  createError,
  processRecursiveRows,
  processRowWrapper,
  pause,
  retry,
  retries,
  compareSimpleObjects,
  clearDataForDynamoDB,
  DYNAMODB_PORT,
  getDynamoDbPort,
  S3_PORT,
  getS3Port,
  getAccessKeyId,
  getSecretAccessKey,
};
