const { S3 } = require('aws-sdk');

const {
  isDev,
  getLocalhost,
  getAccessKeyId,
  getSecretAccessKey,
} = require('../env');

const port = require('./port');

const options = (isDev() && {
  endpoint: `http://${getLocalhost()}:${port}`,
  accessKeyId: getAccessKeyId(),
  secretAccessKey: getSecretAccessKey(),
  s3ForcePathStyle: true,
});

const s3 = new S3(options);

module.exports = s3;
