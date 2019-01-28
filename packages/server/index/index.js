const debug = require('debug')('skakza:server:index');
const fs = require('fs');
const util = require('util');
const path = require('path');

const moduleBuilder = require('@skazka/server-module');
const Response = require('@skazka/server-response/response');

const stat = util.promisify(fs.stat);

module.exports = moduleBuilder(async (context, options = {}) => {
  debug('Server index');

  const { root, index = 'index.html', url = '/' } = options;

  if (!root) {
    throw new Error('The "root" parameter is required!');
  }

  debug('root:', root);
  debug('index:', index);
  debug('url:', url);

  if (context.get('req').url === `${url}${index}`) {
    debug(`Redirecting from "${url}${index}" to "${url}"`);
    const response = new Response(context);

    return response.redirect(url);
  }

  if (context.get('req').url === url) {
    debug('Serving index file');
    const file = path.resolve(root, index);

    try {
      debug('Checking file existing');
      await stat(file);
    } catch (err) {
      debug('File does not exist:');
      debug(err);

      return Promise.resolve(context);
    }

    return new Promise((resolve, reject) => {
      debug('Setting no cache headers');

      context.get('res').setHeader('Surrogate-Control', 'no-store');
      context.get('res').setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      context.get('res').setHeader('Pragma', 'no-cache');
      context.get('res').setHeader('Expires', '0');
      context.get('res').setHeader('Content-Type', 'text/html;charset=UTF-8');

      debug('Sending file');

      fs.createReadStream(file)
        .pipe(context.get('res'))
        .on('error', reject)
        .on('close', reject)
        .on('finish', reject);
    });
  }

  return Promise.resolve(context);
});
