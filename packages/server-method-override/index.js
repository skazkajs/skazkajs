const debug = require('debug')('skazka:server:method-override');

const methods = require('methods');

const methodExists = method => methods.includes(method.toLowerCase());

module.exports = () => async (context) => {
  debug('Method override');

  let { method } = context.req;

  debug('Original method: %s', method);

  // wrapper
  if (
    context.req.body
    && context.req.body._method // eslint-disable-line
    && methodExists(context.req.body._method) // eslint-disable-line
  ) {
    method = context.req.body._method.toUpperCase(); // eslint-disable-line
  }

  // body parser
  if (
    context.request
    && context.request.body
    && context.request.body._method // eslint-disable-line
    && methodExists(context.request.body._method) // eslint-disable-line
  ) {
    method = context.request.body._method.toUpperCase(); // eslint-disable-line
  }

  // header support
  const header = context.req.headers['x-http-method-override'] || context.req.headers['access-control-request-method'];

  if (header && methodExists(header)) {
    method = header.toUpperCase();
  }

  context.req.method = method; // eslint-disable-line

  debug('New method: %s', method);
};
