module.exports = async (eTag, ctx) => {
  if (ctx.get('req').headers['if-none-match']) {
    ctx.get('req').headers.etag = ctx.get('req').headers['if-none-match'];
  }

  if (eTag && ctx.get('req').headers.etag) {
    ctx.get('res').statusCode = 304;

    ctx.get('res').end();

    return Promise.reject();
  }

  if (ctx.get('req').headers['if-modified-since']) {
    ctx.get('res').statusCode = 304;

    ctx.get('res').end();

    return Promise.reject();
  }

  return Promise.resolve();
};
