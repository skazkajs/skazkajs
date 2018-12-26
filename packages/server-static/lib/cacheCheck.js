const debug = require('debug')('skazka:server:static:cache');

module.exports = async (eTag, ctx) => {
  debug('eTag:', eTag);

  if (ctx.req.headers['if-none-match']) {
    ctx.req.headers.etag = ctx.req.headers['if-none-match'];
    debug('If-None-Match: %s', ctx.req.headers['if-none-match']);
  }

  if (eTag && ctx.req.headers.etag) {
    debug('ETag: %s', ctx.req.headers.etag);

    ctx.res.statusCode = 304;
    debug('Status code:', ctx.res.statusCode);

    ctx.res.end();
    debug('End of response');

    return Promise.reject();
  }

  if (ctx.req.headers['if-modified-since']) {
    debug('If-Modified-Since: %s', ctx.req.headers['if-modified-since']);

    ctx.res.statusCode = 304;
    debug('Status code:', ctx.res.statusCode);

    ctx.res.end();
    debug('End of response');

    return Promise.reject();
  }

  return Promise.resolve();
};
