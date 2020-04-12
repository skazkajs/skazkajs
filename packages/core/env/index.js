const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const TEST = 'test';

const env = process.env.NODE_ENV || DEVELOPMENT;

const isProduction = env === PRODUCTION;
const isDevelopment = ![PRODUCTION, TEST].includes(env);
const isTest = env === TEST;

module.exports = {
  default: env,
  env,
  PRODUCTION,
  DEVELOPMENT,
  TEST,
  isProduction,
  isDevelopment,
  isTest,
};
