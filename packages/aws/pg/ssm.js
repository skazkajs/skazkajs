const { getParameters } = require('../ssm');

const createPool = require('./pool');

const createPoolSSM = async (dbOptions = {}, names = [], encrypted = true, ssmOptions = {}) => {
  const ssmParameters = await getParameters(names, encrypted, ssmOptions);

  const options = { ...dbOptions };

  Object.keys(options).forEach((key) => {
    if (ssmParameters[key]) {
      options[key] = ssmParameters[key];
    }
  });

  return createPool(options);
};

module.exports = createPoolSSM;
