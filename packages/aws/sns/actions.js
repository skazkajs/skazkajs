const client = require('./client');

const sendSMS = async (params) => client.publish(params).promise();

module.exports = {
  sendSMS,
};
