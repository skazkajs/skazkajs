const { expect } = require('../../../test.config');

const port = require('./port');

describe('SNS port test', () => {
  it('It should test port', async () => {
    expect(port).to.be.equal('4575');
  });
});
