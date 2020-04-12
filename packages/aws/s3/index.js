/* istanbul ignore file */

const s3 = require('./client');
const uploadFile = require('./uploadFile');

module.exports = {
  s3,
  uploadFile,
};
