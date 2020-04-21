const pause = require('promise-pause-timeout');

const { expect, sinon } = require('../../../test.config');

const timeout = require('./timeout');
const retry = require('./retry');
const compose = require('./compose');

describe('Handler timeout test', () => {
  it('It should test timeout', async () => {
    const spy = sinon.spy();

    const handler = timeout(
      async (param) => {
        expect(param).to.be.equal(1);
        spy();
      },
      { seconds: 1 },
    );

    await handler(1);

    expect(spy.called).is.true();
  });

  it('It should test timeout with options', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const handler = timeout(
      async (param) => {
        expect(param).to.be.equal(1);
        await pause(2000);

        spy1();
      },
      {
        seconds: 1,
        errorHandler: async (err) => {
          expect(err.message).to.be.equal('Timeout: 1 seconds!');

          spy2();
        },
      },
    );

    try {
      await handler(1);
    } catch (e) {
      expect(e.message).to.be.equal('Timeout: 1 seconds!');

      spy3();
    }

    expect(spy1.called).is.false();
    expect(spy2.called).is.true();
    expect(spy3.called).is.true();
  });

  it('It should test timeout with compose', async () => {
    const spy = sinon.spy();

    const wrapper = compose(
      timeout(null, { seconds: 1 }),
    );

    const handler = wrapper((param) => {
      expect(param).to.be.equal(1);

      spy();
    });

    await handler(1);

    expect(spy.called).is.true();
  });

  it('It should test timeout with retry', async () => {
    const spy = sinon.spy();

    const handler = await timeout(
      retry(
        async (param) => {
          expect(param).to.be.equal(1);

          spy();
        },
        { count: 1 },
      ),
      { seconds: 1 },
    );

    await handler(1);

    expect(spy.called).is.true();
  });
});
