const { SES } = require('aws-sdk');

const { expect } = require('../../../test.config');

const client = require('./client');

describe('SES client test', () => {
  it('It should test client', async () => {
    expect(client).to.be.an.instanceof(SES);
  });
});
