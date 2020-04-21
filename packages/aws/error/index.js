/* istanbul ignore file */

const createError = require('./createError');
const defaultErrorHandler = require('./defaultErrorHandler');
const slack = require('./slack');

module.exports = {
  createError,
  defaultErrorHandler,
  slack,
};
