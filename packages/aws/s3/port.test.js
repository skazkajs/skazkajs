const { expect } = require('../../../test.config');

const port = require('./port');

describe('S3 port test', () => {
  it('It should test port', async () => {
    expect(port).to.be.equal('4572');
  });
});
