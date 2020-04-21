const { expect, sinon } = require('../../../test.config');

const createError = require('./createError');

describe('Error createError test', () => {
  it('It should test createError', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();

    try {
      throw createError('test');
    } catch (e) {
      expect(e.message).to.be.equal('test');
      expect(e.payload).is.null();

      spy1();
    }

    try {
      throw createError('test', 'payload');
    } catch (e) {
      expect(e.message).to.be.equal('test');
      expect(e.payload).to.be.equal('payload');

      spy2();
    }

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
  });
});
