const factory = require('./factory');

const defaultErrorHandler = require('../error/defaultErrorHandler');

const timeout = factory(async (handler, options, args) => {
  const {
    seconds,
    errorHandler = defaultErrorHandler,
  } = (options || {});

  try {
    let id;

    return await Promise.race([
      new Promise((resolve, reject) => {
        id = setTimeout(() => {
          clearTimeout(id);

          reject(new Error(`Timeout: ${seconds} seconds!`));
        }, seconds * 1000);
      }),
      handler(...args),
    ]).then((result) => {
      clearTimeout(id);

      return result;
    }).catch((error) => {
      clearTimeout(id);

      return Promise.reject(error);
    });
  } catch (error) {
    try {
      await errorHandler(error, args);
    } catch (err) {
      await defaultErrorHandler(error, err);
    }

    throw error;
  }
});

module.exports = timeout;
