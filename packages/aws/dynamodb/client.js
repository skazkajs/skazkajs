const { DynamoDB } = require('aws-sdk');

const {
  isDev,
  getLocalhost,
  getDynamoDbPort,
  getRegion,
} = require('../helpers');

const options = (isDev() && {
  region: getRegion(),
  endpoint: `http://${getLocalhost()}:${getDynamoDbPort()}`,
});

const dynamoDB = new DynamoDB(options);
const dynamoDBClient = new DynamoDB.DocumentClient(options);

module.exports = {
  dynamoDB,
  dynamoDBClient,
};
