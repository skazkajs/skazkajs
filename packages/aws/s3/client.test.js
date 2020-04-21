const { S3 } = require('aws-sdk');

const { expect } = require('../../../test.config');

const client = require('./client');

describe('S3 client test', () => {
  it('It should test client', async () => {
    expect(client).to.be.an.instanceof(S3);
  });
});
