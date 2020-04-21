const { expect } = require('../../../test.config');

const port = require('./port');

describe('SES port test', () => {
  it('It should test port', async () => {
    expect(port).to.be.equal('4579');
  });
});
