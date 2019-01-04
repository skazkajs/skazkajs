const debug = require('debug')('skazka:server:spa');

const fs = require('fs');
const util = require('util');
const path = require('path');

const stat = util.promisify(fs.stat);

module.exports = ({ root, index = 'index.html' }) => async (context) => {
  debug('Server spa');

  debug('root:', root);
  debug('index:', index);

  const file = path.resolve(root, index);

  try {
    debug('Checking file existing');
    await stat(file);
  } catch (err) {
    debug('File does not exist:');
    debug(err);

    err.code = 404;

    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    debug('Setting no cache headers');

    context.res.setHeader('Surrogate-Control', 'no-store');
    context.res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    context.res.setHeader('Pragma', 'no-cache');
    context.res.setHeader('Expires', '0');
    context.res.setHeader('Content-Type', 'text/html;charset=UTF-8');

    debug('Sending file');

    fs.createReadStream(file)
      .pipe(context.res)
      .on('error', reject)
      .on('close', reject)
      .on('finish', reject);
  });
};
