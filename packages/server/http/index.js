const http = require('http');
const https = require('https');

const { isDevelopment } = require('@skazka/env');

/* istanbul ignore next */
const globalPort = parseInt(process.env.PORT || '3000', 10);

/**
 * Adding listeners to server
 */
/* istanbul ignore next */
const addListeners = (server, options = {}) => {
  const {
    port = globalPort,
    onClose,
  } = options;

  /**
   * Event listener for HTTP server "error" event.
   */
  /* istanbul ignore next */
  const onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        process.exit(1);
        break;
      case 'EADDRINUSE':
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  /**
   * Event listener for HTTP server "listening" event
   */
  /* istanbul ignore next */
  const onListening = (srv) => {
    if (isDevelopment) {
      const address = srv.address();
      const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
      console.log(`Listening on ${bind}`); // eslint-disable-line
    }
  };
  /**
   * Stop server
   */
  const stop = () => {
    server.close((err) => {
      if (err) {
        console.error(err); // eslint-disable-line
        process.exit(1);
      }

      process.exit();
    });
  };

  /**
   * Listen on provided port, on all network interfaces
   */
  server.on('listening', () => onListening(server));
  server.on('error', onError);
  server.listen(port);

  server.on('close', () => {
    process.removeAllListeners();
    server.removeAllListeners();

    if (onClose) {
      onClose();
    }
  });

  /**
   * Stop process
   */
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  process.on('SIGQUIT', stop);

  return server;
};

module.exports = {
  createHttpServer(app, options) {
    return addListeners(http.createServer(app.resolve()), options);
  },
  createHttpsServer(cert, app, options) {
    return addListeners(https.createServer(cert, app.resolve()), options);
  },
};
