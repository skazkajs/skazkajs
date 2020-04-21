const createError = (message, payload = null) => {
  const error = new Error(message);

  error.payload = payload;

  return error;
};

module.exports = createError;
