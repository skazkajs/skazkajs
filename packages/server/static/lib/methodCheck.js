const debug = require('debug')('skazka:server:static:head');

module.exports = async (method) => {
  debug('Method: %s', method);

  const error = new Error();
  error.code = 'ENOENT';

  return ['HEAD', 'GET'].includes(method) ? Promise.resolve() : Promise.reject(error);
};
