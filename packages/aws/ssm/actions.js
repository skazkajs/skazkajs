const ssm = require('./client');

const getParameter = async (name, encrypted = true) => {
  const response = await ssm.getParameter({ Name: name, WithDecryption: encrypted }).promise();

  return response.Parameter.Value;
};

/**
 * names = [p1, p2, p3]
 * returns { p1: value, p2: value, p3: value }
 */
const getParameters = async (names, encrypted = true) => {
  const response = await ssm.getParameters({ Names: names, WithDecryption: encrypted }).promise();

  const parameters = {};

  response.Parameters.forEach(({ Name, Value }) => {
    parameters[Name] = Value;
  });

  return parameters;
};

const putParameter = async (name, value, encrypted, params = {}) => {
  const parameterOptions = {
    Name: name,
    Value: value,
    Type: encrypted ? 'SecureString' : 'String',
    ...params,
  };

  return ssm.putParameter(parameterOptions).promise();
};

const deleteParameter = async (name) => ssm.deleteParameter({ Name: name }).promise();

const deleteParameters = async (names) => ssm.deleteParameters({ Names: names }).promise();

module.exports = {
  getParameter,
  getParameters,
  putParameter,
  deleteParameter,
  deleteParameters,
};
