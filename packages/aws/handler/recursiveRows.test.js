const { expect, sinon } = require('../../../test.config');

const recursiveRows = require('./recursiveRows');

describe('Handler recursiveRows test', () => {
  it('It should test recursiveRows', async () => {
    const spy = sinon.spy();

    const processRow = async (param) => {
      expect(param).to.be.equal(1);

      spy();
    };

    await recursiveRows(processRow, [1]);

    expect(spy.called).is.true();
  });
});
