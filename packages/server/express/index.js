const debug = require('debug')('skazka:server:express');

const moduleBuilder = require('@skazka/server-module');

module.exports = moduleBuilder((context, middleware) => {
  debug('Express wrapper created');

  return new Promise((resolve, reject) => {
    context.res.on('finish', () => {
      debug('Express middleware finished');

      reject();
    });

    middleware(context.req, context.res, (error) => {
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
});
