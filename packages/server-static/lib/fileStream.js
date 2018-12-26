const debug = require('debug')('skazka:server:static:file');

const { createReadStream } = require('fs');

module.exports = (path, response) => new Promise((resolve, reject) => {
  debug('Path:', path);

  const readStream = createReadStream(path);

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
      resolve();
    });

  // for testing
  if (global.serverTestReadStream) {
    debug('serverTestReadStream');

    readStream.emit('error', new Error('Read stream test error'));
  }

  if (global.serverTestResponseError) {
    debug('serverTestResponseError');

    response.emit('error', new Error('Response test error'));
  }

  if (global.serverTestResponseClose) {
    debug('serverTestResponseClose');

    response.emit('close');
  }
});
