const { expect, sinon } = require('../../../test.config');

const retries = require('./retries');

describe('Handler retries test', () => {
  it('It should test retries', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();

    const handler = retries(
      [
        async (param) => {
          expect(param).to.be.equal(1);

          spy1();
        },
        async (param) => {
          expect(param).to.be.equal(1);

          spy2();
        },
      ],
      { count: 1 },
    );

    await handler(1);

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
  });
});
