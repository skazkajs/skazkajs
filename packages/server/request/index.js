const moduleBuilder = require('@skazka/server-module');

const Request = require('./request');

module.exports = moduleBuilder(async (context) => {
  const {
    headers,
    rawHeaders,
    aborted,
    url,
    method,
    statusCode,
    statusMessage,
    httpVersionMajor,
    httpVersionMinor,
    httpVersion,
    complete,
  } = context.get('req');

  const request = (new Request())
    .set('headers', headers)
    .set('rawHeaders', rawHeaders)
    .set('aborted', aborted)
    .set('url', url)
    .set('method', method)
    .set('statusCode', statusCode)
    .set('statusMessage', statusMessage)
    .set('httpVersionMajor', httpVersionMajor)
    .set('httpVersionMinor', httpVersionMinor)
    .set('httpVersion', httpVersion)
    .set('complete', complete);

  context.set('request', request);
});
