const debug = require('debug')('skazka:server:static:encoding');

module.exports = (contentEncoding = '') => {
  debug('Content encoding:', contentEncoding);

  const encoding = contentEncoding.includes('deflate') ? 'deflate' : 'gzip';

  debug('Encoding:', encoding);

  return encoding;
};
