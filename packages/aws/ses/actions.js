const client = require('./client');

const sendEmail = async (params) => client.sendEmail(params).promise();

const verifyEmailIdentity = async (email) => (
  client.verifyEmailIdentity({ EmailAddress: email }).promise()
);

module.exports = {
  sendEmail,
  verifyEmailIdentity,
};
