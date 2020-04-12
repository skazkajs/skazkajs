/* istanbul ignore file */

const s3 = require('./s3');
const ssm = require('./ssm');
const dynamoDB = require('./dynamodb');
const lambda = require('./lambda');
const helpers = require('./helpers');
const mysql = require('./mysql');
const pg = require('./pg');

module.exports = {
  s3,
  ssm,
  dynamoDB,
  lambda,
  helpers,
  mysql,
  pg,
};
