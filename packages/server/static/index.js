const moduleBuilder = require('@skazka/server-module');

const methodCheck = require('./lib/methodCheck');
const cacheCheck = require('./lib/cacheCheck');
const getPath = require('./lib/getPath');
const getStats = require('./lib/getStats');
const getType = require('./lib/getType');
const getEncoding = require('./lib/getEncoding');
const fileStream = require('./lib/fileStream');
const gzipFileStream = require('./lib/gzipFileStream');

module.exports = moduleBuilder(async (context, options = {}) => {
  const {
    root = __dirname,
    index = 'index.html',
    etag = true,
    gzip = true,
    maxage = 0,
  } = options;

  try {
    await methodCheck(context.get('req').method.toUpperCase());
    await cacheCheck(etag, context);
    const path = await getPath(root, index, context.get('req').url);
    const stats = await getStats(index, path);
    const newPath = stats.path;
    const type = getType(newPath);
    const encoding = getEncoding(context.get('req').headers['accept-encoding']);

    if (etag) {
      context.res.setHeader('ETag', context.get('req').url);
    }

    context.get('res').setHeader('Last-Modified', stats.mtime.toUTCString());

    if (maxage) {
      const age = maxage / 1000;
      context.get('res').setHeader('Cache-Control', `max-age=${age}`);
    }

    context.get('res').setHeader('Content-Type', type);

    if (gzip) {
      context.get('res').setHeader('Content-Encoding', encoding);
    }

    context.get('res').statusCode = 200; // eslint-disable-line

    if (gzip) {
      await gzipFileStream(newPath, context.get('res'), encoding);
    } else {
      await fileStream(newPath, context.get('res'));
    }
  } catch (error) {
    if (error) {
      if (!['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(error.code)) {
        error.code = 403;

        return Promise.reject(error);
      }

      return Promise.resolve();
    }
  }

  return Promise.reject();
});
