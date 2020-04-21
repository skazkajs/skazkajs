const { expect, sinon } = require('../../../test.config');

const retry = require('./retry');
const compose = require('./compose');

describe('Handler retry test', () => {
  it('It should test retry', async () => {
    const spy = sinon.spy();

    const handler = retry(
      async (param) => {
        expect(param).to.be.equal(1);

        spy();

        return 2;
      },
    );

    const response = await handler(1);

    expect(response).to.be.equal(2);

    expect(spy.called).is.true();
  });

  it('It should test retry with options', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error = new Error('test');

    const handler = retry(
      async (param) => {
        expect(param).to.be.equal(1);

        spy1();

        throw error;
      },
      {
        count: 2,
        timeout: 1,
        errorHandler: async (err) => {
          expect(err).to.be.equal(error);

          spy2();
        },
      },
    );

    try {
      await handler(1);
    } catch (e) {
      expect(e).to.be.equal(error);

      spy3();
    }

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
    expect(spy3.called).is.true();
  });

  it('It should test timeout with compose', async () => {
    const spy = sinon.spy();

    const wrapper = compose(
      retry(null, { count: 1 }),
    );

    const handler = wrapper((param) => {
      expect(param).to.be.equal(1);

      spy();
    });

    await handler(1);

    expect(spy.called).is.true();
  });
});
