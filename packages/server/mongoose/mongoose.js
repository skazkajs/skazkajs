const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = global.Promise;

/* istanbul ignore next */
mongoose.connect(config.mongoose.uri, config.mongoose.parameters).catch(() => {
  process.exit(1);
});

// If the Node process ends, close the Mongoose connection
/* istanbul ignore next */
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

module.exports = mongoose;
