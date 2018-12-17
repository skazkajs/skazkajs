export const PRODUCTION = 'production';
export const DEVELOPMENT = 'development';
export const TEST = 'test';

const env = process.env.NODE_ENV;

export const isProduction = env === PRODUCTION;
export const isDevelopment = ![PRODUCTION, TEST].includes(env);
export const isTest = env === TEST;

export default env;
