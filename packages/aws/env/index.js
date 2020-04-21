const STAGE_DEV = 'dev';
const STAGE_STAGING = 'staging';
const STAGE_TEST = 'test';
const STAGE_PRODUCTION = 'production';

const isOffline = () => !!process.env.IS_OFFLINE;

const getStage = () => {
  const { STAGE = STAGE_DEV } = process.env;

  return isOffline() ? STAGE_DEV : STAGE;
};

const isDev = () => getStage() === STAGE_DEV;
const isStaging = () => getStage() === STAGE_STAGING;
const isTest = () => getStage() === STAGE_TEST;
const isProduction = () => getStage() === STAGE_PRODUCTION;

const getRegion = () => process.env.REGION || 'us-east-1';

const getLocalhost = () => process.env.LOCALSTACK_HOSTNAME || 'localhost';

const getAccessKeyId = () => process.env.AWS_ACCESS_KEY_ID || 'AWS_ACCESS_KEY_ID';
const getSecretAccessKey = () => process.env.AWS_SECRET_ACCESS_KEY || 'AWS_SECRET_ACCESS_KEY';

module.exports = {
  isOffline,
  getStage,
  isDev,
  isStaging,
  isTest,
  isProduction,
  getRegion,
  getLocalhost,
  getAccessKeyId,
  getSecretAccessKey,
};
