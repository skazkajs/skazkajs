const factory = (body) => (handler = null, options = {}) => {
  const method = (func) => async (...args) => body(func, options, args);

  return handler ? method(handler) : method;
};

module.exports = factory;
