const { SSM } = require('aws-sdk');

const getParameter = async (name, encrypted = true, options = {}) => {
  const response = await new SSM(options).getParameter({
    Name: name,
    WithDecryption: encrypted,
  }).promise();

  return response.Parameter.Value;
};

/**
 * names = [p1, p2, p3]
 * returns { p1: value, p2: value, p3: value }
 */
const getParameters = async (names, encrypted = true, options = {}) => {
  const response = await new SSM(options).getParameters({
    Names: names,
    WithDecryption: encrypted,
  }).promise();

  const parameters = {};

  response.Parameters.forEach(({ Name, Value }) => {
    parameters[Name] = Value;
  });

  return parameters;
};

module.exports = {
  getParameter,
  getParameters,
};
