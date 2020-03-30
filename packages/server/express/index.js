const moduleBuilder = require('@skazka/server-module');

module.exports = moduleBuilder((context, middleware) => new Promise((resolve, reject) => {
  context.res.on('finish', reject);

  middleware(context.req, context.res, (error) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
}));
