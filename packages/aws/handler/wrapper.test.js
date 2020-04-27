/* eslint no-console: 0 */

const { expect, sinon } = require('../../../test.config');

const wrapper = require('./wrapper');

const compose = require('./compose');

describe('Handler wrapper test', () => {
  it('It should test wrapper', async () => {
    const spy = sinon.spy();

    const handler = wrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy();

        return 123;
      },
    );

    const response = await handler(1);

    expect(spy.called).is.true();
    expect(response).to.be.equal(123);
  });

  it('It should test wrapper with error', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error = new Error('test');

    const handler = wrapper(
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

  it('It should test wrapper without throwError', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error = new Error('test');

    const handler = wrapper(
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

  it('It should test wrapper with compose', async () => {
    const spy = sinon.spy();

    const handler = compose(wrapper())((param) => {
      expect(param).to.be.equal(1);

      spy();
    });

    await handler(1);

    expect(spy.called).is.true();
  });

  it('It should test wrapper with error in error handler', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error1 = new Error('test1');
    const error2 = new Error('test2');

    sinon.stub(console, 'error');

    const handler = wrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy1();

        throw error1;
      },
      {
        throwError: true,
        errorHandler: async (err, payload) => {
          expect(err).to.be.equal(error1);
          expect(payload).to.be.eql([1]);

          spy2();

          throw error2;
        },
      },
    );

    try {
      await handler(1);
    } catch (e) {
      expect(e).to.be.equal(error1);

      spy3();
    }

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
    expect(spy3.called).is.true();

    expect(console.error.args).to.be.eql([]);

    console.error.restore();
  });

  it('It should test wrapper with error in error handler for production', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error1 = new Error('test1');
    const error2 = new Error('test2');

    sinon.stub(console, 'error');

    const handler = wrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy1();

        throw error1;
      },
      {
        throwError: true,
        errorHandler: async (err, payload) => {
          expect(err).to.be.equal(error1);
          expect(payload).to.be.eql([1]);

          spy2();

          throw error2;
        },
      },
    );

    process.env.STAGE = 'production';

    try {
      await handler(1);
    } catch (e) {
      expect(e).to.be.equal(error1);

      spy3();
    }

    delete process.env.STAGE;

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
    expect(spy3.called).is.true();

    expect(console.error.args[0][0]).to.be.equal(error1);
    expect(console.error.args[0][1]).to.be.equal(error2);

    console.error.restore();
  });
});
