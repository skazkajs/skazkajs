/* istanbul ignore file */

const container = require('./container');
const dynamoDB = require('./dynamodb');
const env = require('./env');
const error = require('./error');
const handler = require('./handler');
const lambda = require('./lambda');
const mysql = require('./mysql');
const pg = require('./pg');
const s3 = require('./s3');
const ssm = require('./ssm');
const sns = require('./sns');
const ses = require('./ses');

module.exports = {
  container,
  dynamoDB,
  env,
  error,
  handler,
  lambda,
  mysql,
  pg,
  s3,
  ssm,
  sns,
  ses,
};
