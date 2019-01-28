const debug = require('debug')('skazka:server:static:cache');

module.exports = async (eTag, ctx) => {
  debug('eTag:', eTag);

  if (ctx.get('req').headers['if-none-match']) {
    ctx.get('req').headers.etag = ctx.get('req').headers['if-none-match'];
    debug('If-None-Match: %s', ctx.get('req').headers['if-none-match']);
  }

  if (eTag && ctx.get('req').headers.etag) {
    debug('ETag: %s', ctx.get('req').headers.etag);

    ctx.get('res').statusCode = 304;
    debug('Status code:', ctx.get('res').statusCode);

    ctx.get('res').end();
    debug('End of response');

    return Promise.reject();
  }

  if (ctx.get('req').headers['if-modified-since']) {
    debug('If-Modified-Since: %s', ctx.get('req').headers['if-modified-since']);

    ctx.get('res').statusCode = 304;
    debug('Status code:', ctx.get('res').statusCode);

    ctx.get('res').end();
    debug('End of response');

    return Promise.reject();
  }

  return Promise.resolve();
};
