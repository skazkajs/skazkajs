const http = require('http');
const https = require('https');

const { isDevelopment } = require('@skazka/env');

const addListeners = (server, port = parseInt(process.env.PORT || '3000', 10)) => {
  if (isDevelopment) {
    console.log(`http://localhost:${port}/`); // eslint-disable-line
  }

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
