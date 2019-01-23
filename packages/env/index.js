const PRODUCTION = 'production';
const DEVELOPMENT = 'development';
const TEST = 'test';

const env = process.env.NODE_ENV;

const isProduction = env === PRODUCTION;
const isDevelopment = ![PRODUCTION, TEST].includes(env);
const isTest = env === TEST;

export {
  env as default,
  env,
  PRODUCTION,
  DEVELOPMENT,
  TEST,
  isProduction,
  isDevelopment,
  isTest,
};
