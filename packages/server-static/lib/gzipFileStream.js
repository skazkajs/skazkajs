const debug = require('debug')('skazka:server:static:gzip');

const { createReadStream } = require('fs');
const zlib = require('zlib');

module.exports = (path, response, encoding) => new Promise((resolve, reject) => {
  debug('Path:', path);
  debug('Encoding:', encoding);

  const zipStream = encoding === 'deflate' ? zlib.createDeflate() : zlib.createGzip();
  const readStream = createReadStream(path);

  const wrongFlowHandle = (error) => {
    debug('Encoding error:');
    debug(error);

    zipStream.end();
    readStream.destroy();
    response.statusCode = 500;
    response.end();
    reject(error);
  };

  readStream.pipe(zipStream).pipe(response);

  readStream.on('error', wrongFlowHandle);
  zipStream.on('error', wrongFlowHandle);

  response
    .on('error', wrongFlowHandle)
    .on('close', wrongFlowHandle)
    .on('finish', () => {
      debug('Encoding finish');
      resolve();
    });


  // for testing
  if (global.serverZipTestReadStream) {
    debug('serverZipTestReadStream');

    readStream.emit('error', new Error('Read stream test error'));
  }

  if (global.serverZipTestZipStream) {
    debug('serverZipTestZipStream');

    zipStream.emit('error', new Error('Zip stream test error'));
  }

  if (global.serverZipTestResponseError) {
    debug('serverZipTestResponseError');

    response.emit('error', new Error('Zip stream test error'));
  }

  if (global.serverZipTestResponseClose) {
    debug('serverZipTestResponseClose');

    response.emit('close');
  }
});
