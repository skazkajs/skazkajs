module.exports = async (method) => {
  const error = new Error();
  error.code = 'ENOENT';

  return ['HEAD', 'GET'].includes(method) ? Promise.resolve() : Promise.reject(error);
};
