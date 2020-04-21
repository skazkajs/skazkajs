const { expect } = require('../../../test.config');

const clearData = require('./clearData');

describe('DynamoDB clearData test', () => {
  it('It should test clearData', async () => {
    expect(clearData({ test: true, data: '' })).to.be.eql({
      test: true,
      data: null,
    });
  });
});
