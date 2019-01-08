const debug = require('debug')('skazka:server:http');

const http = require('http');
const https = require('https');

/**
 * Adding listeners to server
 */
/* istanbul ignore next */
const addListeners = (server, port) => {
  /**
   * Event listener for HTTP server "error" event.
   */
  /* istanbul ignore next */
  const onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        debug(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        debug(`${bind} is already in use`);
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
    const address = srv.address();
    const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
    debug(`Listening on ${bind}`);
  };
  /**
   * Stop server
   */
  const stop = () => {
    server.close(() => {
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
    debug('Server stop');
    process.removeAllListeners();
    server.removeAllListeners();
  });


  /**
   * Stop process
   */
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  return server;
};

/* istanbul ignore next */
const globalPort = parseInt(process.env.PORT || '3000', 10);

module.exports = {
  createHttpServer(app, port = globalPort) {
    return addListeners(http.createServer(app.resolve()), port);
  },
  createHttpsServer(options, app, port = globalPort) {
    return addListeners(https.createServer(options, app.resolve()), port);
  },
};
