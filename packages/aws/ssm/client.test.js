const { SSM } = require('aws-sdk');

const { expect } = require('../../../test.config');

const client = require('./client');

describe('SSM client test', () => {
  it('It should test client', async () => {
    expect(client).to.be.an.instanceof(SSM);
  });
});
