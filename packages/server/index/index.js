const fs = require('fs');
const util = require('util');
const path = require('path');

const moduleBuilder = require('@skazka/server-module');
const Response = require('@skazka/server-response/response');

const stat = util.promisify(fs.stat);

module.exports = moduleBuilder(async (context, options = {}) => {
  const { root, index = 'index.html', url = '/' } = options;

  if (!root) {
    throw new Error('The "root" parameter is required!');
  }

  if (context.get('req').url === `${url}${index}`) {
    const response = new Response(context);

    return response.redirect(url);
  }

  if (context.get('req').url === url) {
    const file = path.resolve(root, index);

    try {
      await stat(file);
    } catch (err) {
      return Promise.resolve(context);
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
  }

  return Promise.resolve(context);
});
