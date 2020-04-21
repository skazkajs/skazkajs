const { isDev } = require('../env');

const defaultErrorHandler = async (error, payload = null) => {
  if (!isDev()) {
    console.error(error, payload); // eslint-disable-line
  }
};

module.exports = defaultErrorHandler;
