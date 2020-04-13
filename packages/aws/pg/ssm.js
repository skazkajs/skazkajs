const { getParameters } = require('../ssm/actions');

const createPool = require('./pool');

const createPoolSSM = async (dbOptions, names, encrypted) => {
  const ssmParameters = await getParameters(names, encrypted);

  const options = { ...dbOptions };

  Object.keys(options).forEach((key) => {
    if (ssmParameters[options[key]]) {
      options[key] = ssmParameters[options[key]];
    }
  });

  return createPool(options);
};

module.exports = createPoolSSM;
