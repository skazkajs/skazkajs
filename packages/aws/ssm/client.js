const { SSM } = require('aws-sdk');

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

const ssm = new SSM(options);

module.exports = ssm;
