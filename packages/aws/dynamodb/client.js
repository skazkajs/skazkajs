const { DynamoDB } = require('aws-sdk');

const {
  isDev,
  getLocalhost,
  getRegion,
  getAccessKeyId,
  getSecretAccessKey,
} = require('../env');

const port = require('./port');

const options = (isDev() && {
  region: getRegion(),
  endpoint: `http://${getLocalhost()}:${port}`,
  accessKeyId: getAccessKeyId(),
  secretAccessKey: getSecretAccessKey(),
});

const dynamoDB = new DynamoDB(options);
const dynamoDBClient = new DynamoDB.DocumentClient(options);

module.exports = {
  dynamoDB,
  dynamoDBClient,
};
