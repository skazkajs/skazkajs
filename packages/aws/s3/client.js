const { S3 } = require('aws-sdk');

const {
  isDev,
  getLocalhost,
  getS3Port,
  getAccessKeyId,
  getSecretAccessKey,
} = require('../helpers');

const options = (isDev() && {
  endpoint: `http://${getLocalhost()}:${getS3Port()}`,
  accessKeyId: getAccessKeyId(),
  secretAccessKey: getSecretAccessKey(),
  s3ForcePathStyle: true,
});

const s3 = new S3(options);

module.exports = s3;
