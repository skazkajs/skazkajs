const client = require('./client');

const createBucket = async (name, options = {}) => (
  client.createBucket({ Bucket: name, ...options }).promise()
);

const deleteBucket = async (name) => (
  client.deleteBucket({ Bucket: name }).promise()
);

const uploadFile = async (name, path, body, contentType, options = {}) => client.putObject({
  Bucket: name,
  Key: path,
  Body: body,
  ContentType: contentType,
  ...options,
}).promise();

const downloadFile = async (name, path, options = {}) => (
  client.getObject({ Bucket: name, Key: path, ...options }).promise()
);

const deleteFile = async (name, path, options = {}) => client.deleteObject({
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
