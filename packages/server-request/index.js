const debug = require('debug')('skazka:server:request:index');

const Request = require('./request');

debug('Request module created');

module.exports = () => async (context) => {
  debug('Creating request');

  const req = context.get('req');

  const request = (new Request())
    .set('headers', req.headers)
    .set('rawHeaders', req.rawHeaders)
    .set('aborted', req.aborted)
    .set('url', req.url)
    .set('method', req.method)
    .set('statusCode', req.statusCode)
    .set('statusMessage', req.statusMessage)
    .set('httpVersionMajor', req.httpVersionMajor)
    .set('httpVersionMinor', req.httpVersionMinor)
    .set('httpVersion', req.httpVersion)
    .set('complete', req.complete);

  context.set('request', request);
};
