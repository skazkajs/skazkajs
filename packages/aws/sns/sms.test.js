const { expect } = require('../../../test.config');

const SMS = require('./sms');

describe('SNS sms test', () => {
  it('It should test default flow', async () => {
    const params = new SMS()
      .setSender('SENDER')
      .setPhone('+19999999999')
      .setMessage('Message')
      .getParams();

    expect(params.Message).to.be.equal('Message');
    expect(params.MessageAttributes['AWS.SNS.SMS.SMSType'].DataType).to.be.equal('String');
    expect(params.MessageAttributes['AWS.SNS.SMS.SMSType'].StringValue).to.be.equal('Transactional');
    expect(params.MessageAttributes['AWS.SNS.SMS.SenderID'].DataType).to.be.equal('String');
    expect(params.MessageAttributes['AWS.SNS.SMS.SenderID'].StringValue).to.be.equal('SENDER');
    expect(params.PhoneNumber).to.be.equal('+19999999999');
  });
});
