const { expect, sinon } = require('../../../test.config');

const rowWrapper = require('./rowWrapper');

const compose = require('./compose');

describe('Handler rowWrapper test', () => {
  it('It should test rowWrapper', async () => {
    const spy = sinon.spy();

    const handler = rowWrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy();
      },
    );

    await handler(1);

    expect(spy.called).is.true();
  });

  it('It should test rowWrapper with error', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error = new Error('test');

    const handler = rowWrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy1();

        throw error;
      },
      {
        throwError: true,
        errorHandler: async (err, payload) => {
          expect(err).to.be.equal(error);
          expect(payload).to.be.eql([1]);

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

  it('It should test rowWrapper without throwError', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error = new Error('test');

    const handler = rowWrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy1();

        throw error;
      },
      {
        throwError: false,
        errorHandler: async (err, payload) => {
          expect(err).to.be.equal(error);
          expect(payload).to.be.eql([1]);

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
    expect(spy3.called).is.false();
  });

  it('It should test rowWrapper with compose', async () => {
    const spy = sinon.spy();

    const wrapper = compose(
      rowWrapper(),
    );

    const handler = wrapper((param) => {
      expect(param).to.be.equal(1);

      spy();
    });

    await handler(1);

    expect(spy.called).is.true();
  });
});
