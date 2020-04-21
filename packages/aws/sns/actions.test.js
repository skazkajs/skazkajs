const { expect } = require('../../../test.config');

const actions = require('./actions');
const SMS = require('./sms');

describe('SNS actions test', () => {
  it('It should test sendingSMS', async () => {
    const sms = new SMS().setSender('SENDER').setPhone('+19999999999').setMessage('Message');

    const response = await actions.sendSMS(sms.getParams());

    expect(response).to.have.property('ResponseMetadata');
    expect(response.ResponseMetadata).to.have.property('RequestId');

    expect(response).to.have.property('MessageId');
  });
});
