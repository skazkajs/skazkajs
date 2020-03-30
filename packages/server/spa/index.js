const fs = require('fs');
const util = require('util');
const path = require('path');

const moduleBuilder = require('@skazka/server-module');

const stat = util.promisify(fs.stat);

module.exports = moduleBuilder(async (context, options = {}) => {
  const { root, index = 'index.html' } = options;

  if (!root) {
    throw new Error('The "root" parameter is required!');
  }

  const file = path.resolve(root, index);

  try {
    await stat(file);
  } catch (err) {
    err.code = 404;

    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    context.get('res').setHeader('Surrogate-Control', 'no-store');
    context.get('res').setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    context.get('res').setHeader('Pragma', 'no-cache');
    context.get('res').setHeader('Expires', '0');
    context.get('res').setHeader('Content-Type', 'text/html;charset=UTF-8');

    fs.createReadStream(file)
      .pipe(context.get('res'))
      .on('error', reject)
      .on('close', reject)
      .on('finish', reject);
  });
});
