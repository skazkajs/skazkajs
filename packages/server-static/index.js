const debug = require('debug')('skazka:server:static:index');

const methodCheck = require('./lib/methodCheck');
const cacheCheck = require('./lib/cacheCheck');
const getPath = require('./lib/getPath');
const getStats = require('./lib/getStats');
const getType = require('./lib/getType');
const getEncoding = require('./lib/getEncoding');
const fileStream = require('./lib/fileStream');
const gzipFileStream = require('./lib/gzipFileStream');

module.exports = ({
  root = __dirname,
  index = 'index.html',
  etag = true,
  gzip = true,
  maxage = 0,
} = {}) => async (context) => {
  debug('Server Static');

  debug('root:', root);
  debug('index:', index);
  debug('etag:', etag);
  debug('gzip:', gzip);
  debug('maxage:', maxage);

  debug('Headers: %O', context.req.headers);

  try {
    await methodCheck(context.req.method.toUpperCase());
    await cacheCheck(etag, context);
    const path = await getPath(root, index, context.req.url);
    const stats = await getStats(index, path);
    const newPath = stats.path;
    const type = getType(newPath);
    const encoding = getEncoding(context.req.headers['accept-encoding']);

    if (etag) {
      context.res.setHeader('ETag', context.req.url);
      debug('ETag: %s', context.req.url);
    }

    context.res.setHeader('Last-Modified', stats.mtime.toUTCString());
    debug('Last-Modified: %s', stats.mtime.toUTCString());

    if (maxage) {
      const age = maxage / 1000;
      context.res.setHeader('Cache-Control', `max-age=${age}`);
      debug('Cache-Control: %s', `max-age=${age}`);
    }

    context.res.setHeader('Content-Type', type);
    debug('Content-Type: %s', type);

    if (gzip) {
      context.res.setHeader('Content-Encoding', encoding);
      debug('Content-Encoding: %s', encoding);
    }

    context.res.statusCode = 200; // eslint-disable-line
    debug('Status code:', 200);

    if (gzip) {
      debug('gzip enabled!');
      debug('Encoding: %s', encoding);

      await gzipFileStream(newPath, context.res, encoding);
    } else {
      await fileStream(newPath, context.res);
    }
  } catch (error) {
    debug('Error: %O', error);

    if (error) {
      if (!['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'].includes(error.code)) {
        return Promise.reject(error);
      }

      return Promise.resolve();
    }
  }

  return Promise.reject();
};
