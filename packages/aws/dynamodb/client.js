const { DynamoDB } = require('aws-sdk');

const {
  isDev,
  getLocalhost,
  getDynamoDbPort,
  getRegion,
  getAccessKeyId,
  getSecretAccessKey,
} = require('../helpers');

const options = (isDev() && {
  region: getRegion(),
  endpoint: `http://${getLocalhost()}:${getDynamoDbPort()}`,
  accessKeyId: getAccessKeyId(),
  secretAccessKey: getSecretAccessKey(),
});

const dynamoDB = new DynamoDB(options);
const dynamoDBClient = new DynamoDB.DocumentClient(options);

module.exports = {
  dynamoDB,
  dynamoDBClient,
};
