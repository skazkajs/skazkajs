const debug = require('debug')('skazka:server:express');

module.exports = fn => async (context) => {
  debug('Express wrapper created');
  return new Promise((resolve, reject) => {
    context.res.on('finish', () => {
      debug('Express middleware finished');
      reject();
    });
    fn(context.req, context.res, (error) => {
      debug('Express middleware running');

      if (error) {
        debug('Express middleware error:');
        debug(error);

        reject(error);
      } else {
        debug('Express middleware next');

        resolve();
      }
    });
  });
};
