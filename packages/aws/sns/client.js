const { SNS } = require('aws-sdk');

const {
  isDev,
  getLocalhost,
  getRegion,
  getAccessKeyId,
  getSecretAccessKey,
} = require('../env');

const port = require('./port');

const options = (isDev() && {
  endpoint: `http://${getLocalhost()}:${port}`,
  region: getRegion(),
  accessKeyId: getAccessKeyId(),
  secretAccessKey: getSecretAccessKey(),
});

const client = new SNS(options);

module.exports = client;
