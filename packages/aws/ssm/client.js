const { SSM } = require('aws-sdk');

const {
  isDev,
  getLocalhost,
  getSSMPort,
  getRegion,
  getAccessKeyId,
  getSecretAccessKey,
} = require('../helpers');

const options = (isDev() && {
  region: getRegion(),
  endpoint: `http://${getLocalhost()}:${getSSMPort()}`,
  accessKeyId: getAccessKeyId(),
  secretAccessKey: getSecretAccessKey(),
});

const ssm = new SSM(options);

module.exports = ssm;
