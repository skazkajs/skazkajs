const s3 = require('.');

/**
 * Params example:
 * const params = {
 *  Bucket: 's3_bucket_name',
 *  Key: '/full/path.json',
 *  Body: JSON.stringify(data),
 *  ContentType: 'application/json',
 *};
 */
const uploadFile = async (params) => s3.putObject(params).promise();

module.exports = uploadFile;
