const s3 = require('./client');

const createBucket = async (name, options = {}) => (
  s3.createBucket({ Bucket: name, ...options }).promise()
);

const deleteBucket = async (name) => (
  s3.deleteBucket({ Bucket: name }).promise()
);

const uploadFile = async (name, path, body, contentType, options = {}) => s3.putObject({
  Bucket: name,
  Key: path,
  Body: body,
  ContentType: contentType,
  ...options,
}).promise();

const downloadFile = async (name, path, options = {}) => (
  s3.getObject({ Bucket: name, Key: path, ...options }).promise()
);

const deleteFile = async (name, path, options = {}) => s3.deleteObject({
  Bucket: name,
  Key: path,
  ...options,
}).promise();

module.exports = {
  createBucket,
  deleteBucket,
  uploadFile,
  downloadFile,
  deleteFile,
};
