const { expect } = require('../../../test.config');

const actions = require('./actions');
const Email = require('./email');

describe('SES actions test', () => {
  const testEmail = 'test@test.test';

  it('It should verify email identity', async () => {
    const response = await actions.verifyEmailIdentity(testEmail);

    expect(response).to.have.property('ResponseMetadata');
    expect(response.ResponseMetadata).to.have.property('RequestId');
  });

  it('It should test sendEmail', async () => {
    const email = new Email()
      .addTo(testEmail)
      .addCc(testEmail)
      .setSource(testEmail)
      .setSubject('Subject')
      .setHtml('html');

    const response = await actions.sendEmail(email.getParams());

    expect(response).to.have.property('ResponseMetadata');
    expect(response.ResponseMetadata).to.have.property('RequestId');

    expect(response).to.have.property('MessageId');
  });
});
