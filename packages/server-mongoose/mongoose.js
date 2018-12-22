const debug = require('debug')('skazka:server:mongoose:mongoose');

const mongoose = require('mongoose');
const config = require('config');

debug('Config:', config.mongoose);

mongoose.Promise = global.Promise;

mongoose.connect(config.mongoose.uri, config.mongoose.parameters).catch((err) => {
  debug('MongoDB connection error:', err);

  process.exit(1);
});

mongoose.connection.on('open', () => {
  debug('MongoDB event: open');
  debug('MongoDB connected [%s]', config.mongoose.uri);

  mongoose.connection.on('connected', () => {
    debug('MongoDB event: connected');
  });

  mongoose.connection.on('disconnected', () => {
    debug('MongoDB event: disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    debug('MongoDB event: reconnected');
  });

  mongoose.connection.on('error', (err) => {
    debug('MongoDB event: error:', err);
  });
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    debug('Mongoose default connection disconnected through app termination');

    process.exit(0);
  });
});

module.exports = mongoose;
