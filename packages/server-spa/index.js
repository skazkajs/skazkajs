const debug = require('debug')('skazka:server:spa');

const { createReadStream } = require('fs');

module.exports = root => context => new Promise((resolve, reject) => {
  debug('root:', root);

  const readStream = createReadStream(root);

  const response = context.res;

  response.setHeader('Content-Type', 'text/html;charset=UTF-8');

  const wrongFlowHandle = (error) => {
    debug('File error:');
    debug(error);

    readStream.destroy();
    response.statusCode = 500;
    response.end();
    reject(error);
  };

  readStream.pipe(response);

  readStream.on('error', wrongFlowHandle);

  response
    .on('error', wrongFlowHandle)
    .on('close', wrongFlowHandle)
    .on('finish', () => {
      debug('finish');
      reject();
    });
});
