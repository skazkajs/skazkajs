const { expect, sinon } = require('../../../test.config');

const recursive = require('./recursive');

describe('Handler recursive test', () => {
  it('It should test recursive', async () => {
    const spy = sinon.spy();

    const handler = async (param) => {
      expect(param).to.be.equal(1);

      spy();
    };

    await recursive(handler, [1]);

    expect(spy.called).is.true();
  });
});
