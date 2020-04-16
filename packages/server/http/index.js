const http = require('http');
const https = require('https');

const { isDevelopment } = require('@skazka/env');

/* istanbul ignore next */
const addListeners = (server, port = parseInt(process.env.PORT || '3000', 10)) => {
  /* istanbul ignore next */
  if (isDevelopment) {
    console.log(`http://localhost:${port}/`); // eslint-disable-line
  }

  /* istanbul ignore next */
  server.on('error', (error) => {
    console.error(error); // eslint-disable-line

    process.exit(1);
  });

  server.listen(port);

  return server;
};

module.exports = {
  createHttpServer(app, port) {
    return addListeners(http.createServer(app.resolve()), port);
  },
  createHttpsServer(cert, app, port) {
    return addListeners(https.createServer(cert, app.resolve()), port);
  },
};
